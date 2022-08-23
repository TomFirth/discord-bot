const { Discord, EmbedBuilder } = require("discord.js")
const firebase = require("firebase-admin")
const db = firebase.firestore()
const Cache = require("node-cache")
const cache = new Cache({ stdTTL: 18 * 1000000 })
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")
const trolls = require("../troll.json")

module.exports = (client, message) => {
  if (message.content.startsWith(config.bot.prefix)) {
    if (message.type === "DM" || message.author.bot) return
    const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase();
    const commandGet = client.commands.get(commandName)
      || client.commands.find(command => command.aliases && command.aliases.includes(commandName))
    console.log("command", commandGet)
    if (!commandGet || commandGet.charAt(0) === "." || commandGet.charAt(0) === "/") return
    else {
      try {
        command.run(client, message, args, config.bot.prefix)
      } catch (error) {
        console.error(error)
    }
    }
  }

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

  // GAMES RESPONSES
  if (message.content.toLowerCase().split(' ')[0] == "answer") {
    let answer = cache.get("answer")
    answer = answer.toLowerCase()
    const userAnswer = message.content.toLowerCase().replace("answer ", "")
    if (userAnswer.includes(answer)) {
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
        .setColor("GOLD")
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
        console.log("userAnswer", userAnswer, "answer", answer)
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
  
  const command = client.botCommands.get(command_name)
  if (!command) return 
  try {
    command.execute(client, message, args)
  } catch (error) {
    return client.error(error)
  }
}
