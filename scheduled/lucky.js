const cron = require("cron")
const config = require("../config.json")

class LuckyCron {
  static start(client) {
		let scheduledMessage = new cron.CronJob("00 */1 12 * * *", () => {
			const guild = client.guilds.cache.get(config.discord.guildId)
			guild.members.fetch()
			.then(members => {
				const memberLength = guild.members.filter(member => !member.user.bot).size
				const winner = Math.floor(Math.random() * memberLength)
				console.log("winner", memberLength)
				let index = 0
				members.forEach(member => {
					console.log(index, member.user.username)
					if (member.user.username !== config.discord.owner.name && !member._roles.includes("860466953582936094") && index == winner) {
						const role = member.guild.roles.cache.find(role => role.name === "special")
						member.roles.add(role)
						let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.special)
						channel.send(`Welcome ${member.user.username}`)
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