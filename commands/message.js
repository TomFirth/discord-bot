const { SlashCommandBuilder } = require("@discordjs/builders")
const utilities = require("../scripts/utilities")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Send a custom message")
    .addChannelOption(channel =>
      channel
        .setName('destination')
        .setDescription('Where to?')
        .setRequired(true))
    .addStringOption(option =>
      option
       .setName("message")
       .setDescription("What is your message?")
       .setRequired(true)),
  async execute(interaction) {
    interaction.reply({
      content: "thinking...",
      ephemeral: false
    })
    interaction.deleteReply()
    const channel = interaction.channels.cache.find(channel => channel.id === interaction.options.getChannel('destination'))
    channel.send(interaction.options.getString("message"))
  }
}