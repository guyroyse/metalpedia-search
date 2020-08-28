function EventHandler(eventStream, indexer) {

  async function start() {
    while (true) {
      let message = await eventStream.readGroup()
      let type = message.fields.type
      if (type === 'metalpedia:event:index_song') {
        await indexer.index(message)
      }
      
      await eventStream.acknowledgeMessage(message)

      console.log(message)
    }
  }

  return { start }
}

module.exports = EventHandler
