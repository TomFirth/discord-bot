const { MessageEmbed } = require('discord.js')
const config = require('../config.json')

const thumbsUp = config.discord.emojis.thumbsUp
const thumbsDown = config.discord.emojis.thumbsDown

module.exports = {
  emoji: '👍',
  name: 'poll',
  description: 'Poll to decide on things!',
  execute(interaction, args) {
    if(!args.length) return interaction.reply(`**Please add a question.**`)
    const poll = new MessageEmbed()
      .setDescription(`Poll: **${args.join(" ")}**`)
      .setColor('RED')
    return interaction.channel.send({ embeds: [poll] }).then(ownMessage => {
      ownMessage.react(thumbsUp)
      ownMessage.react(thumbsDown)
    })
  },
}
