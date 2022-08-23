const { EmbedBuilder } = require("discord.js")
const config = require("../config.json")
const utilities = require("../scripts/utilities")

module.exports = {
  emoji: '👍',
  name: 'poll',
  aliases: ["poll", "decide", "vote"],
  description: 'Let others decide',
  execute(client, message, args) {
    if (!args.length) return message.reply(`**Please add a question.**`)
    const poll = new EmbedBuilder()
      .setDescription(`Poll: **${args.join(" ")}**`)
      .setColor(utilities.randomColour())
    return message.channel.send({ embeds: [poll] }).then(ownMessage => {
      ownMessage.react(config.discord.emojis.thumbsUp)
      ownMessage.react(config.discord.emojis.thumbsDown)
    })
  },
}
