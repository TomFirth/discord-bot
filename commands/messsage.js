const config = require("../config.json")

module.exports = {
  emoji: '🗒️',
  name: 'message',
  description: 'Send a custom message',
  execute(client, message) { 
    if (member.user.username !== config.discord.owner.name) {
      message.delete()
      const args = message.content.split(" ")
      const destination = args[1]
      args.splice(0, 2)
      const send = args.join(" ")
      let channel = client.channels.cache.find(channel => channel.name === destination)
      channel.send(send)
    }
  },
}