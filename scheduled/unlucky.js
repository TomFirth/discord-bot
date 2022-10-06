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
						"Moron, Moron, Moron, Moron, Moron",
						"twat.",
						"You'll never be the man, that your mother is.",
						"Ask me what, chicken snot. Ask me why, chicken pie",
						"Yer mum!"
					]
					utilities.channel(client, config.discord.channels.general, `${member}, ${insults[Math.floor(Math.random() * insults.length)]}`)
				}
				index++
			})
		})
		.catch(error => console.error(error))
	})
	scheduledMessage.start()
}

module.exports = init