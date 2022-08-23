const firebase = require("firebase-admin")
const db = firebase.firestore()
const config = require("../config.json")

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
  },

  compare: (a, b) => {
    if (a.timestamp < b.timestamp) { return -1 }
    else if (a.timestamp > b.timestamp) { return 1 }
    return 0
  },

  specialSort: async user => {
    const query = await db.collection("special").get()
    const timestamp = new Date()
    let userArray = []
    let updated = false
    query.forEach(doc => {
      if (user !== doc.data().user) {
        userArray.push({
          id: doc.id,
          timestamp: doc.data().timestamp,
          user: doc.data().user
        })
      } else {
        db.collection("special").doc(doc.id).update({ timestamp })
        updated = true
      }
    })
    if (!updated) {
      userArray.sort(compare)
      const newUser = {
        id: userArray[1].id,
        timestamp: timestamp,
        user
      }
      userArray.shift()
      userArray.push(newUser)
    }
    userArray.forEach(async user => {
      await db.collection("special").doc(user.id).update({
        user: user.user,
        timestamp
      })
    })
  },

  randomColour() {
    return Math.floor(Math.random()*16777215).toString(16)
  }
}