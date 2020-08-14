const uuid = require('uuid')

const RedisStream = require('./lib/stream')

const streamKey = 'metalpedia:event:stream'
const groupName = 'metalpedia_search'
const consumerName = uuid.v4()

async function main() {
  let stream = new RedisStream()
  await stream.createGroup({ streamKey, groupName })
  let response = await stream.readGroup({ streamKey, groupName, consumerName, count: 2 })
  console.log(response)
}

main()
