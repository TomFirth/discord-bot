const cron = require("cron")
const config = require("../config/config.json")

function init(client, db) {
	let scheduledMessage = new cron.CronJob("00 00 9 * * *", async () => {
		const query = await db.collection('birthdays').get()
		let today = new Date()
		let todayMonth = today.getMonth()
		let todayDay = today.getDay()
		query.forEach(async doc => {
			let userBirthday = new Date(doc.data().birthday)
			let userBirthdayMonth = userBirthday.getMonth()
			let userBirthdayDay = userBirthday.getDay()
			if (todayDay == userBirthdayDay && todayMonth == userBirthdayMonth) {
				const user = await client.users.fetch(doc.data().id, { cache: true })
				utilities.channel(client, config.discord.channels.general, `Happy birthday to ${user.username}`)
			}
		})
	})
	scheduledMessage.start()
}

module.exports = init