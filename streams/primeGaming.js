const { EmbedBuilder } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const config = require("../config/config.json")
const utilities = require("../scripts/utilities")

class Rss {
  static async start(client, db) {
    const query = await db.collection("rss").doc("el1ws1cWaXGuYkeCCHoZ").get()
    const feeds = await parser.parseURL("https://primegaming.blog/feed")
    const item = feeds.items[0]
    if (query.data().publishedDate !== item.pubDate
      || query.data().title !== item.title
      && item.categories.includes("prime-gaming")) {
        const description = item['content:encoded'].substring(0, 180)
      const feedEmbed = new EmbedBuilder()
      .setColor(utilities.randomColour())
      .setTitle(item.title)
      .setURL(item.link)
      .addField("Prime Gaming Website", "[gaming.amazon.com](https://gaming.amazon.com/home)")
      .setAuthor({ name: "Prime Gaming" })
      .setDescription(`${description}...`)
      .setTimestamp()
      let channel = await client.channels.cache.find(channel => channel.name === config.discord.channels.free)
      channel.send({ embeds: [feedEmbed] }).then(ownMessage => {
        ownMessage.react(config.discord.emojis.thumbsUp)
        ownMessage.react(config.discord.emojis.thumbsDown)
      })
      db.collection("rss").doc("el1ws1cWaXGuYkeCCHoZ").set({
        description,
        link: item.link,
        publishedDate: item.pubDate,
        title: item.title
      }, {merge: true})
    }
  }
}

module.exports = Rss