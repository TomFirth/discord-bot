const config = require("../config.json")
const clock = config.discord.emojis.clock

// set user limit

module.exports = {
  emoji: '🔈',
  name: 'voice',
  description: 'Temporary voice channel',
  execute(client, message, args) {
    if (!args || !args.length) channelName = `${clock} temp`
    else channelName = clock + " " + args.join(" ")
    message.guild.channels.create(channelName, {
      type: "GUILD_VOICE",
      permissionOverwrites: [{
        id: message.guild.roles.everyone
      }],
    }).then((channel) => {
      channel.setParent(config.discord.categories.tempVoice)
    })
  }
}
