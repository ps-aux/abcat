import { StatsRepo } from './StatsRepo'
import { calculateStats } from './calculateStats'
import { APP_STARTED } from '../../events'
import { VOTE_ADDED } from '../voting/events'
import { interval } from 'rxjs'
import { debounce, filter } from 'rxjs/operators'
import { STATS_UPDATED } from './events'
import { eventOf } from '../../event/Event'

const setupStatsUpdater = ({eventBus, mongo, statsRepo}) => {
  const log = Log({name: 'stats-updater'})

  const update = async () => {
    log.trace('Updating stats')

    const stats = await calculateStats({
      cats: mongo.db.collection('cat'),
      votes: mongo.db.collection('vote'),
    })

    stats.lastUpdate = new Date()

    statsRepo.update(stats)

    eventBus.publish(eventOf(STATS_UPDATED, stats, {
      pushToClients: true
    }))
  }

  eventBus.events()
    .pipe(
      filter(({type}) => [APP_STARTED, VOTE_ADDED].includes(type)),
      debounce(() => interval(2000)) // Prevent frequent updates
    ).subscribe(update)
}

export const statsApi = ({router, mongo, eventBus}) => {
  const statsRepo = StatsRepo({mongo})

  setupStatsUpdater({eventBus, mongo, statsRepo})

  router.get('/', (req, res) => statsRepo.get().then(res.json))

  return router
}