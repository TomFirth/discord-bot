module.exports = {
  emoji: '🗒️',
  name: 'message',
  description: 'Send a custom message',
  execute(client, message) {
    if (message.member.roles.cache.some(role => role.hasPermission('Administrator'))) {
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