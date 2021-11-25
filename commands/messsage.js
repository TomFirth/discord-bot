const config = require("../config.json")

module.exports = {
  emoji: '🗒️',
  name: 'message',
  description: 'Send a custom message',
  execute(client, message) {
    console.log("message.member", message.member)
    console.log("message.member.id", message.member.id)
    if (message.member.id !== config.discord.owner.id) {
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