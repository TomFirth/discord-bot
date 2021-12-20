const { MessageEmbed } = require("discord.js")
const cron = require("cron")
const config = require("../config.json")

class Riddles {
  static start(client, db, cache) {
		let scheduledMessage = new cron.CronJob("00 00 17 * * */5", async () => {
			const query = await db.collection("riddles").where("used", "==", false).get()
			let questions = []
			query.forEach(doc => {
				questions.push({
					id: doc.id,
					question: doc.data().question,
					answer: doc.data().answer
				})
			})
			if (questions.length < 5) {
				let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.bot)
				channel.send("Less than 5 Riddles remaining.")
			}
			const random = Math.floor(Math.random() * questions.length)
			cache.put("riddleAnswer", questions[random].answer)
			db.collection("riddles").doc(questions[random].id).update({used: true})
			let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.general)
			const quiz = new MessageEmbed()
				.setDescription(questions[random].question + `\nReply with: "riddle <your answer>"`)
				.setColor("GREEN")
			channel.send({ embeds: [quiz] })
		})
		scheduledMessage.start()
	}
}

module.exports = Riddles