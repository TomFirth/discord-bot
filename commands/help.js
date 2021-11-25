const { MessageEmbed } = require('discord.js')

module.exports = {
  emoji: '📝',
  name: 'help',
  description: 'A list of my commands!',
  execute(client, message) {
    const exclusions = ["help", "ping", "server", "uptime"]
    const help_embed = new MessageEmbed()
      .setTitle(`${client.user.username}'s Commands`)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor('GREEN')
      .setDescription(client.botCommands.map(command => {
        if (!exclusions.includes(command.name)) {
          return `\`${command.emoji || '✔️'}\` \`.${command.name}\` - *${command.description || `No description available.`}*`
        } else return null
      }).join(''))
    return message.channel.send({ embeds: [help_embed] })
  },
}