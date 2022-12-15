const config = require("../config.json")
const utilities = require("../scripts/utilities")

module.exports = async (client, message) => {
  utilities.channel(client, config.discord.channels.bot, `ERROR: ${message.content}`)
}