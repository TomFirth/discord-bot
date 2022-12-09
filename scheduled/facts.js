const { EmbedBuilder } = require("discord.js")
const axios = require('axios')
const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

function init(client) {
	let scheduledMessage = new cron.CronJob("00 00 10 * * 6", async () => {
    await axios.request({
      method: 'GET',
      headers: {
        "Accept" : "application/json",
        "User-Agent": "Barber",
        "X-Api-Key": process.env.NINJA_API
      },
      url: 'https://api.api-ninjas.com/v1/facts?limit=1'
    }).then(response => {
      const embed = new EmbedBuilder()
				.setDescription(`Fact: ${response.data.fact}`)
				.setColor(utilities.randomColour())
			utilities.channel(client, config.discord.channels.general, { embeds: [embed] })
    }).catch(console.error)
	})
	scheduledMessage.start()
}

module.exports = init