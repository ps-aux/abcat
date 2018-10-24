import { interval } from 'rxjs'
import { eventOf } from '../event/Event'
import { VOTE_ADDED } from '../cat/voting/events'

const updateCat = async ({catRepo, vote, mongoOpts}) => {
  const id = vote.pickId
  const cat = await catRepo.getById(id, mongoOpts)

  cat.voteCount = cat.voteCount + 1
  cat.lastVoteTime = vote.time

  await catRepo.update(cat, mongoOpts)
}

const setupLostVoteEventReplayer = ({checkInterval, voteEventDao, eventBus}) => {
  const log = Log({name: 'lost-vote-event-replayer'})

  interval(checkInterval)
    .subscribe(async () => {
      log.trace('Checking not applied vote events')
      const votes = await voteEventDao.getUnappliedEvents()

      if (votes.length > 0) {
        log.debug(`Found ${votes.length} unapplied events. Replaying`)
        votes.forEach(v =>
          eventBus.publish(eventOf(VOTE_ADDED, v)))
      }

    })
}

const VoteEventDao = ({mongo}) => {
  const votes = mongo.db.collection('vote')

  const updateMark = '_event.catUpdated'

  return {
    markCatUpdated: ({id}, opts) =>
      votes.updateOne({_id: id}, {$set: {[updateMark]: true}}, opts),

    getUnappliedEvents: () => votes.find({[updateMark]: false}).toArray()
  }
}

export const setupCatUpdater = ({eventBus, mongo, catRepo}) => {
  const log = Log({name: 'cat-vote-updater'})
  const voteEventDao = VoteEventDao({mongo})

  eventBus.events({type: VOTE_ADDED})
    .subscribe(async ({payload: vote}) => {

      log.trace('Updating a cat from', vote)

      // There can be write conflict if parallel votes update the same cat in transaction
      // We simple try again
      mongo.retry(
        () => mongo.inTx(async mongoOpts => {
          await updateCat({catRepo, mongoOpts, vote})
          await voteEventDao.markCatUpdated({id: vote.id}, mongoOpts)
        }), {maxCount: 10, delay: 4000})

    })

  setupLostVoteEventReplayer({checkInterval: 0.5 * 60 * 1000, voteEventDao, eventBus})
}