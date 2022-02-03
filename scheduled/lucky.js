const cron = require("cron")
const config = require("../config.json")

class LuckyCron {
  static start(client) {
		let scheduledMessage = new cron.CronJob("00 00 12 * * 3", () => {
			const guild = client.guilds.cache.get(config.discord.guildId)
			guild.members.fetch()
			.then(members => {
				const memberLength = members.size
				const winner = Math.floor(Math.random() * memberLength)
				let index = 0
				members.forEach(member => {
					if (member.user.username !== config.discord.owner.name && !member._roles.includes("860466953582936094") && index == winner) {
						const role = member.guild.roles.cache.find(role => role.name === "special")
						member.roles.add(role)
						let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.special)
						channel.send(`Welcome ${member.displayName}`)
						let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.general)
						channel.send(`${member.displayName} Is this week's lucky winner!`)
					}
					index++
				})
			})
			.catch(error => console.error(error))
		})
		scheduledMessage.start()
	}
}

module.exports = LuckyCron