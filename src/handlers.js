const { curry } = require('ramda');
const { safecb } = require('safe-errors');
const { isFailure, normalizeToSuccess } = require('simple-protocol-helpers');

function mongoHandler(mongo, action) {
  let collection;
  let update;

  switch (action.fn) {
    case 'insert':
      collection = mongo.collection(action.collection);
      return safecb(collection.insert, collection)(action.doc);

    case 'upsert':
      collection = mongo.collection(action.collection);
      update = safecb(collection.update, collection);
      return update(action.query || { guid: action.doc.guid }, action.doc, {
        upsert: true,
        multi: false
      });

    case 'findOne':
      collection = mongo.collection(action.collection);
      return safecb(collection.findOne, collection)(action.query);

    case 'find':
      const limit = action.limit || 25;
      const skip = (action.page || 0) * limit;
      collection = mongo.collection(action.collection);

      const resultsQuery = safecb(collection.find, collection)(action.query, {
        limit,
        skip
      })
        .then(r => r.payload.toArray())
        .then(normalizeToSuccess);

      const totalQuery = safecb(collection.count, collection)(action.query);

      return Promise.all([
        resultsQuery,
        totalQuery
      ]).then(([results, total]) => {
        if (isFailure(results)) return results;
        if (isFailure(total)) return total;
        return {
          results: results.payload,
          total: total.payload
        };
      });

    case 'dropCollection':
      collection = mongo.collection(action.collection);
      return safecb(collection.drop, collection)();

    default:
      return Promise.reject(
        `function "${action.fn}" not available for mongo handler.`
      );
  }
}

module.exports = mongo => {
  return {
    mongo: curry(mongoHandler)(mongo)
  };
};
