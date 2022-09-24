const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pokemon")
    .setDescription("Who's that pokemon"),
  async execute(interaction) {
    const random = Math.floor(Math.random() * kanto.length)
    const number = pad(random)
    const pokeEmbed = new EmbedBuilder()
      .setTitle("Who's that Pokemon?")
      .setDescription(`Reply with: "/answer <your answer>`)
      .setImage(`attachment://${number}.jpg`)
    const pokemon = kanto[random + 1]
    console.log("answer", pokemon.toString())
    interaction.reply({ embeds: [pokeEmbed], files: [`../discord-bot/images/pokemon/questions/${number}.jpg`] })
  }
}