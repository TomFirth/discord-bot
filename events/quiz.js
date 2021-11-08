// every week at a random time ask a question from the internet
// post in #general
// first correct reply get special role

// can start a quiz at any time - has to be beardmachine

const cron = require('cron')
const timedCache = require('timed-cache')
const cache = new timedCache({ defaultTtl: 900 * 1000 })

// Initialize Cloud Firestore through Firebase
const { initializeApp } = require("firebase/app")
const { getFirestore } = require("firebase/firestore")
const firebaseApp = initializeApp({
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID
})

const db = firebaseApp.getFirestore()

module.exports = async (client, message) => {
	if(message.content.toLowerCase().includes("answer")) {
		const answer = await cache.get("answer") || null
		const userAnswer = message.content.toLowerCase().replace('answer ','')
		if(userAnswer.includes(answer)) {
			channel.send(`Congratulations ${message.member} with the correct answer of: ${userAnswer}`)
			const role= member.guild.roles.cache.find(role => role.name === "Special")
			member.roles.add(role)
		}
  }

	const day = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
	const week = new Date(new Date().getTime() - (168 * 60 * 60 * 1000))
	// make cron time random?
	let scheduledMessage = new cron.CronJob('00 30 13 * * 1', () => {
		const role = message.guild.roles.cache.get("Special");
		role.members.forEach((member, i) => {
			setTimeout(() => {
				member.roles.remove(Role)
			}, i * 1000)
		})

		const quiz = query(collection(db, "quiz"), where("used", "==", false))
    const query = await getDocs(quiz)
		const random = Math.floor(Math.Random() * query.length)
		// cache answer
		await cache.put("answer", query[random].answer)
		let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.general)
		channel.send(query[random].question)
		channel.send('Reply with: "answer <your answer>"')
	})
	scheduledMessage.start()
}