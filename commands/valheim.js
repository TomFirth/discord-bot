module.exports = {
  emoji: '📯',
  name: 'valheim',
  description: 'Start Valheim server',
  async execute(client, message) {
    // start valheim server
    utilities.channel(client, config.discord.channels.bot, `.voice Valheim`)
    // announce when server is up (create joinable link?)
    // post ip address
  }
}
