const cron = require("cron")
const config = require("../config.json")

class UnSpecialCron {
  static start(client) {
		let scheduledMessage = new cron.CronJob("00 00 00 */14 * *", () => {
			// get all special users
			// loop through them to see if they have been special for over 2 weeks
			// remove special
			const guild = client.guilds.cache.get(config.discord.guildId)
			guild.members.fetch()
			.then(members => {
				members.forEach(member => {
					if (member.user.username !== config.discord.owner.name && member._roles.includes("860466953582936094")) {
						const role = member.guild.roles.cache.find(role => role.name === "special")
						member.roles.remove(role)
					}
				})
			})
			.catch(error => console.error(error, message.channel))
		})
		scheduledMessage.start()
	}
}

module.exports = UnSpecialCron