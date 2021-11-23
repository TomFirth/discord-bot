const { fetchSubreddit } = require('fetch-subreddit')
const cron = require('cron')
const config = require("../config.json")

class RMemeCron {
  static start(client) {
    let scheduledMessage = new cron.CronJob('00 00 20 * * *', () => {
      fetchSubreddit([
        'gonewild'
      ])
      .then(memes => {
        const rand = Math.floor(Math.random() * memes[0].urls.length - 1)
        if (memes[0].urls[rand]) {
          const channel = client.channels.cache.find(channel => channel.name === config.discord.channels.secret)
          channel.send(memes[0].urls[rand])
        }
      })
      .catch(error => console.error(error))
    })
    scheduledMessage.start()
  }
}

module.exports = RMemeCron