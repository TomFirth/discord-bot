const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("message")
    .setDescription("Send a custom message from Barber")
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
    interaction.client.channels.cache.get(interaction.options.getChannel('destination').id).send(interaction.options.getString("message"))
  }
}