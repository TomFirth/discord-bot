const cron = require("cron")
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")

function init(client) {
	let scheduledMessage = new cron.CronJob("00 00 14 * * 3", () => {
		try {
			const guild = client.guilds.cache.get(config.discord.guildId)
			const memberLength = members.size
			const winner = Math.floor(Math.random() * memberLength)
			guild.members.cache.forEach(async (index, member) => {
				if (member.user.username !== config.discord.owner.name && !member._roles.includes("860466953582936094") && index == winner) {
					const role = member.guild.roles.cache.find(role => role.name === "special")
					member.roles.add(role)
					await utilities.channel(client, config.discord.channels.special, `Welcome ${member.displayName}`)
					await utilities.channel(client, config.discord.channels.general, `${member.displayName} is this week's lucky winner!`)
				}
			})
		} catch (error) {
			console.error(error)
		}
	})
	scheduledMessage.start()
}

module.exports = init