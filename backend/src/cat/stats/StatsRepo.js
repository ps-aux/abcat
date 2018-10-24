export const StatsRepo = ({mongo}) => {
  const stats = mongo.db.collection('stats')

  return {
    get: (opts) => stats.findOne({_id: 1}, opts),
    update: (s, opts) => stats.updateOne({_id: 1}, {$set: s}, opts),
  }

}

