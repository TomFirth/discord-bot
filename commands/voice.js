const { SlashCommandBuilder } = require("@discordjs/builders")
const config = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setname("voice")
    .setDescription("Create a voice channel")
    .addStringOption(option => {
      option
      .setName("name")
      .setdescription("Channel name")
      .setRequired(true)
    }),
  async execute(interaction) {
    // set user limit
    // set private/public
    if (!interaction.options.getString("name")) channelName = `${config.discord.emojis.clock} temp`
    else channelName = config.discord.emojis.clock + " " + interaction.options.getString("name")
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