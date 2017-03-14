const { curry } = require('ramda')
const { safecb } = require('safe-errors')
const { isFailure } = require('effects-as-data')

function mongoHandler (mongo, action) {
  let collection
  let update

  switch (action.fn) {
    case 'insert':
      collection = mongo.collection(action.collection)
      return safecb(collection.insert, collection)(action.doc)

    case 'upsert':
      collection = mongo.collection(action.collection)
      update = safecb(collection.update, collection)
      return update(action.query || { guid: action.doc.guid }, action.doc, { upsert: true, multi: false })

    case 'findOne':
      collection = mongo.collection(action.collection)
      return safecb(collection.findOne, collection)(action.query)

    case 'find':
      collection = mongo.collection(action.collection)
      return safecb(collection.find, collection)(action.query).then((r) => {
        if (isFailure(r)) return r
        return r.payload.toArray()
      })

    default:
      return Promise.reject(`function "${action.fn}" not available for mongo handler.`)
  }
}

module.exports = (mongo) => {
  return {
    mongo: curry(mongoHandler)(mongo)
  }
}
