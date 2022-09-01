const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coin")
    .setDescription("Flip a coin!"),
  async execute(interaction) {
    const coin = [
      "heads",
      "tails"
    ]
    interaction.reply(coin[Math.floor(Math.random() * coin.length)])
  }
}