const uuid = require('uuid')

const RedisStream = require('./redis-stream')

const streamKey = 'metalpedia:event:stream'
const groupName = 'metalpedia_search'
const consumerName = uuid.v4()

function EventStream() {

  let redisStream = new RedisStream('redis://:foobared@localhost/0')

  async function createGroup() {
    try {
      await redisStream.xGroupCreateAndMake({ streamKey, groupName, startId: '$' })
    } catch (error) {
      if (error.code !== 'BUSYGROUP') throw error
    }
  }

  async function readGroup() {
    let response = await redisStream.xReadGroupAndBlock({
      groupName, consumerName, count: 1, blockForMillis: 0,
      streamKey, startId: '>' })

    let streamsAndMessages = responseToStreamsAndMessage(response)

    let message = streamsAndMessages[0].messages[0]
    return message
  }

  async function acknowledgeMessage(message) {
    await redisStream.xAck({ streamKey, groupName, messageId: message.id })
  }

  function responseToStreamsAndMessage(response) {
    return response.map(streamData => parseStream(streamData))
  }

  function parseStream(streamData) {
    let key = streamData[0]
    let messagesData = streamData[1]

    let stream = { key }
    stream.messages = messagesData.map(messageData => parseMessage(messageData))

    return stream
  }

  function parseMessage(messageData) {
    let id = messageData[0]
    let fields = messageData[1]

    let message = { id, fields: {} }

    for (let i = 0; i < fields.length; i = i + 2) {
      let name = fields[i]
      let value = fields[i + 1]
      message.fields[name] = value
    }

    return message
  }

  return { createGroup, readGroup, acknowledgeMessage }
}

module.exports = EventStream
