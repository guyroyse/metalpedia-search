const redis = require('redis')
const redisearch = require('redis-redisearch')
redisearch(redis)

const { promisify } = require('util')

function RedisSearch(connectionString) {

  const client = redis.createClient(connectionString)

  const ft_create = promisify(client.ft_create).bind(client)
  const ft_add = promisify(client.ft_add).bind(client)
  const exists = promisify(client.exists).bind(client)
  const quit = promisify(client.quit).bind(client)

  async function ftCreate(index, ...schema) {
    await ft_create(index, 'SCHEMA', ...schema)
  }

  async function ftAdd(index, docId, score, ...fields ) {
    await ft_add(index, docId, score, 'FIELDS', ...fields)
  }

  return { exists, ftCreate, ftAdd, quit }
}

module.exports = RedisSearch
