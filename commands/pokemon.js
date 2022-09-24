const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const Cache = require("node-cache")
const cache = new Cache({ stdTTL: 18 * 1000000 }) // 5hrs
const { kanto } = require("../pokemon.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pokemon")
    .setDescription("Who's that pokemon"),
  async execute(interaction) {
    const random = Math.floor(Math.random() * kanto.length)
    var len = 3 - ('' + random).length
    number = (len > 0 ? new Array(++len).join('0') : '') + random
    console.log("number", random, number)
    const pokeEmbed = new EmbedBuilder()
      .setTitle("Who's that Pokemon?")
      .setDescription(`Reply with: "/answer <your answer>`)
      .setImage(`attachment://${number}.jpg`)
    const pokemon = kanto[random + 1]
    console.log("answer", pokemon.toString())
    cache.set("answer", pokemon.toString())
    interaction.reply({ embeds: [pokeEmbed], files: [`../discord-bot/images/pokemon/questions/${number}.jpg`] })
  }
}