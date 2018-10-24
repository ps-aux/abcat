import { votingApi } from './voting/votingApi'
import { CatRepo } from './CatRepo'
import { statsApi } from './stats/statsApi'
import { topCatsApi } from './top/topCatsApi'
import { setupCatUpdater } from './catUpdater'

export const catApi = ({router, mongo, createRouter, eventBus}) => {

  const catRepo = CatRepo({mongo})

  router.use('/voting',
    votingApi({
      router: createRouter(),
      catRepo,
      mongo,
      eventBus
    }))

  router.use('/stats',
    statsApi({
      mongo,
      router: createRouter(),
      eventBus
    }))

  router.use('/list',
    topCatsApi({
      mongo,
      catRepo,
      router: createRouter(),
      eventBus
    }))

  setupCatUpdater({eventBus, mongo, catRepo})

  return router
}