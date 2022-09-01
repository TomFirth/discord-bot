const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Barber\'s uptime"),
  async execute(interaction) {
    let totalSeconds = (client.uptime / 1000)
    let days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    let hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = Math.floor(totalSeconds % 60)
    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`
		await interaction.reply(uptime)
  }
}