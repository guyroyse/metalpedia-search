const uuid = require('uuid')

const RedisSearch = require('./redis-search')
const { ReplyError } = require('redis')

const indexKey = 'metalpedia:search:index'

const schema = [ 'artist', 'TEXT', 'title', 'TEXT', 'album', 'TEXT', 'lyrics', 'TEXT']


function SongIndexer() {

  let redisSearch = new RedisSearch('redis://:foobared@localhost/0')

  async function start() {
    try {
      await redisSearch.ftCreate(indexKey, ...schema)
    } catch (error) {
      if (!(error instanceof ReplyError)) throw(error)
    }
  }

  async function index(message) {
    await redisSearch.ftAdd(indexKey, uuid.v4(), 1.0,
      'title', message.fields.title,
      'album', message.fields.album,
      'artist', message.fields.artist,
      'lyrics', message.fields.lyrics)
  }

  async function quit() {
    await redisSearch.quit()
  }

  return { start, index, quit }
}

module.exports = SongIndexer
