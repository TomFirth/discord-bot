const cron = require("cron")
const firebase = require("firebase-admin")
const db = firebase.firestore()
const config = require("../config.json")

function init(client) {
	let scheduledMessage = new cron.CronJob("00 00 00 */1 * *", async () => {
		const query = await db.collection("special").get()
		let users = []
		query.forEach(doc => {
			users.push({
				name: doc.data().user,
				timestamp: doc.data().timestamp
			})
		})
		const guild = client.guilds.cache.get(config.discord.guildId)
		guild.members.fetch()
		.then(members => {
			const now = new Date()
			members.forEach(member => {
				users.forEach(user => {
					if (member.user.username !== config.discord.owner.name
						&& member.user.username == user.name
						&& member._roles.includes("860466953582936094")
						&& user.timestamp < now) {
							const role = member.guild.roles.cache.find(role => role.name === "special")
							member.roles.remove(role)
					}
				})
			})
		})
		.catch(console.error)
	})
	scheduledMessage.start()
}

module.exports = init