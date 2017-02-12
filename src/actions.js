function mongoInsert (collection, doc) {
  return {
    type: 'mongo',
    fn: 'insert',
    collection,
    doc
  }
}

function mongoUpsert (collection, doc) {
  return {
    type: 'mongo',
    fn: 'upsert',
    collection,
    doc
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

function mongoFind (collection, query) {
  return {
    type: 'mongo',
    fn: 'find',
    collection,
    query
  }
}

module.exports = {
  mongoInsert,
  mongoUpsert,
  mongoFindOne,
  mongoFind
}
