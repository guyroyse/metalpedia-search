function EventHandler(eventStream) {

  async function start() {
    while (true) {

      // TODO: like, handle errors and stuff

      let message = await eventStream.readGroup()
      let type = message.fields.type
      if (type !== 'metalpedia:event:index_song') {
        await eventStream.acknowledgeMessage(message)
      } else {
        console.log("Delegating... no... really...")
        // delegate it
      }

      console.log(message)
    }
  }

  return { start }
}

module.exports = EventHandler