const { EmbedBuilder } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const config = require("../config.json")
const utilities = require("../scripts/utilities")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Create a poll")
    .addStringOption(option =>
      option
      .setName("question")
      .setDescription("Poll question")
      .setRequired(true)
    ),
  async execute(interaction) {
    const poll = new EmbedBuilder()
      .setDescription(`Poll: **${interaction.options.getString("question")}**`)
      .setColor(utilities.randomColour())
      interaction.reply({
        content: "thinking...",
        ephemeral: false
      })
    interaction.channel.send({ embeds: [poll] }).then(ownMessage => {
      ownMessage.react(config.discord.emojis.thumbsUp)
      ownMessage.react(config.discord.emojis.thumbsDown)
    })
  }
}