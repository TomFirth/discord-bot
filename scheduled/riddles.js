const { EmbedBuilder } = require("discord.js")
const axios = require("axios");
const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

function riddleRequest(client, db, cache) {
	axios.request({
		method: 'GET',
		url: 'https://riddles-api.vercel.app/random'
	}).then(response => {
		return response
	}).catch(error => {
		console.error(error)
	})
}

function init(client, db, cache) {
	let scheduledMessage = new cron.CronJob("00 00 19 * * 4", () => {
		let haveRiddle = false
		while (!haveRiddle) {
			let response = riddleRequest(client, db, cache)
			if (response.split(" ").length < 3) !haveRiddle
		}

		cache.set("answer", response.data.answer)
		const embed = new EmbedBuilder()
			.setDescription(response.data.riddle + `\nReply with: "/answer <your answer>"`)
			.setColor(utilities.randomColour())
		utilities.channel(client, config.discord.channels.general, { embeds: [embed] })
		db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({
			answer: response.data.answer,
			id: "api",
			db: "riddle",
			used: false
		})
	})
	scheduledMessage.start()
}

module.exports = init