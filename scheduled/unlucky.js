const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

function init(client) {
	let scheduledMessage = new cron.CronJob("00 00 12 * * 3", () => {
		const guild = client.guilds.cache.get(config.discord.guildId)
		guild.members.fetch()
		.then(members => {
			const memberLength = members.size
			const winner = Math.floor(Math.random() * memberLength)
			let index = 0
			members.forEach(member => {
				if (member.user.username !== config.discord.owner.name && !member._roles.includes("860466953582936094") && index == winner) {
					const insults = [
						"You smell.",
						"Are you lucky or unlucky?",
						"Today, is not your day.",
						"Better luck next time."
					]
					utilities.channel(client, config.discord.channels.general, `${member}, ${insult[Math.floor(Math.random() * insults.length])}`)
					// member.timeout(5 * 60 * 1000, 'Are you lucky or unlucky?')
					// .then(() => {
					// 	utilities.channel(client, config.discord.channels.general, `${member} has been timed out for 5 minutes.`)
					// })
				}
				index++
			})
		})
		.catch(error => console.error(error))
	})
	scheduledMessage.start()
}

module.exports = init