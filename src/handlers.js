const { curry } = require("ramda");
const { safecb } = require("safe-errors");
const { isFailure, normalizeToSuccess } = require("simple-protocol-helpers");

const unwrap = r => {
  if (r.success) return r.payload;
  else throw r.error;
};

function mongoHandler(mongo, cmd) {
  let collection;
  let update;

  switch (cmd.fn) {
    case "insert":
      collection = mongo.collection(cmd.collection);
      return safecb(collection.insert, collection)(cmd.doc).then(unwrap);

    case "upsert":
      collection = mongo.collection(cmd.collection);
      update = safecb(collection.update, collection);
      return update(cmd.query || { guid: cmd.doc.guid }, cmd.doc, {
        upsert: true,
        multi: false
      }).then(unwrap);

    case "findOne":
      collection = mongo.collection(cmd.collection);
      return safecb(collection.findOne, collection)(cmd.query).then(unwrap);

    case "find":
      collection = mongo.collection(cmd.collection);

      const resultsQuery = safecb(collection.find, collection)(
        cmd.query,
        cmd.options
      )
        .then(r => r.payload.toArray())
        .then(normalizeToSuccess);

      const totalQuery = safecb(collection.count, collection)(cmd.query);

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

    case "dropCollection":
      collection = mongo.collection(cmd.collection);
      return safecb(collection.drop, collection)().then(unwrap);

    default:
      return Promise.reject(
        `function "${cmd.fn}" not available for mongo handler.`
      );
  }
}

module.exports = mongo => {
  return {
    mongo: curry(mongoHandler)(mongo)
  };
};
