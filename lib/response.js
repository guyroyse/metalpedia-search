function parseResponse(responseData) {
  return responseData.map(streamData => {

    let stream = {}
    stream.key = streamData[0]
    stream.messages = streamData[1].map(messageData => {
      let message = {}
      message.id = messageData[0]
      message.fields = {}

      for (let i = 0; i < messageData[1].length; i+=2) {
        let name = messageData[1][i]
        let value = messageData[1][i+1]
        message.fields[name] = value
      }

      return message
    })

    return stream
  })
}

module.exports = parseResponse
