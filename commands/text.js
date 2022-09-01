const { SlashCommandBuilder } = require("@discordjs/builders")
const config = require("../config.json")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("text")
    .setDescription("Create a text channel")
    .addStringOption(option =>
      option
      .setName("name")
      .setDescription("Channel name")
      .setRequired(true)
    ),
  async execute(interaction) {
    // set user limit
    // set private/public
    if (!interaction.options.getString("name")) channelName = `${config.discord.emojis.clock} temp`
    else channelName = config.discord.emojis.clock + " " + interaction.options.getString("name")
    client.guild.channels.create(channelName, {
      type: "text",
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone
        }
      ],
    }).then((channel) => {
      channel.setParent(config.discord.categories.tempText)
    })
  }
}