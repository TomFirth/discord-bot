const config = require('../config.json')
const clock = config.discord.emojis.clock

// set user limit
// set private/public

module.exports = {
  emoji: '🔈',
  name: 'voice',
  description: 'Temporary voice channel',
  execute(client, interaction, args) {
    if (!args || !args.length) channelName = `${clock} temp`
    else channelName = clock + " " + args.join(" ")
    interaction.guild.channels.create(channelName, {
      type: "GUILD_VOICE",
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone
        }
      ],
    }).then((channel) => {
      channel.setParent(config.discord.channels.tempVoice)
    })
  }
}
