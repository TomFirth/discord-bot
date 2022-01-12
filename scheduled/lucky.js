const cron = require("cron")
const config = require("../config.json")

class LuckyCron {
  static start(client) {
		let scheduledMessage = new cron.CronJob("00 00 12 * * 3", () => {
			const guild = client.guilds.cache.get(config.discord.guildId)
      const winner = Math.floor(Math.random() * guild.members.length)
			guild.members.fetch()
			.then(members => {
				members.forEach((member, index) => {
					if (member.user.username !== config.discord.owner.name && member._roles.includes("860466953582936094") && index == winner) {
						const role = member.guild.roles.cache.find(role => role.name === "special")
						member.roles.add(role)
					}
				})
			})
			.catch(error => console.error(error, message.channel))
		})
		scheduledMessage.start()
	}
}

module.exports = LuckyCron