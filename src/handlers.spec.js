const { stub } = require('sinon')
const buildMongo = require('./handlers')
const actions = require('./actions')
const { deepEqual } = require('assert')
const { success, clean } = require('effects-as-data')

describe('handlers.js', () => {
  describe('mongo()', () => {
    it('should handle an insert action', () => {
      const insert = (doc, done) => {
        done(null, { insert: 1 })
      }
      const collection = stub().returns({ insert })
      const db = { collection }
      const { mongo } = buildMongo(db)
      const user = {
        guid: '1234',
        firstName: 'Bob'
      }
      const action = actions.mongoInsert('users', user)
      return mongo(action).then((res) => {
        deepEqual(collection.firstCall.args[0], 'users')
        deepEqual(clean(res), success({ insert: 1 }))
      })
    })

    it('should handle an upsert action', () => {
      const update = (query, doc, options, done) => {
        done(null, { query, doc, options })
      }
      const collection = stub().returns({ update })
      const db = { collection }
      const { mongo } = buildMongo(db)
      const user = {
        guid: '1234',
        firstName: 'Bob'
      }
      const action = actions.mongoUpsert('users', user)
      return mongo(action).then((res) => {
        deepEqual(collection.firstCall.args[0], 'users')
        deepEqual(clean(res), success({
          query: { guid: user.guid },
          doc: user,
          options: { upsert: true, multi: false }
        }))
      })
    })

    it('should handle a findOne action', () => {
      const guid = '12345'
      const findOne = (query, done) => {
        done(null, query)
      }
      const collection = stub().returns({ findOne })
      const db = { collection }
      const { mongo } = buildMongo(db)
      const query = { guid }
      const action = actions.mongoFindOne('users', { guid })
      return mongo(action).then((res) => {
        deepEqual(collection.firstCall.args[0], 'users')
        deepEqual(clean(res), success(query))
      })
    })
  })
})
