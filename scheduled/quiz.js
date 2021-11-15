const { MessageEmbed } = require('discord.js')
const cron = require('cron')
const timedCache = require('timed-cache')
const cache = new timedCache({ defaultTtl: 900 * 1000 })
const firebase = require('firebase-admin')
const config = require("../config.json")

firebase.initializeApp({
	credential: firebase.credential.cert(require('../credentials.json')),
})
const db = firebase.firestore()

class QuizCron {
  static start(client) {
		let randHour = Math.floor(Math.random() * 24) + 1
		let scheduledMessage = new cron.CronJob(`00 00 ${randHour} * * 1`, async () => {
			const random = Math.floor(Math.random() * questions.length)
			const query = await db.collection('quiz').where("used", "==", false).get()
			db.collection('quiz').doc(doc[random]).update({used: true})
			let questions = []
			query.forEach(doc => {
				questions.push(doc.data())
			})
			cache.put("answer", questions[random].answer)
			let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.bin)
			const quiz = new MessageEmbed()
				.setDescription(questions[random].question + `\nReply with: "answer <your answer>"`)
				.setColor('GREEN')
			channel.send({ embeds: [quiz] })
		})
		scheduledMessage.start()
	}
}

module.exports = QuizCron