const cron = require("cron")
const config = require("../config.json")

class LuckyCron {
  static start(client) {
		let scheduledMessage = new cron.CronJob("00 */1 12 * * *", () => {
			console.log("1")
			const guild = client.guilds.cache.get(config.discord.guildId)
			guild.members.fetch()
			.then(members => {
				const winner = Math.floor(Math.random() * members.length)
				console.log("2", winner)
				let index = 0
				members.forEach(member => {
					console.log("3", index, member.user.username)
					if (member.user.username !== config.discord.owner.name && !member._roles.includes("860466953582936094") && index == winner) {
						console.log("4")
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