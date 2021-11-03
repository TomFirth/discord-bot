module.exports = (client, message) => {
  if (message.content == "Hello" && Math.floor(Math.random() * 3) == 0) {
    message.channel.send("Lmao")
  }
}