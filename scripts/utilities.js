const firebase = require("firebase-admin")
firebase.initializeApp({
	credential: firebase.credential.cert(require("../credentials.json")),
})
const db = firebase.firestore()

module.exports = {
  channel: (client, destination, send) => {
    const channel = client.channels.cache.find(channel => channel.name === destination)
    channel.send(send)
  },

  special: async (client, user) => {
    const query = await db.collection("special").where("user", "==", user).get()
    let users = []
    query.forEach(doc => {
      users.push({
        name: doc.data().user,
        timestamp: doc.data().timestamp
      })
    })
    // add new date to their doc
    // let d = new Date()
		// d.setDate(d.getDate() + parseInt(7))
    const guild = client.guilds.cache.get(config.discord.guildId)
			guild.members.fetch()
			.then(members => {
				members.forEach(async member => {
					if (member.user.username !== config.discord.owner.name
            && !member._roles.includes("860466953582936094")
            && member.user.username == user) {
						const role = member.guild.roles.cache.find(role => role.name === "special")
						member.roles.add(role)
					}
				})
			})
			.catch(error => console.error(error))
  }
}