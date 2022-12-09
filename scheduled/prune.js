const cron = require("cron")
const config = require("../config.json")

function init(client) {
  let scheduledMessage = new cron.CronJob("00 00 03 * * *", () => {
    let tempText = client.channels.cache.filter(c => c.parentId === config.discord.categories.tempText)
    let tempVoice = client.channels.cache.filter(c => c.parentId === config.discord.categories.tempVoice)
    const now = new Date()
    const aFortnight = now.setDate(now.getDate() - 14)
    // TEXT CHANNELS
    tempText.forEach(channel => {
      channel.messages.fetch({ limit: 1 })
        .then(message => {
          let lastMessage = message.first()
          if (lastMessage.createdTimestamp != undefined
            && aFortnight > lastMessage.createdTimestamp
            && channel.name.includes(config.discord.emojis.clock)) {
            channel.setParent(config.discord.categories.archived)
        }
      })
      .catch(console.error)
    })
    // VOICE CHANNELS
    tempVoice.forEach(channel => {
      if (channel.name.includes(config.discord.emojis.clock)
        && channel.members.size <= 0) {
        channel.delete()
      }
    })
  })
  scheduledMessage.start()
}

module.exports = init