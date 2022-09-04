const config = require("../config.json")

module.exports = async (client, message) => {
  const channel = client.channels.cache.find(channel => channel.name === config.discord.channels.bot)
  (`WARNING: ${message.content}`)
}