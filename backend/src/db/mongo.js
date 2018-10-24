import { MongoClient } from 'mongodb'
import assert from 'assert'
import { retrier } from './retrier'
import { txManager } from './txManager'

const mongo = async ({url, dbName}) => {
  assert(url, 'mongo url not set')
  assert(dbName, 'mongo db name not set')

  const client = await MongoClient.connect(url, {useNewUrlParser: true})
  return {
    db: client.db(dbName),
    inTx: txManager(({client})),
    retry: retrier()
  }
}

export default mongo
