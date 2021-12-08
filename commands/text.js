const config = require("../config.json")
const clock = config.discord.emojis.clock

// set user limit
// set private/public

module.exports = {
  emoji: '⌨️',
  name: 'text',
  description: 'Temporary text channel',
  execute(client, message, args) {
    if (!args || !args.length) channelName = `${clock} temp`
    else channelName = clock + " " + args.join(" ")
    message.guild.channels.create(channelName, {
      type: "text",
      permissionOverwrites: [
        {
          id: message.guild.roles.everyone
        }
      ],
    }).then((channel) => {
      channel.setParent(config.discord.categories.tempText)
    })
  }
}
