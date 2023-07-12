const { EmbedBuilder } = require("discord.js")
const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")
const colours = require("../colours.json")

class Game {
  static async start(client, db, cache, game) {
		let scheduledMessage = new cron.CronJob(game.frequency, async () => {
			const today = new Date()
  		const dow = today.getDay()
			const gameToday = game.frequency.split(" ").pop()
			if (gameToday == dow) {
				const query = await db.collection(game.db).where("used", "==", false).get()
				let questions = []
				let docId
				query.forEach(doc => {
					docId = doc.id
					questions.push({
						id: doc.id,
						question: doc.data().question,
						answer: doc.data().answer
					})
				})
				if (questions.length < 5) {
					utilities.channel(client, config.discord.channels.bot, `Less than 5 ${game.game} questions remaining.`)
				}
				if (questions.length !== 0) {
					const random = Math.floor(Math.random() * questions.length)
					const questionAnswer = questions[random].answer.trim()
					cache.set("answer", questionAnswer)
					db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({
						answer: questionAnswer,
						id: docId,
						db: game.db,
						used: false
					})
					db.collection(game.db).doc(questions[random].id).update({ used: true })
					const gameEmbed = new EmbedBuilder()
						.setDescription(questions[random].question + `\nReply with: "/answer <your answer>"`)
						.setColor(colours.green)
					utilities.channel(client, game.destination, { embeds: [gameEmbed] })
				}
			}
		})
		scheduledMessage.start()
	}
}

module.exports = Game