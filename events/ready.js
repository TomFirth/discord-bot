const config = require("../config.json")

module.exports = (client) => {
	client.user.setActivity(config.bot.prefix + 'help', {type: 'LISTENING'})
	console.log(`Ready! Logged in as ${client.user.tag}`)
}