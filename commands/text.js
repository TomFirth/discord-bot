const config = require('../config')
const clock = config.discord.emojis.clock

module.exports = {
  emoji: '⌨️',
  name: 'text',
  description: 'Create a temporary text channel',
  execute(interaction, args) {
    if(!args.length) channelName = `${clock} temp`
    else channelName = clock + " " + args.join(" ")
    interaction.guild.channels.create(channelName, {
      type: "text",
      permissionOverwrites: [
        {
          id: interaction.guild.roles.everyone
        }
      ],
    })
  },
}