const cron = require("cron")
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")

function init(client) {
	let scheduledMessage = new cron.CronJob("00 00 12 * * 3", () => {
		try {
			const guild = client.guilds.cache.get(config.discord.guildId)
			let selected = false
			while (!selected) {
				let winner = guild.members.cache.random().user
				if (winner !== config.discord.owner.name && !winner.user.roles.includes("860466953582936094")) {
					const role = member.guild.roles.cache.find(role => role.name === "special")
					member.roles.add(role)
					utilities.channel(client, config.discord.channels.special, `Welcome ${winner}`)
					utilities.channel(client, config.discord.channels.general, `${winner} is this week's lucky winner!`)
					selected = true
				} else {
					utilities.channel(client, config.discord.channels.general, `${winner} won! (again).`)
				}
				utilities.special(winner)
			}
		} catch (error) {
			console.error(error)
		}
	})
	scheduledMessage.start()
}

module.exports = init