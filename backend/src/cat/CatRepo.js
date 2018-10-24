export const CatRepo = ({mongo}) => {
  const cats = mongo.db.collection('cat')

  cats.createIndex({voteCount: 1})
  cats.createIndex({lastVoteTime: 1})

  return {
    getById: (id, mongoOpts) =>
      cats.findOne({_id: id}, mongoOpts),

    count: () =>
      cats.countDocuments(),

    update: (cat, mongoOpts) =>
      cats.updateOne({_id: cat.id}, {$set: cat}, mongoOpts),

    page: ({sort, offset, size}) =>
      cats.find({
        voteCount: {$gt: 0}
      }).skip(offset)
        .limit(size)
        .sort(sort)
        .toArray()
  }
}