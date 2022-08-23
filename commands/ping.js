const { EmbedBuilder } = require("discord.js")

module.exports = {
  emoji: '🏓',
  name: 'ping',
  aliases: ["ping", "pong"],
  description: 'Check that Barber\'s ok',
  execute(client, message) {  
    message.channel.send("\`🏓\` **- Getting my ping ...**").then(result_message => {
      const ping = result_message.createdTimestamp - message.createdTimestamp
      result_message.delete()
      const latencies = new EmbedBuilder()
        .setTitle(`'${client.user.username}' Latency Test`)
        .setColor("BLURPLE")
        .addField(`Ping`, `\`${ping} ms\``)
        .setTimestamp()
        message.channel.send({ embeds: [latencies]})
    })
  },
}