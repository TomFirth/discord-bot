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
    ),
  async execute(interaction) {
    // set user limit
    // set private/public
    let channelName = `${config.discord.emojis.clock} ${interaction.options.getString("name")}`
    if (interaction.options.getString("name")) channelName = `${config.discord.emojis.clock} ${interaction.options.getString("name")}`

    let type = "GUILD_TEXT"
    let parent = config.discord.categories.tempText

    if (interaction.options.getString("type") == "channel_voice") {
      type = "GUILD_VOICE"
      parent = config.discord.categories.tempVoice
    }
    await interaction.guild.channels.create({
      name: channelName,
      type,
      parent,
      permissionOverwrites: [
      {
          id: interaction.guild.roles.everyone
      }],
    })
  }
}