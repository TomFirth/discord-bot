const config = require("../config/config.json")

module.exports = (client) => {
	const today  = new Date()
	client.user.setActivity('Commands', {type: 'LISTENING'})
	console.log(`${today.toLocaleString()} - ${client.user.tag} is logged on.`)
}