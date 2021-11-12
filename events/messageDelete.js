const config = require('../config.json')

module.exports = async (client, message) => {
  const entry = await message.guild.fetchAuditLogs({ type: "MESSAGE_DELETE" }).then(audit => audit.entries.first())
  const channel = client.channels.cache.find(channel => channel.name === config.discord.channels.audit)
  channel.send(`${entry.action}: ${message.content} - by ${entry.executor} from ${entry.extra.channel}`)
}