const { MessageEmbed } = require("discord.js")
const cron = require("cron")
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")

function init(client, db) {
	let scheduledMessage = new cron.CronJob("00 00 10 * * 0", async () => {
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
				utilities.channel(client, config.discord.channels.bot, `Less than 5 jokes remaining.`)
			}
			const random = Math.floor(Math.random() * jokes.length)
			db.collection("jokes").doc(jokes[random].id).update({ used: true })
			const embed = new MessageEmbed()
				.setDescription(jokes[random].joke)
				.setColor("RANDOM")
			utilities.channel(client, config.discord.channels.general, { embeds: [embed] })
			run = false
		}
	})
	scheduledMessage.start()
}

module.exports = init