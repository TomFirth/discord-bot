const { EmbedBuilder } = require("discord.js")
const cron = require("cron")
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")
const colours = require("../colours.json")

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
			if (jokes.length == 0) {
				const url = new URL("https://www.reddit.com/r/" + reddit.subreddit + "/top.json?t=" + reddit.frequency)
				https.get({
					hostname: url.hostname,
					path: url.pathname,
					headers: {'User-Agent': 'agent'}
				}, async stream => {
					let str = ''
					stream.on("data", data => {
						str += data
					})
					stream.on("end", async () => {
						const jokes = JSON.parse(str)
						console.log()
						const embed = new EmbedBuilder()
							.setDescription(jokes[random].joke)
							.setColor(colours.random)
						utilities.channel(client, config.discord.channels.general, { embeds: [embed] })
						utilities.channel(client, config.discord.channels.bot, `Safe to remove joke code`)
					})
				})
			} else { // remove
				const random = Math.floor(Math.random() * jokes.length)
				db.collection("jokes").doc(jokes[random].id).update({ used: true })
				const embed = new EmbedBuilder()
					.setDescription(jokes[random].joke)
					.setColor(colours.random)
				utilities.channel(client, config.discord.channels.general, { embeds: [embed] })
				run = false
			}
		}
	})
	scheduledMessage.start()
}

module.exports = init