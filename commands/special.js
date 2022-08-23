const utilities = require("../scripts/utilities")
const config = require("../config.json")

module.exports = {
  emoji: '⭐',
  name: 'special',
  description: 'Add special role',
  execute(client, message) {
    if (message.member.id === config.discord.owner.id) {
      const args = message.content.split(" ")
      const user = args[1]
      utilities.special(client, user)
    }
  },
}