const { EmbedBuilder } = require("discord.js")
const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")
const colours = require("../colours.json")

class Game {
  static async start(client, db, cache, game) {
		const lastQuestion = db.collection("answer").doc("uLLtQDVl1lo41har8LqO")
		// if after midnight - this shouldn't happen
		const doc = await lastQuestion.get()
		console.log("used?", doc.data().used)
		if (!doc.data().used) {
			cache.set("answer", doc.data().answer)
			console.log("cache check", cache.get("answer"))
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
			cache.set("answer", questionAnswer)
			db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({
				answer: questionAnswer,
				id: doc.id,
				db: game.db,
				used: false
			})
			db.collection(game.db).doc(questions[random].id).update({ used: true })
			const gameEmbed = new EmbedBuilder()
				.setDescription(questions[random].question + `\nReply with: "answer <your answer>"`)
				.setColor(colours.green)
			utilities.channel(client, game.destination, { embeds: [gameEmbed] })
		})
		scheduledMessage.start()
	}
}

module.exports = Game