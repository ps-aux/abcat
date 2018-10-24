import Change from 'chance'
import { ObjectId } from 'mongodb'
import { VoteRepo } from './VoteRepo'
import { VOTE_ADDED } from './events'
import { eventOf } from '../../event/Event'
import { randomPick } from '../../random/randomPick'

const chance = new Change(Date.now())

const PairGenerator = ({catRepo}) => async () => {
  const min = 0
  const max = await catRepo.count()

  const randId = () => chance.integer({min, max})

  const aId = randId()
  let bId
  while (bId == null || bId === aId) {
    bId = randId()
  }

  return {
    aId: aId.toString(),
    bId: bId.toString()
  }
}

const PairRepo = ({catRepo}) => {

  const fromIds = async ({aId, bId}) => {
    const a = await catRepo.getById(aId)
    const b = await catRepo.getById(bId)

    return {a, b}
  }

  return {
    fromIds
  }
}

const storeVote = async ({
                           voteRepo,
                           vote: {pair, pickId},
                           sessionId
                         }) => {
  const previousVote = await voteRepo.getByPairId({
    sessionId,
    pairId: pair
  })

  const id = new ObjectId()
  const vote = ({
    _id: id,
    id,
    session: sessionId,
    time: new Date(),
    pickId,
    pair,
    repeatedVote: {
      isRepeated: !!previousVote,
      samePickAsLastTime: previousVote && (previousVote.pickId === pickId)
    },
    _event: {
      catUpdated: false
    }
  })

  await voteRepo.save(vote)

  return vote
}

const reuseOldVote = ({randomArrayPick, votes, previousPair, log}) => {
  let tryCount = 0
  while (true) {
    const v = randomArrayPick(votes)
    const reusedPair = v.pair

    if (!previousPair)
      return reusedPair

    // Don't reuse old pair with any cat from the current vote
    if (reusedPair.aId !== previousPair.aId &&
      reusedPair.bId !== previousPair.bId)
      return reusedPair

    // Prevent infinity loop in case of bad data
    if (tryCount > votes.length) {
      log.error('Could not pick the satisfying old pair from the old votes', {previousPair})
      return reusedPair
    }
  }

}

const NextPairHandler = ({
                           eventBus, mongo, catRepo, genPair,
                           pairRepo, voteRepo,
                           randomArrayPick, randomProbPick
                         }) => {

  const log = Log({name: 'next-pair-handler'})

  return async ({sessionId, vote}) => {
    log.debug('Next pair for', {sessionId, vote})

    if (vote) {
      const storedVote = await storeVote({voteRepo, vote, sessionId})
      // Eventual consistency
      eventBus.publish(eventOf(VOTE_ADDED, storedVote))
    }

    const votes = await voteRepo.getBySession({sessionId})
    const pairIdsGen = votes.length <= 10 ?
      genPair :
      randomProbPick([{
        p: 50,
        value: genPair
      }, {
        p: 50,
        value: () => reuseOldVote({randomArrayPick, votes, previousPair: vote && vote.pair})
      }])

    const pairIds = await pairIdsGen()

    log.trace('Next pair will be', pairIds)
    return pairRepo.fromIds(pairIds)

  }
}

const isInvalid = ({vote, sessionId}) => {
  // Simple validation
  if (!sessionId) {
    return true
  }
  if (vote) {
    if (typeof vote.pickId !== 'string')
      return true
    if (typeof vote.pair.aId !== 'string')
      return true
    if (typeof vote.pair.bId !== 'string')
      return true
  }
}

export const votingApi = ({router, catRepo, mongo, eventBus}) => {

  const pairRepo = PairRepo({mongo, catRepo})
  const genPair = PairGenerator({catRepo})
  const voteRepo = VoteRepo({mongo})

  const nextPair = NextPairHandler({
    eventBus, mongo,
    catRepo, genPair, voteRepo, pairRepo,
    randomProbPick: randomPick,
    randomArrayPick: chance.pickone.bind(chance)
  })

  router.post('/next-pair',
    (req, res) => {
      const vote = req.body.vote
      const sessionId = req.query.session
      if (isInvalid({vote, sessionId}))
        return res.send(422)

      nextPair({
        sessionId,
        vote,
      }).then(res.json)
    })

  return router
}