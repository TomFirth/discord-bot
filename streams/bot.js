const config = require("../config.json")

class BotCheck {
  static start(client) {
    try {
      client.on("channelCreate", info => {
        channel.send("Channel created:", info)
      })
      client.on("channelDelete", info => {
        channel.send("Channel deleted:", info)
      })
      client.on("messageDelete", async message => {
        const channel = await client.channels.cache.find(channel => channel.name === config.discord.channels.audit)
        console.log("channel", channel)
        channel.send("Message deleted: ", message)
      })
      client.on("messageUpdate", (oldMessage, newMessage) => {
        channel.send("Message edited from", oldMessage, "to new", newMessage)
      })
      client.on("userUpdate", (oldUser, newUser) => {
        channel.send("User update", oldUser, "to", newUser)
      })
      client.on("warn", info => {
        channel.send("Warning:", info)
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = BotCheck