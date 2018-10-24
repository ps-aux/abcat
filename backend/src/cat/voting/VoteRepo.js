export const VoteRepo = ({mongo}) => {
  const votes = mongo.db.collection('vote')

  votes.createIndex({session: 1})
  votes.createIndex({'pair.aId': 1, 'pair.bId': 1})

  return {
    save: v => votes.insertOne(v),
    getBySession: ({sessionId}) => votes.find({session: sessionId}).toArray(),
    getByPairId: ({sessionId, pairId}) => votes.find({
      'pair.aId': pairId.aId,
      'pair.bId': pairId.bId
    }).sort({time: 1}).limit(1).toArray().then(res => res[0])
  }

}