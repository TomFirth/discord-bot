const { ChannelType } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const config = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Create a temporary channel")
    .addStringOption(option =>
      option
        .setName('type')
        .setDescription('The type of channel')
        .setRequired(true)
        .addChoices(
          { name: 'Text', value: 'channel_text' },
          { name: 'Voice', value: 'channel_voice' },
        ))
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Channel name")
        .setRequired(false)
    )
    .addNumberOption(option =>
      option
        .setName("limit")
        .setDescription("Set the user limit for the channel")
        .setRequired(false)),
  async execute(interaction) {
    // set user limit
    // set private/public
    let channelName = `${config.discord.emojis.clock} ${interaction.options.getString("name")}`
    if (interaction.options.getString("name")) channelName = `${config.discord.emojis.clock} ${interaction.options.getString("name")}`

    let type = ChannelType.GuildText
    let parent = config.discord.categories.tempText
    let userLimit = interaction.options.getNumber("limit") || 2

    if (interaction.options.getString("type") == "channel_voice") {
      type = ChannelType.GuildVoice
      parent = config.discord.categories.tempVoice
    }
    await interaction.guild.channels.create({
      name: channelName,
      type,
      parent,
      userLimit,
      permissionOverwrites: [
      {
          id: interaction.guild.roles.everyone
      }],
    })
    interaction.reply({
      content: "Your channel has been created.",
      ephemeral: true
    })
  }
}