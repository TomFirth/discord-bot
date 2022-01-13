const cron = require("cron")
const config = require("../config.json")

class LuckyCron {
  static start(client) {
		let scheduledMessage = new cron.CronJob("00 */1 12 * * *", () => {
			console.log("1")
			const guild = client.guilds.cache.get(config.discord.guildId)
			console.log("2")
			const winner = Math.floor(Math.random() * guild.members.length)
			console.log("3", winner)
			guild.members.fetch()
			.then(members => {
				console.log("4")
				let index = 0
				members.forEach(member => {
					console.log("5", index, member.user.username)
					if (member.user.username !== config.discord.owner.name && !member._roles.includes("860466953582936094") && index == winner) {
						console.log("6")
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