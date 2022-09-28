const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const firebase = require("firebase-admin")
const db = firebase.firestore()
const Cache = require("node-cache")
const cache = new Cache({ stdTTL: 18 * 1000000 }) // 5hrs
const config = require("../config.json")
const { kanto } = require("../pokemon.json")
const colours = require("../colours.json")
const utilities = require("../scripts/utilities")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("answer")
    .setDescription("What is your answer?")
    .addStringOption(option =>
      option
        .setName("answer")
        .setDescription("Your answer")
        .setRequired(true)
    ),
  async execute(interaction) {
    const startTime = '19:00:00'
    const endTime = '23:59:59'
    const current = new Date()   
    let start = new Date(current.getTime())
    start.setHours(startTime.split(":")[0])
    start.setMinutes(startTime.split(":")[1])
    let end = new Date(current.getTime())
    end.setHours(endTime.split(":")[0])
    end.setMinutes(endTime.split(":")[1])
    const valid = start < current && end > current
    if ((!cache.has("answer") || answer === "undefined") && valid) {
      const lastQuestion = db.collection("answer").doc("uLLtQDVl1lo41har8LqO")
      const doc = await lastQuestion.get()
      if (!doc.data().used) {
        cache.set("answer", doc.data().answer)
      }
    }
    if (!valid || !cache.has("answer")) {
      interaction.reply({ content: "There is no game being played", ephemeral: true })
      return
    }
    answer = cache.get("answer")
    answer += ""
    answer = answer.toLowerCase()
    const userAnswerRaw = interaction.options.getString("answer").replace("answer ", "")
    const userAnswer = userAnswerRaw.toLowerCase()
    console.log("answer", userAnswer, answer)
    if (userAnswer == answer) {
      const games = [
        "",
        "Quiz",
        "Pokemon",
        "",
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
          if (userAnswer == pokemon.toLowerCase()) {
            const len = 3 - ('' + index).length
            let newIndex = index + 1
            newIndex = (len > 0 ? new Array(++len).join('0') : '') + newIndex
            number = newIndex
          }
        })
        gameEmbed = new EmbedBuilder()
          .setTitle("Who's that Pokemon? WINNER!")
          .setImage(`attachment://${number}.jpg`)
          .setThumbnail(interaction.author.displayAvatarURL())
          .setColor(colours.gold)
          .setDescription(`Congratulations ${interaction.member} with the correct answer of: ${userAnswerRaw}!`)
        interaction.channel.send({ embeds: [gameEmbed], files: [`../discord-bot/images/pokemon/answers/${number}.jpg`] }).then(ownMessage => {
          ownMessage.react(config.discord.emojis.clap)
        })
      } else {
        gameEmbed = new EmbedBuilder()
          .setTitle(`${games[today]} WINNER!`)
          .setThumbnail(interaction.member.displayAvatarURL())
          .setColor(colours.gold)
          .setDescription(`Congratulations ${interaction.member} with the correct answer of: ${userAnswerRaw}!`)
        interaction.channel.send({ embeds: [gameEmbed] }).then(ownMessage => {
          ownMessage.react(config.discord.emojis.clap)
        })
      }
      // REWARD
      if (!interaction.member.roles.cache.some(role => role.name === "special")) {
        const role = interaction.guild.roles.cache.find(role => role.name === "special")
        interaction.member.roles.add(role)
      }
      utilities.specialSort(interaction.member.id)
      cache.del("answer")
      db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({ used: true })
    } else if (userAnswer !== answer && cache.has("answer")) {
      const message = await interaction.reply({ content: `${interaction.member} got it wrong with: ${interaction.options.getString("answer")}`, fetchReply: true })
      message.react(config.discord.emojis.thumbsDown)
    }
  }
}