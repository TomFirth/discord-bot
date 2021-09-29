const config = require('../config')
const clock = config.discord.emojis.clock

module.exports = {
  emoji: '🔈', //OPTIONAL
  name: 'voice',
  description: 'Create a temporary voice channel', //OPTIONAL
  execute(client, interaction, args) {
    if(!args || !args.length) channelName = `${clock} temp`
    else channelName = clock + " " + args.join(" ")
    interaction.guild.channels.create(channelName, {
      type: "GUILD_VOICE",
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone
        }
      ],
    }).then((channel) => {
      channel.setParent('622501516695044118')
    })
  }
}
