const { EmbedBuilder } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const config = require("../config.json")
const utilities = require("../scripts/utilities")

class primeGaming {
  static async start(client, db) {
    const query = await db.collection("rss").doc("el1ws1cWaXGuYkeCCHoZ").get()
    const feeds = await parser.parseURL("https://primegaming.blog/feed")
    const item = feeds.items[0]
    if (query.data().publishedDate !== item.pubDate
      || query.data().title !== item.title
      && item.categories.includes("prime-gaming")) {
      const feedEmbed = new EmbedBuilder()
      .setColor(utilities.randomColour())
      .setTitle(item.title)
      .setURL(item.link)
      .addFields({ name: "Prime Gaming Website", value: "[gaming.amazon.com](https://gaming.amazon.com/home)", inline: true })
      .setAuthor({ name: "Prime Gaming" })
      .setTimestamp()
      await client.channels.fetch("909843508431552583")
        .then(channel => {
          channel.send({ embeds: [feedEmbed] }).then(ownMessage => {
            ownMessage.react(config.discord.emojis.thumbsUp)
            ownMessage.react(config.discord.emojis.thumbsDown)
          })
        })
      db.collection("rss").doc("el1ws1cWaXGuYkeCCHoZ").set({
        link: item.link,
        publishedDate: item.pubDate,
        title: item.title
      }, {merge: true})
    }
  }
}

module.exports = primeGaming