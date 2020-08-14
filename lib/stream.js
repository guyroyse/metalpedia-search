const redis = require('redis')
const { promisify } = require('util')

const parseResponse = require('./response')

function RedisStream() {

  const client = redis.createClient('redis://:foobared@localhost/0')

  const xgroup = promisify(client.xgroup).bind(client)
  const xreadgroup = promisify(client.xreadgroup).bind(client)
  
  async function createGroup({ streamKey, groupName }) {
    try {
      await xgroup('CREATE', streamKey, groupName, '$', 'MKSTREAM')
    } catch (error) {
      if (error.code !== 'BUSYGROUP') throw error
    }
  }

  async function readGroup({ streamKey, groupName, consumerName, count = 1 } ) {
    let response = await xreadgroup('GROUP', groupName, consumerName, 'COUNT', count, 'BLOCK', 0, 'STREAMS', streamKey, '>')
    return parseResponse(response)
  }

  return { createGroup, readGroup }
}

module.exports = RedisStream
