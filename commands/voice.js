const config = require('../config.json')
const clock = config.discord.emojis.clock

// set user limit
// set private/public

module.exports = {
  emoji: '🔈',
  name: 'voice',
  description: 'Create a temporary voice channel',
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
