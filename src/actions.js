function mongoInsert(collection, doc) {
  return {
    type: "mongo",
    fn: "insert",
    collection,
    doc
  };
}

function mongoUpsert(collection, doc, query) {
  return {
    type: "mongo",
    fn: "upsert",
    collection,
    doc,
    query
  };
}

function mongoFindOne(collection, query) {
  return {
    type: "mongo",
    fn: "findOne",
    collection,
    query
  };
}

function mongoFind(collection, query, options = {}) {
  options.limit = options.perPage || 25;
  options.skip = (options.page || 0) * options.limit;
  delete options.page;
  delete options.perPage;
  return {
    type: "mongo",
    fn: "find",
    collection,
    query,
    options
  };
}

function mongoDropCollection(collection) {
  return {
    type: "mongo",
    fn: "dropCollection",
    collection
  };
}

module.exports = {
  mongoInsert,
  mongoUpsert,
  mongoFindOne,
  mongoFind,
  mongoDropCollection
};
