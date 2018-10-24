export const topCatsApi = ({router, catRepo}) => {
  router.use('/',
    (req, res) => {
      const offset = parseInt(req.query.offset) || 0
      const size = parseInt(req.query.size) || 20

      const sort = req.query.sort === 'date' ? {lastVotetime: -1} : {voteCount: -1}

      catRepo.page({offset, size, sort}).then(res.json)
    })

  return router
}