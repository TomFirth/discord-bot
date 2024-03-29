const firebase = require("firebase-admin")
const db = firebase.firestore()
const metrics = require("../scripts/metrics")
const config = require("../config.json")

exports.channel = async function (client, destination, send) {
  const channel = await client.channels.cache.find(channel => channel.name === destination)
  channel.send(send)
}

exports.special = async function (client, user) {
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
    .catch(console.error)
}

function compare (a, b) {
  if (a.timestamp < b.timestamp) { return -1 }
  else if (a.timestamp > b.timestamp) { return 1 }
  return 0
}

exports.specialSort = async function (user) {
  const query = await db.collection("special").get()
  const timestamp = new Date()
  let userArray = []
  query.forEach(doc => {
    if (user !== doc.data().user) {
      userArray.push({
        id: doc.id,
        timestamp: doc.data().timestamp,
        user: doc.data().user
      })
    }
  })
  userArray.sort(compare())
  userArray.shift()
  userArray.push({
    id: userArray[1].id,
    timestamp,
    user
  })
  userArray.forEach(async user => {
    await db.collection("special").doc(user.id).update({
      user: user.user,
      timestamp
    })
  })
}

exports.randomColour = function () {
  return Math.floor(Math.random()*16777215).toString(16)
}

exports.cooldown = function (interaction, userId) {
  client = interaction.client
  if (client.cooldowns.has(interaction.user.id)) {
    interaction.reply({ content: "Please wait for cooldown to end", ephemeral: true })
    throw new Error("Stop command")
  } else {
    client.cooldowns.set(interaction.user.id, true)
  }
}

exports.reportCommand = function (client, user, cmd) {
  metrics.reportCommand()
  channel(client, "bot", `${user} ran ${cmd}`)
}
