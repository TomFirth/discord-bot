const cron = require("cron")
const config = require("../config.json")

class LuckyCron {
  static start(client) {
    let scheduledMessage = new cron.CronJob("00 37 13 * * *", () => {
      if (Math.floor(Math.random() * 7) == 0) {
        let channel = client.channels.cache.find(channel => channel.name === config.discord.channel.general)
        channel.send("Happy 13:37")
      }
		})
		scheduledMessage.start()
	}
}

module.exports = LuckyCron