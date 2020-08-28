const EventStream = require('./lib/event-stream')
const EventHandler = require('./lib/event-handler')
const SongIndexer = require('./lib/song-indexer')

async function main() {

  let indexer, eventStream, eventHandler

  try {

    indexer = new SongIndexer()
    await indexer.start()

    eventStream = new EventStream()  
    await eventStream.createGroup()

    eventHandler = new EventHandler(eventStream, indexer)
    await eventHandler.start()

  } catch (error) {
    console.log(error)
  } finally {
    await indexer.quit()
    await eventStream.quit()
  }

}

main()
