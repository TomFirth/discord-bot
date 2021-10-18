// const cron = require('cron')

module.exports = (client) => {
	client.user.setActivity(".help", { type: "LISTENING"})
	console.log(`Ready! Logged in as ${client.user.tag}`)

	// const old = new Date(new Date().getTime() - (24 * 60 * 60 * 1000))
	// let scheduledMessage = new cron.CronJob('00 00 04 * * *', () => {
	// console.log(client)
	// let tempText = client.guild.channels.filter(c => c.parentID === config.discord.channels.tempText)
	// let tempVoice = client.guild.channels.filter(c => c.parentID === config.discord.channels.tempVoice)
	// console.log(tempText)
	// console.log(tempVoice)
	// const categoryChannels = tempText.concat(tempVoice)
	// categoryChannels.forEach(channel => {
	// 	channel.messages.fetch({ limit: 1 }).then(messages => {
	// 	let lastMessage = messages.first()
	// 	console.log("lastMessage", lastMessage)
		// if (!lastMessage.author.bot) {
		//   channel.delete()
		// }
	// 	})
	// 	.catch(console.error)
	// })
	// })
	// scheduledMessage.start()
}
