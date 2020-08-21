const EventStream = require('./lib/event-stream')
const EventHandler = require('./lib/event-handler')

async function main() {
  let eventStream = new EventStream()
  await eventStream.createGroup()

  let eventHandler = new EventHandler(eventStream)

  try {
    eventHandler.start()
  } catch (error) {
    console.log(error)
    throw error
  }
}

main()
