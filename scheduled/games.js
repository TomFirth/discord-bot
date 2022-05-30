const { MessageEmbed } = require("discord.js")
const cron = require("cron")
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")

class Game {
  static start(client, db, cache, game) {
		const lastQuestion = db.collection("answer").doc("uLLtQDVl1lo41har8LqO")
		const doc = await lastQuestion.get()
		if (!doc.data().used) {
			cache.put("answer", doc.data().answer)
		}
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
				utilities.channel(client, config.discord.channels.bot, `Less than 5 ${game.game} questions remaining.`)
			}
			const random = Math.floor(Math.random() * questions.length)
			const questionAnswer = questions[random].answer.trim()
			cache.put("answer", questionAnswer)
			db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({
				answer: questionAnswer,
				used: false
			})
			db.collection(game.db).doc(questions[random].id).update({ used: true })
			const gameEmbed = new MessageEmbed()
				.setDescription(questions[random].question + `\nReply with: "answer <your answer>"`)
				.setColor("GREEN")
			utilities.channel(client, game.destination, { embeds: [gameEmbed] })
		})
		scheduledMessage.start()
	}
}

module.exports = Game