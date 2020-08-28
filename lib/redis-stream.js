const redis = require('redis')
const { promisify } = require('util')

function RedisStream(connectionString) {

  const client = redis.createClient(connectionString)

  const xgroup = promisify(client.xgroup).bind(client)
  const xreadgroup = promisify(client.xreadgroup).bind(client)
  const xack = promisify(client.xack).bind(client)
  const quit = promisify(client.quit).bind(client)
  
  async function xGroupCreateAndMake({ streamKey, groupName, startId }) {
    await xgroup(
      'CREATE', streamKey, groupName, startId,
      'MKSTREAM')
  }

  async function xReadGroupAndBlock({ groupName, consumerName, count, blockForMillis, streamKey, startId }) {
    let response = await xreadgroup(
      'GROUP', groupName, consumerName,
      'COUNT', count,
      'BLOCK', blockForMillis,
      'STREAMS', streamKey, startId)
    return response
  }

  async function xAck({ streamKey, groupName, messageId }) {
    await xack(streamKey, groupName, messageId)
  }

  return { xGroupCreateAndMake, xReadGroupAndBlock, xAck, quit }
}

module.exports = RedisStream
