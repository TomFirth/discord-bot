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
    const startTime = '19:00:00';
    const endTime = '23:59:59';
    const currentDate = new Date()   
    let startDate = new Date(currentDate.getTime())
    startDate.setHours(startTime.split(":")[0])
    let endDate = new Date(currentDate.getTime())
    endDate.setHours(endTime.split(":")[0])
    endDate.setMinutes(endTime.split(":")[1])
    const valid = startDate < currentDate && endDate > currentDate
    if (!cache.has("answer") && valid) {
      const lastQuestion = db.collection("answer").doc("uLLtQDVl1lo41har8LqO")
      const doc = await lastQuestion.get()
      if (!doc.data().used) {
        cache.set("answer", doc.data().answer)
      }
    }
    let answer = cache.get("answer")
    answer = answer.toString().toLowerCase()
    const userAnswer = message.content.toLowerCase().replace("answer ", "")
    if (userAnswer == answer) {
      const games = [
        "",
        "Quiz",
        "Pokemon",
        "Pokemon",
        "Riddle",
        "Movie",
        ""
      ]
      const date = new Date()
      const today = date.getDay()
      let gameEmbed
      if (games[today] == "Pokemon") {
        let number
        kanto.forEach((pokemon, index) => {
          if (userAnswer == pokemon) {
            const len = 3 - ('' + index).length
            const newIndex = (len > 0 ? new Array(++len).join('0') : '') + index
            number = newIndex
          }
        })
        gameEmbed = new EmbedBuilder()
          .setTitle("Who's that Pokemon? WINNER!")
          .setImage(`attachment://${number}.jpg`)
          .setThumbnail(message.author.displayAvatarURL())
          .setColor(colours.gold)
          .setDescription(`Congratulations ${message.member} with the correct answer of: ${userAnswer}!`)
        message.channel.send({ embeds: [gameEmbed], files: [`../discord-bot/images/pokemon/answers/${number}.jpg`] }).then(ownMessage => {
          ownMessage.react(config.discord.emojis.clap)
        })
      } else {
        gameEmbed = new EmbedBuilder()
          .setTitle(`${games[today]} WINNER!`)
          .setThumbnail(message.author.displayAvatarURL())
          .setColor(colours.gold)
          .setDescription(`Congratulations ${message.member} with the correct answer of: ${userAnswer}!`)
        message.channel.send({ embeds: [gameEmbed] }).then(ownMessage => {
          ownMessage.react(config.discord.emojis.clap)
        })
      }
      cache.del("answer")
      db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({ used: true })
      // REWARD
      if (!message.member.roles.cache.some(role => role.name === "special")) {
        utilities.channel(client, config.discord.channels.special, `Welcome ${message.member}`)
        const role = message.guild.roles.cache.find(role => role.name === "special")
        message.member.roles.add(role)
      }
      utilities.specialSort(message.author.id)
    } else {
      if (answer !== "" || answer) {
        const guessArray = userAnswer.split(' ')
        const answerArray = answer.split(' ')
        answerArray.forEach(value => {
          if (guessArray.includes(value)) {
            message.react("🤏")
            return
          }
        })
        message.react(config.discord.emojis.thumbsDown)
      } else {
        message.channel.send("The game has ended for now.") // this isn't working?
      }
    }
  }

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
