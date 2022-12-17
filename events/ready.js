const config = require("../config.json")

module.exports = (client) => {
	const today  = new Date()
	client.user.setPresence({
		status: 'available',
		activity: {
				name: 'SlashCommands',
				type: ActivityType.Listening
		}
})
	console.log(`${today.toLocaleString()} - ${client.user.tag} is logged on.`)
}