const { MessageEmbed } = require('discord.js')
const google = require('google-it')

module.exports = {
  emoji: '🔎',
  name: 'google',
  description: 'Search Google',
  execute(client, interaction, args) {
    if(!args.length) return interaction.reply(`**What do you want to search for?**`)

    google({'query': args.join(' ')}).then(results => {
      results.forEach((item, index) => { 
        return interaction.channel.send(item.title, item.link)
      })
    })
  },
}
