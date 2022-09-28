const { EmbedBuilder } = require("discord.js")
const firebase = require("firebase-admin")
const db = firebase.firestore()
const Cache = require("node-cache")
const cache = new Cache({ stdTTL: 18 * 1000000 })
const utilities = require("../scripts/utilities")
const colours = require("../colours.json")
const config = require("../config.json")
const { kanto } = require("../pokemon.json")
const trolls = require("../troll.json")

module.exports = async (client, message) => {
  // AUTO PUBLISH FREE GAMES
  if (message.channel.type === "free" && message.author.bot) {
    message.crosspost()
      .then(() => console.log("Message published"))
      .catch(error => console.error(error))
  }

  // SPECIFIC USER TROLLS
  trolls.forEach(troll => {
    if (react) {
      if (message.content.toLowerCase().includes(troll.message.toLowerCase()) && Math.floor(Math.random() * troll.chance) == 0) {
        message.react(troll.react)
      }
    } else if (troll.includes && !troll.emoji && troll.response) {
      if (message.content.toLowerCase().includes(troll.message.toLowerCase()) && Math.floor(Math.random() * troll.chance) == 0) {
        message.channel.send(troll.response)
      }
    } else if (troll.includes && troll.emoji && troll.response) {
      if (message.content.toLowerCase().includes(troll.message.toLowerCase()) && Math.floor(Math.random() * troll.chance) == 0) {
        message.channel.send(troll.response).then(ownMessage => {
          ownMessage.react(troll.emoji)
        })
      }
    } else if (!troll.includes && !troll.emoji && troll.response) {
      if (message.content.toLowerCase() == troll.message.toLowerCase() && Math.floor(Math.random() * troll.chance) == 0) {
        message.channel.send(troll.response)
      }
    }
  })

  // SPECIAL ROLE REWARD
  if (message.member !== undefined) {
    const reactArray = ['⭐','🏆','👏','👍','🥇']
    if (message.member.roles.cache.some(role => role.name === "special")
      && Math.floor(Math.random() * 36) == 0
      && !message.content.toLowerCase().split(' ')[0] == "answer") {
      message.react(reactArray[Math.floor(Math.random() * reactArray.length)])
    }
  }
}
