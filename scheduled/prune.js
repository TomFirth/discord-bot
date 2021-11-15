const cron = require('cron')
const config = require('../config.json')

class PruneCron {
  static start(client) {
    let scheduledMessage = new cron.CronJob('00 00 00 * * *', () => {
      const safeTextChannels = ["audit", "bot", "socials", "updates"]
      const safeVoiceChannels = ["chat", "secret"]
      let tempText = client.channels.cache.filter(c => c.parentId === config.discord.categories.tempText && !safeTextChannels.includes(c.name))
      let tempVoice = client.channels.cache.filter(c => c.parentId === config.discord.categories.tempVoice && !safeVoiceChannels.includes(c.name))
      if (tempText.length -6 == 0 && tempVoice.length -1 == 0) return false
      const now = new Date()
      const aDay = now.setDate(now.getDate() - 1)
      const aFortnight = now.setDate(now.getDate() - 14)
      // TEXT CHANNELS
      tempText.forEach(channel => {
        channel.messages.fetch({ limit: 1 }).then(message => {
          let lastMessage = message.first()
          if (!lastMessage.author.bot
            && lastMessage.createdTimestamp != undefined
            && aFortnight > lastMessage.createdTimestamp) {
            channel.setParent(config.discord.categories.archived)
          }
        })
        .catch(console.error)
      })
    })
    scheduledMessage.start()
  }
}

module.exports = PruneCron