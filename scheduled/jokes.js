const { EmbedBuilder } = require("discord.js")
const axios = require('axios')
const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

function init(client) {
	let scheduledMessage = new cron.CronJob("00 00 10 * * 0", async () => {
		try {
			const response = await axios.get("https://icanhazdadjoke.com/", {
				headers: {
					Accept: "application/json",
					"User-Agent": "axios 0.27.2"
				}
			})
			const embed = new EmbedBuilder()
				.setDescription(response.data.joke)
				.setColor(utilities.randomColour())
			utilities.channel(client, config.discord.channels.general, { embeds: [embed] })
		} catch (error) {
			console.error(error.toJSON())
		}
	})
	scheduledMessage.start()
}

module.exports = init