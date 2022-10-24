const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

class GameCheck {
  static async start(client, db) {
    const games = [
      "",
      "quiz",
      "pokemon",
      "",
      "riddle",
      "movies",
      ""
    ]
    const today = new Date()
    const dow = today.getDay()
		let scheduledMessage = new cron.CronJob("0 0 0 * * *", async () => {
      if (games[dow] !== "") {
        const lastQuestion = db.collection("answer").doc("uLLtQDVl1lo41har8LqO")
        const doc = await lastQuestion.get()
        if (!doc.data().used) {
          utilities.channel(client, config.discord.channels.general, doc.data().answer)
        }
      }
		})
		scheduledMessage.start()
	}
}

module.exports = GameCheck