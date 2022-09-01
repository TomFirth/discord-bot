const { SlashCommandBuilder } = require("@discordjs/builders")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Send a custom message")
    .addStringOption(option =>
      option
       .setName("message")
       .setDescription("What is your message?")
       .setRequired(true)
    .addChannelOption(option =>
      option
        .setName('destination')
        .setDescription('Where to?'))
    ),
  async execute(client, interaction) {
    interaction.delete()
    utilities.channel(client, interaction.options.getString("destination"), interaction.options.getString("message"))
  }
}