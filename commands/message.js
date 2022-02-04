const utilities = require("../scripts/utilities.js")
const config = require("../config.json")

module.exports = {
  emoji: '🗒️',
  name: 'message',
  description: 'Send a custom message',
  execute(client, message) {
    message.delete()
    if (message.member.id === config.discord.owner.id) {
      const args = message.content.split(" ")
      const destination = args[1]
      args.splice(0, 2)
      const send = args.join(" ")
      utilities.channel(client, destination, send)
    }
  },
}