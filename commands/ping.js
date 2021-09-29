const { MessageEmbed } = require('discord.js')

module.exports = {
  emoji: '🏓', //OPTIONAL
  name: 'ping',
  description: 'Check that Barber\'s ok', //OPTIONAL
  execute(client, interaction) {  
    interaction.channel.send('\`🏓\` **- Getting my ping ...**').then(result_message => {
      const ping = result_message.createdTimestamp - interaction.createdTimestamp
      result_message.delete()
      const latencies = new MessageEmbed()
        .setTitle(`'${client.user.username}' Latency Test`)
        .setColor('BLURPLE')
        .addField(`Ping`, `\`${ping} ms\``)
        .setTimestamp()
        interaction.channel.send({ embeds: [latencies]})
    })
  },
}