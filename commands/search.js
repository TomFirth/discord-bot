const { MessageEmbed } = require('discord.js')
const google = require('google-it')

module.exports = {
  emoji: '🔎',
  name: 'google',
  description: 'Search Google',
  execute(client, interaction, args) {
    if(!args.length) return interaction.reply(`**What do you want to search for?**`)
    const search = new MessageEmbed()
      .setTitle("Google's top result:")
      .setColor('YELLOW')

    google({'query': args.join(' ')}).then(results => {
      results.forEach(function(item, index) { 
        embed.addField((index + 1) + ": " + item.title, "<" + item.link + ">");
      })
    })
    return interaction.channel.send({ embeds: [search] })
  },
}
