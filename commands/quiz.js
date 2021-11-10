const cron = require('cron')
const timedCache = require('timed-cache')
const cache = new timedCache({ defaultTtl: 900 * 1000 })

const { getFirestore } = require("firebase/firestore")
const db = getFirestore({
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID
})

module.exports = (client, message) => {
	if(message.content.toLowerCase().includes("answer")) {
		const answer = cache.get("answer") || null
		const userAnswer = message.content.toLowerCase().replace('answer ','')
		if(userAnswer.includes(answer)) {
			channel.send(`Congratulations ${message.member} with the correct answer of: ${userAnswer}`)
			const role = member.guild.roles.cache.find(role => role.name === "Special")
			member.roles.add(role)
		}
  }

	let scheduledMessage = new cron.CronJob('00 00 12 * * 1', () => {
		const quiz = query(collection(db, "quiz"), where("used", "==", false))
    const query = getDocs(quiz)
		const random = Math.floor(Math.Random() * query.length)
		cache.put("answer", query[random].answer)
		let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.general)
		channel.send(query[random].question)
		channel.send('Reply with: "answer <your answer>"')
	})
	scheduledMessage.start()
}