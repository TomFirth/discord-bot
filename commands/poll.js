const { MessageEmbed } = require('discord.js')
const config = require('../config.json')

module.exports = {
  emoji: '👍',
  name: 'poll',
  description: 'Poll to decide on things!',
  execute(client, message, args) {
    if (!args.length) return message.reply(`**Please add a question.**`)
    const newEmojis = message.content.match(/\d+/g) || []
    const poll = new MessageEmbed()
      .setDescription(`Poll: **${args.join(" ")}**`)
      .setColor('RED')
    return message.channel.send({ embeds: [poll] }).then(ownMessage => {
      if (newEmojis.length > 0) {
        newEmojis.forEach(emoji => {
          ownMessage.react(client.emojis.get(emoji))
        })
      } else {
        ownMessage.react(config.discord.emojis.thumbsUp)
        ownMessage.react(config.discord.emojis.thumbsDown)
      }
    }).then(ownMessage => {
      // Poll results
      let votes = {
        up: "",
        down: ""
      }
      const thumbsUp = reaction => reaction.emoji.name === config.discord.emojis.thumbsUp
      const voteUp = ownMessage.createReactionCollector(thumbsUp, { time: 15000 })
      voteUp.on('collect', r => { console.log(r) })
      voteUp.on('end', collected => {
        votes.up = collected.size
      })
      
      const thumbsDown = reaction => reaction.emoji.name === config.discord.emojis.thumbsDown
      const voteDown = ownMessage.createReactionCollector(thumbsDown, { time: 15000 })
      voteDown.on('collect', r => { console.log(r) })
      voteDown.on('end', collected => {
        votes.down = collected.size
      })
      if (voteDown.up > 0 && votes.down > 0 && voteDown.up > votes.down) {
        return message.channel.send(`YES wins with ${votes.up} to ${votes.down}!`)
      } else if (voteDown.up > 0 && votes.down > 0 && voteDown.up < votes.down) {
        return message.channel.send(`NO wins with ${votes.down} to ${votes.up}!`)
      }
    })
  },
}

// detect emojis
// if they exist, use them as poll reactions instead of thumb up / thumb down
// defaults to thumbs

// after time give result of poll
