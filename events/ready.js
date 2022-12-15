const config = require("../config.json")

module.exports = (client) => {
	const today  = new Date()
	client.user.setPresence({
		activities: [{ name: `SlashCommands`, type: ActivityType.Listening }],
		status: 'online',
	});
	console.log(`${today.toLocaleString()} - ${client.user.tag} is logged on.`)
}