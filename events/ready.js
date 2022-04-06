const config = require("../config.json")

module.exports = (client) => {
	const today  = new Date()
	client.user.setActivity(config.bot.prefix + 'help', {type: 'LISTENING'})
	console.log(`${today.toLocaleString()} Ready! Logged in as ${client.user.tag}`)
}