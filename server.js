const EventStream = require('./lib/event-stream')
const EventHandler = require('./lib/event-handler')

async function main() {

  let eventStream = new EventStream()
  let eventHandler = new EventHandler(eventStream)

  try {
    await eventStream.createGroup()
    await eventHandler.start()
  } catch (error) {
    console.log(error)
  }

  eventStream.quit()

}

main()
