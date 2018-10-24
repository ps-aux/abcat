import { nth, propEq } from 'ramda'

const session = ({votes}) => votes.aggregate([
  {
    $group: {
      _id: '$session',
      voteCount: {$sum: 1}
    }
  }, {
    $group: {
      _id: null,
      count: {$sum: 1},
      averageVoteCount: {$avg: '$voteCount'}
    }
  },
  {
    $project: {
      _id: false
    }
  }]).toArray().then(nth(0))

const repeatedVotes = ({votes}) =>
  votes.aggregate([
    {
      $match: {
        'repeatedVote.isRepeated': true
      }
    },
    {
      $group: {
        _id: '$repeatedVote.samePickAsLastTime',
        count: {$sum: 1}
      }
    },
    {
      $project: {
        _id: false,
        count: true,
        samePick: '$_id'
      }
    }
  ]).toArray()
    .then(res =>
      ({
        count: res.reduce((a, i) => a + i.count, 0),
        samePickCount: res.find(propEq('samePick', true)).count,
        otherPickCount: res.find(propEq('samePick', false)).count
      }))

export const calculateStats = async ({cats, votes}) => {

  const voteCount = votes.countDocuments()
  const catCount = cats.countDocuments()

  return Promise.all([voteCount, catCount, session({votes}), repeatedVotes({votes})])
    .then(([voteCount, catCount, session, repeatedVotes]) =>
      ({
        votes: {
          count: voteCount,
          repeatedVotes
        },
        catCount,
        session,
      }))
}