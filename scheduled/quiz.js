const { MessageEmbed } = require('discord.js')
const cron = require('cron')
const timedCache = require('timed-cache')
const cache = new timedCache({ defaultTtl: 900 * 1000 })
const config = require("../config.json")

class Quiz {
  static start(client, db) {
		let scheduledMessage = new cron.CronJob('00 00 20 * * */3', async () => {
			const query = await db.collection('quiz').where("used", "==", false).get()
			let questions = []
			query.forEach(doc => {
				questions.push({
					id: doc.id,
					question: doc.data().question,
					answer: doc.data().answer
				})
			})
			const random = Math.floor(Math.random() * questions.length - 1)
			cache.put("quizAnswer", questions[random].answer)
			db.collection('quiz').doc(questions[random].id).update({used: true})
			let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.general)
			const quiz = new MessageEmbed()
				.setDescription(questions[random].question + `\nReply with: "answer <your answer>"`)
				.setColor('GREEN')
			channel.send({ embeds: [quiz] })
		})
		scheduledMessage.start()
	}
}

module.exports = Quiz