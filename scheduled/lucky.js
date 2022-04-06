const cron = require("cron")
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")

function init(client) {
	let scheduledMessage = new cron.CronJob("00 00 14 * * 3", () => {
		try {
			const members = client.guilds.members.cache.get(config.discord.guildId)
			let winner = members.random().user
			let selected = false
			while (!selected) {
				if (winner.user !== config.discord.owner.name && !winner.user._roles.includes("860466953582936094")) {
					const role = member.guild.roles.cache.find(role => role.name === "special")
					member.roles.add(role)
					utilities.channel(client, config.discord.channels.special, `Welcome ${winner.user}`)
					utilities.channel(client, config.discord.channels.general, `${winner.user} is this week's lucky winner!`)
					selected = true
				} else {
					utilities.channel(client, config.discord.channels.general, `${winner.user} won! (again).`)
				}
			}
		} catch (error) {
			console.error(error)
		}
	})
	scheduledMessage.start()
}

module.exports = init