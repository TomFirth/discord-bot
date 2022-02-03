const { MessageEmbed } = require("discord.js")
const cron = require("cron")
const config = require("../config.json")

class Joke {
  static start(client, db) {
		let scheduledMessage = new cron.CronJob("* * 10 * * 0", async () => {
			let run = true
			while (run) {
				const query = await db.collection("jokes").where("used", "==", false).get()
				let jokes = []
				query.forEach(doc => {
					jokes.push({
						id: doc.id,
						joke: doc.data().joke
					})
				})
				if (jokes.length < 5) {
					let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.bot)
					channel.send(`Less than 5 jokes remaining.`)
				}
				const random = Math.floor(Math.random() * jokes.length)
				db.collection("jokes").doc(jokes[random].id).update({ used: true })
				let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.general)
				const embed = new MessageEmbed()
					.setDescription(jokes[random].joke)
					.setColor("RANDOM")
				channel.send({ embeds: [embed] })
				run = false
			}
		})
		scheduledMessage.start()
	}
}

module.exports = Joke