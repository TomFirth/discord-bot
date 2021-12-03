const { MessageEmbed } = require('discord.js')

module.exports = {
  emoji: '📝',
  name: 'help',
  description: 'A list of my commands!',
  execute(client, message) {
    const exclusions = ["help", "ping", "server", "uptime", "message"]
    const help_embed = new MessageEmbed()
      .setTitle(`${client.user.username}'s Commands`)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor('GREEN')
      .setDescription(client.botCommands.filter(command => { return !exclusions.includes(command.name) }).map(command => {
        return `\`${command.emoji || '✔️'}\` \`.${command.name}\` - *${command.description || `No description available.`}*`
      }).join(`\n`))
    return message.channel.send({ embeds: [help_embed] })
  },
}