const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

function init(client) {
	let scheduledMessage = new cron.CronJob("00 00 12 * * 3", () => {
		try {
			const guild = client.guilds.cache.get(config.discord.guildId)
			guild.members.fetch()
			.then(members => {
				const memberLength = members.size
				const winner = Math.floor(Math.random() * memberLength)
				members.forEach((member, index) => {
					if (index == winner) {
						const role = member.guild.roles.cache.find(role => role.name === "special")
						member.addRole(role)
						utilities.channel(client, config.discord.channels.special, `Welcome ${winner}`)
						utilities.channel(client, config.discord.channels.general, `${winner} is this week's lucky winner!`)
						selected = true
						utilities.special(winner)
					} else {
						utilities.channel(client, config.discord.channels.general, `${winner} won! (again).`)
					}
				})
			})
		} catch (error) {
			console.error(error)
		}
	})
	scheduledMessage.start()
}

module.exports = init