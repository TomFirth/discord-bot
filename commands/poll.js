const { EmbedBuilder } = require("discord.js")
const config = require("../config.json")
const colours = require("../colours.json")

module.exports = {
  emoji: '👍',
  name: 'poll',
  aliases: ["poll", "decide", "vote"],
  description: 'Let others decide',
  execute(client, message, args) {
    if (!args.length) return message.reply(`**Please add a question.**`)
    const poll = new EmbedBuilder()
      .setDescription(`Poll: **${args.join(" ")}**`)
      .setColor(colours.random)
    return message.channel.send({ embeds: [poll] }).then(ownMessage => {
      ownMessage.react(config.discord.emojis.thumbsUp)
      ownMessage.react(config.discord.emojis.thumbsDown)
    })
  },
}
