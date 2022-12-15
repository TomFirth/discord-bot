const config = require("../config.json")

module.exports = (client) => {
	const today  = new Date()
	client.user.setActivity("Try SlashCommands");
	console.log(`${client.users.size} users. ${client.channels.size} channels.`)
	console.log(`${today.toLocaleString()} - ${client.user.tag} is logged on.`)
}