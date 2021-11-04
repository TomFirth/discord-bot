const config = require('../config.json')

module.exports = (client, message) => {
  client.on('ready', async () => {
    try {
      const channel = client.channels.get(config.discord.channels.general)
      if (!channel) return console.error('Invalid ID or missing channel.')
      if(message.member.roles.find(role => role.name === "Special")) {
        if(Math.floor(Math.random() * 10) == 0) await message.react('⭐')
      }
    } catch(err) {
      console.error(err)
    }
  })
}