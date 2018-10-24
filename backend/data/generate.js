import Mongo from '../src/db/mongo'
import cats from './5000-cats'
import faker from 'faker'
import petname from 'node-petname'

const genName = n => {
  if (n % 2 === 1) {
    const n = petname()

    return n[0].toUpperCase() + n.slice(1)
  }
  return faker.name.firstName()

}

let seq = 0
const createNext = ({img}) => {
  seq++
  const id = seq.toString()
  return {
    _id: id,
    id,
    img,
    name: genName(seq),
    voteCount: 0,
    lastVoteTime: null
  }
}

global.Log = ({name}) => (...args) => console.log(...args)

const mongo = Mongo({
  url: process.env.MONGO_URL,
  dbName: process.env.MONGO_DB_NAME
})

const data = cats.map(c => createNext(({img: c.url})))

mongo.then(async mongo => {
  const db = mongo.db
  console.log('Inserting cat data into db')
  db.dropCollection('cat')
  db.dropCollection('stats')

  await db.collection('cat').insertMany(data)
  await db.collection('stats').insertOne({
    votes: {
      count: -1,
      repeatedVotes: {
        count: -1,
        samePickCount: -1,
        otherPickCount: -1
      }
    },
    catCount: -1,
    session: {
      count: -1,
      averageVoteCount: -1
    },
  })
  console.log('done')
  process.exit(0)
})
