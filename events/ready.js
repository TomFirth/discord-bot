const config = require("../config.json")

module.exports = (client) => {
	const today  = new Date()
	client.user.setActivity("SlashCommands", { type: 'LISTENING' });
	console.log(`${today.toLocaleString()} - ${client.user.tag} is logged on.`)
}