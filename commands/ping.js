const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
    .setname("ping")
    .setDescription("Check that Barber\'s ok"),
  async execute(interaction) {
    const initial = interaction.createdTimestamp
    const now = new Date()
    interaction.reply(`${now - initial}ms`)
  }
}