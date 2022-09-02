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
    if (!interaction.options.getString("name")) channelName = `${config.discord.emojis.clock} temp`
    else channelName = config.discord.emojis.clock + " " + interaction.options.getString("name")

    const type = "text"
    const parent = config.discord.categories.tempText

    if (interaction.options.getString("type") == "channel_text") {
      type = "text"
      parent = config.discord.categories.tempText
    } else if (interaction.options.getString("name") == "channel_voice") {
      type = "GUILD_VOICE"
      parent = config.discord.categories.tempVoice
    }
    interaction.guild.channels.create(channelName, {
      type: "GUILD_VOICE",
      permissionOverwrites: [{
        id: interaction.guild.roles.everyone
      }],
    }).then(channel => {
      channel.setParent(config.discord.categories.tempVoice)
    })
  }
}