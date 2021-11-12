const { fetchSubreddit } = require('fetch-subreddit')
const cron = require('cron')
const config = require("../config.json")

class MemeCron {
  static start(client) {
    let scheduledMessage = new cron.CronJob('00 00 12 * * *', () => {
      fetchSubreddit([
        'meme'
      ])
      .then(memes => {
        const rand = Math.floor(Math.random() * memes[0].urls.length)
        if (memes[0].urls[rand]) {
          const channel = client.channels.cache.find(channel => channel.name === config.discord.channels.general)
          channel.send(memes[0].urls[rand])
        }
      })
      .catch(error => console.error(error))
    })
    scheduledMessage.start()
  }
}

module.exports = MemeCron