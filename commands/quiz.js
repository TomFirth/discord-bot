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

module.exports = {
  name: 'quiz',
  async execute(client) {
	let scheduledMessage = new cron.CronJob('00 30 13 * * 1', () => {
		const query = await db.collection('quiz').where("used", "==", false).get()
		let questions = []
		query.forEach(doc => {
			questions.push(doc.data())
		})
		const random = Math.floor(Math.random() * questions.length)
		cache.put("answer", questions[random].answer)
		let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.secret)
		const quiz = new MessageEmbed()
      .setDescription(questions[random].question + `\nReply with: "answer <your answer>"`)
      .setColor('GREEN')
		channel.send({ embeds: [quiz] })
	})
	scheduledMessage.start()
	}
}