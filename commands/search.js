const google = require("google-it")

module.exports = {
  emoji: '🔎',
  name: 'search',
  aliases: ["search", "google", "find"],
  description: 'Search Google',
  execute(client, message, args) {
    if (!args.length) return message.reply(`**What do you want to search for?**`)

    google({'query': args.join(" ")}).then(results => {
      console.log(results) // remove
      return message.channel.send(`${results[0].link || "0 results"}`)
    })
  },
}
