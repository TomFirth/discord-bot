const { EmbedBuilder } = require("discord.js")
const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

function init(client) {
	let scheduledMessage = new cron.CronJob("00 00 10 * * 0", async () => {
		const url = new URL("https://icanhazdadjoke.com/api")
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
					.setDescription(jokes.joke)
					.setColor(utilities.randomColour())
				utilities.channel(client, config.discord.channels.general, { embeds: [embed] })
			})
		})
	})
	scheduledMessage.start()
}

module.exports = init