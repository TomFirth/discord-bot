const { SlashCommandBuilder } = require("@discordjs/builders")
const utilities = require("../scripts/utilities")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Send a custom message")
    .addChannelOption(option =>
      option
        .setName('destination')
        .setDescription('Where to?')
        .setRequired(true))
    .addStringOption(option =>
      option
       .setName("message")
       .setDescription("What is your message?")
       .setRequired(true)),
  async execute(client, interaction) {
    interaction.reply({
      content: "thinking...",
      ephemeral: false
    })
    interaction.deleteReply()
    utilities.channel(client, interaction.options.getChannel('destination'), interaction.options.getString("message"))
  }
}