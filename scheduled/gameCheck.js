const { MessageEmbed } = require("discord.js")
const cron = require("cron")
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")

class GameCheck {
  static async start(client, db) {
    const responses = [
      "No one answered today\'s game, you all suck.",
      "No winner, no chicken dinner.",
      "\"These games are too easy\" - said no one, today",
      "Want to know the answer?",
      "No winner today."
    ]
    const todaysResponse = responses[Math.random() * responses.length]
		let scheduledMessage = new cron.CronJob("0 0 0 * * *", async () => {
      const lastQuestion = db.collection("answer").doc("uLLtQDVl1lo41har8LqO")
      const doc = await lastQuestion.get()
      if (!doc.data().used) {
        utilities.channel(client, "general", todaysResponse)
        db.collection(doc.data().db).doc(doc.data().id).update({ used: false }) // add the question back in
      }
		})
		scheduledMessage.start()
	}
}

module.exports = GameCheck