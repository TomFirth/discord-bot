const { MessageEmbed } = require('discord.js')
const config = require('../config')

module.exports = {
  emoji: '📝', //OPTIONAL
  name: 'help',
  description: 'A list of my commands!', //OPTIONAL
  execute(client, interaction) {
    const help_embed = new MessageEmbed()
      .setTitle(`${client.user.username}'s Commands`)
      .setThumbnail(client.user.displayAvatarURL())
      .setColor('GREEN')
      .setDescription(`${client.botCommands.map(command => `\`${command.emoji || '✔️'}\` \`.${command.name}\` - *${command.description || `No description available.`}*`).join(`\n`)}`)
    return interaction.channel.send({ embeds: [help_embed] })
  },
}