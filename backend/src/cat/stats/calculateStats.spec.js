import { MongoClient } from 'mongodb'
import { calculateStats } from './calculateStats'

const url = 'mongodb://localhost:27018/test'

describe('works', () => {

  let cats
  let votes

  beforeAll(async () => {
    const client = await MongoClient.connect(url, {useNewUrlParser: true})
    const db = client.db('test')
    cats = await db.createCollection('_cats')
    votes = await db.createCollection('_votes')
  })

  afterAll(() => {
    cats.drop()
    votes.drop()
  })

  it('has cats', async () => {

    const votesData = [
      {
        session: '1',
        repeatedVote: {
          isRepeated: true,
          samePickAsLastTime: true
        }
      },
      {
        session: '1',
        repeatedVote: {
          isRepeated: true,
          samePickAsLastTime: true
        }
      },
      {session: '1'},
      {
        session: '2',
        repeatedVote: {
          isRepeated: true,
          samePickAsLastTime: false
        }
      }]

    const catsData = [{}, {}, {}]

    await Promise.all([
      cats.insert(catsData),
      votes.insert(votesData)])

    const res = await calculateStats({cats, votes})
    // const res = await cats.find().toArray()

    expect(res).toMatchObject({
      votes: {
        count: votesData.length,
        repeatedVotes: {
          count: 3,
          samePickCount: 2,
          otherPickCount: 1
        }
      },
      catCount: catsData.length,
      session: {
        count: 2,
        averageVoteCount: 2
      },
    })
  })

})