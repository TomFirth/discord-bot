const cron = require("cron")
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")

function init(client) {
  let scheduledMessage = new cron.CronJob("00 37 13 * * *", () => {
    if (Math.floor(Math.random() * 7) == 0) {
      utilities.channel(client, config.discord.channel.general, "Happy 13:37")
    }
  })
  scheduledMessage.start()
}

module.exports = init