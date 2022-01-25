const { MessageEmbed } = require("discord.js")
const cron = require("cron")
const config = require("../config.json")

class Game {
  static start(client, db, cache, game) {
		let scheduledMessage = new cron.CronJob(game.frequency, async () => {
			const query = await db.collection(game.db).where("used", "==", false).get()
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
				channel.send(`Less than 5 ${game.game} questions remaining.`)
			}
			const random = Math.floor(Math.random() * questions.length)
			cache.put("answer", questions[random].answer)
			db.collection(game.db).doc(questions[random].id).update({ used: true })
			let channel = client.channels.cache.find(channel => channel.name === game.destination)
			const gameEmbed = new MessageEmbed()
				.setDescription(questions[random].question + `\nReply with: "answer <your answer>"`)
				.setColor("GREEN")
			channel.send({ embeds: [gameEmbed] })
		})
		scheduledMessage.start()
	}
}

module.exports = Game