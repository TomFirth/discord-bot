const { MessageEmbed } = require("discord.js")
const cron = require("cron")
const config = require("../config.json")

class Quiz {
  static start(client, db, cache) {
		let scheduledMessage = new cron.CronJob("00 00 19 * * 1", async () => {
			const query = await db.collection("quiz").where("used", "==", false).get()
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
				channel.send("Less than 5 Quiz questions remaining.")
			}
			const random = Math.floor(Math.random() * questions.length)
			cache.put("quizAnswer", questions[random].answer)
			db.collection("quiz").doc(questions[random].id).update({used: true})
			let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.general)
			const quiz = new MessageEmbed()
				.setDescription(questions[random].question + `\nReply with: "quiz <your answer>"`)
				.setColor("GREEN")
			channel.send({ embeds: [quiz] })
		})
		scheduledMessage.start()
	}
}

module.exports = Quiz