const cron = require('cron')

module.exports = (client, message) => {
	let scheduledMessage = new cron.CronJob('00 00 00 * * 0', () => {
    const role = message.guild.roles.cache.get("Special")
		role.members.forEach((member, i) => {
			setTimeout(() => {
				member.roles.remove(Role)
			}, i * 1000)
		})
  })
  .catch(console.error)
	scheduledMessage.start()
}