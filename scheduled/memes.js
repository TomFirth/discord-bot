const { fetchSubreddit } = require('fetch-subreddit')
const cron = require('cron')

class MemeCron {
  static start(client) {
    let scheduledMessage = new cron.CronJob('00 00 12 * * 3', () => {
      fetchSubreddit([
        'meme'
      ])
      .then(memes => {
        const rand = Math.floor(Math.random() * memes[0].urls.length)
        if (memes[0].urls[rand]) {
          const channel = client.channels.cache.find(channel => channel.name === "bot")
          channel.send(memes[0].urls[rand])
        }
      })
      .catch(error => console.error(error))
    })
    scheduledMessage.start()
  }
}

module.exports = MemeCron