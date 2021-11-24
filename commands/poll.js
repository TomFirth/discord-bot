const { MessageEmbed } = require('discord.js')
const config = require('../config.json')

module.exports = {
  emoji: '👍',
  name: 'poll',
  description: 'Poll to decide on things!',
  execute(client, message, args) {
    if (!args.length) return message.reply(`**Please add a question.**`)
    const poll = new MessageEmbed()
      .setDescription(`Poll: **${args.join(" ")}**`)
      .setColor('RED')
    return message.channel.send({ embeds: [poll] }).then(ownMessage => {
      ownMessage.react(config.discord.emojis.thumbsUp)
      ownMessage.react(config.discord.emojis.thumbsDown)
    })
  },
}

// detect emojis
// if they exist, use them as poll reactions instead of thumb up / thumb down
// defaults to thumbs
