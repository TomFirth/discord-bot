const config = require('../config.json')

module.exports = async (client, message) => {
  const channel = client.channels.cache.find(channel => channel.name === config.discord.channels.audit)
  channel.send(`WARNING: ${message.content}`)
}