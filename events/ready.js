module.exports = (client) => {
	client.user.setActivity(".help", { type: "LISTENING"})
	console.log(`Ready! Logged in as ${client.user.tag}`)
}
