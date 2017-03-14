function mongoInsert (collection, doc) {
  return {
    type: 'mongo',
    fn: 'insert',
    collection,
    doc
  }
}

function mongoUpsert (collection, doc, query) {
  return {
    type: 'mongo',
    fn: 'upsert',
    collection,
    doc,
    query
  }
}

function mongoFindOne (collection, query) {
  return {
    type: 'mongo',
    fn: 'findOne',
    collection,
    query
  }
}

function mongoFind (collection, query, options = {}) {
  return {
    type: 'mongo',
    fn: 'find',
    collection,
    query,
    page: options.page || 0,
    limit: options.perPage || 25,
  }
}

module.exports = {
  mongoInsert,
  mongoUpsert,
  mongoFindOne,
  mongoFind
}
