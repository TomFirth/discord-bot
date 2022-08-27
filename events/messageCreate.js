const { EmbedBuilder } = require("discord.js")
const firebase = require("firebase-admin")
const db = firebase.firestore()
const Cache = require("node-cache")
const cache = new Cache({ stdTTL: 18 * 1000000 })
const utilities = require("../scripts/utilities")
const config = require("../config.json")
const trolls = require("../troll.json")
const colours = require("../colours.json")

module.exports = (client, message) => {
  console.log("message", message.content)
  console.log("is command", message.content.charAt(0) == config.bot.prefix)
  if (message.content.charAt(0) == config.bot.prefix) {
      if(message.type !== "DM" || !message.author.bot) {
      console.log("this is a command")
      const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/)
      const commandName = args.shift().toLowerCase();
      const commandGet = client.commands.get(commandName)
        || client.commands.find(command => command.aliases && command.aliases.includes(commandName))
      if (!commandGet) return
      else {
        try {
          commandGet.execute(client, message, args, config.bot.prefix)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
  console.log("after check")

  // SPECIFIC USER TROLLS
  trolls.forEach(troll => {
    if (troll.includes && !troll.emoji) {
      if (message.content == troll.message && Math.floor(Math.random() * troll.chance) == 0) {
        message.channel.send(troll.response)
      }
    } else if (troll.includes && troll.emoji) {
      if (message.content.toLowerCase().includes(troll.message) && Math.floor(Math.random() * troll.chance) == 0) {
        message.channel.send(troll.response).then(ownMessage => {
          ownMessage.react(troll.emoji)
        })
      }
    } else if (!troll.includes && !troll.emoji) {
      if (message.content == troll.message && Math.floor(Math.random() * troll.chance) == 0) {
        message.channel.send(troll.response)
      }
    }
  })

  console.log("is answer?", message.content.toLowerCase().split(' ')[0])

  // GAMES RESPONSES
  if (message.content.toLowerCase().split(' ')[0] == "answer") {
    console.log("an answer has been given!")
    let answer = cache.get("answer") || ""
    answer = answer.toLowerCase()
    console.log("answer?", answer)
    const userAnswer = message.content.toLowerCase().replace("answer ", "")
    console.log("userAnswer", userAnswer)
    if (userAnswer == answer) {
      const games = [
        "",
        "Quiz",
        "Maths",
        "",
        "Riddle",
        "Movie",
        ""
      ]
      const date = new Date()
      const today = date.getDay()
      const gameEmbed = new EmbedBuilder()
        .setTitle(`${games[today]} WINNER!`)
        .setThumbnail(message.author.displayAvatarURL())
        .setColor(colours.gold)
        .setDescription(`Congratulations ${message.member} with the correct answer of: ${userAnswer}!`)
      message.channel.send({ embeds: [gameEmbed] }).then(ownMessage => {
        ownMessage.react(config.discord.emojis.clap)
      })
      cache.remove("answer")
      db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({ used: true })
      // REWARD
      if (!message.member.roles.cache.some(role => role.name === "special")) {
        utilities.channel(client, config.discord.channels.special, `Welcome ${message.member}`)
        const role = message.guild.roles.cache.find(role => role.name === "special")
        message.member.roles.add(role)
      }
      utilities.specialSort(message.author.id)
    } else {
      if (answer != "" || !answer) {
        const guessArray = userAnswer.split(' ')
        const answerArray = answer.split(' ')
        answerArray.forEach(value => {
          if (guessArray.includes(value)) {
            message.react("🤏")
            return
          }
        })
        message.react(config.discord.emojis.thumbsDown)
      }
    }
  }

  // SPECIAL ROLE REWARD
  const reactArray = ['⭐','🏆','👏','👍','🥇']
  if (message.member.roles.cache.some(role => role.name === "special")
    && Math.floor(Math.random() * 49) == 0
    && !message.content.toLowerCase().split(' ')[0] == "answer") {
    message.react(reactArray[Math.floor(Math.random() * reactArray.length)])
  }
}
