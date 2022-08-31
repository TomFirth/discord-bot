const axios = require("axios");
const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

function init(client, db, cache) {
	let scheduledMessage = new cron.CronJob("00 00 19 * * 4", () => {
    axios.request({
      method: 'GET',
      url: 'https://riddles-api.vercel.app/random'
    }).then(response => {
      cache.set("answer", response.data.answer)
      const embed = new EmbedBuilder()
				.setDescription(response.data.question)
				.setColor(utilities.randomColour())
			utilities.channel(client, config.discord.channels.general, { embeds: [embed] })
      db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({
				answer: response.data.answer,
				id: "api",
				db: "game.db",
				used: false
			})
    }).catch(function (error) {
      console.error(error)
    })
	})
	scheduledMessage.start()
}

module.exports = init