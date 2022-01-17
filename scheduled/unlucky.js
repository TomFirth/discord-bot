const cron = require("cron")
const config = require("../config.json")

class UnluckyCron {
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
						member.guild.timeout(5 * 60 * 1000, 'Are you lucky or unlucky?')
						.then(() => {
							let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.general)
							channel.send(`${member} has been timed out for 5 minutes.`)
						})
					}
					index++
				})
			})
			.catch(error => console.error(error))
		})
		scheduledMessage.start()
	}
}

module.exports = UnluckyCron