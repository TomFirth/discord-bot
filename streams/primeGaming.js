const { EmbedBuilder } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const config = require("../config.json")
const utilities = require("../scripts/utilities")

class Rss {
  static async start(client, db) {
    const query = await db.collection("rss").doc("el1ws1cWaXGuYkeCCHoZ").get()
    const feeds = await parser.parseURL("https://primegaming.blog/feed")
    const item = feeds.items[0]
    if (query.data().publishedDate !== item.pubDate
      || query.data().title !== item.title) {
      const feedEmbed = new EmbedBuilder()
      .setColor(utilities.randomColour())
      .setTitle(item.title)
      .setURL(item.link)
      .setAuthor({ name: "Prime Gaming" })
      .setDescription(`${item.content.substring(0, 180)}...`)
      .setTimestamp()
      let channel = await client.channels.cache.find(channel => channel.name === config.discord.channels.free)
      channel.send({ embeds: [feedEmbed] }).then(ownMessage => {
        if (feed.poll) {
          ownMessage.react(config.discord.emojis.thumbsUp)
          ownMessage.react(config.discord.emojis.thumbsDown)
        }
      })
      db.collection("rss").doc("el1ws1cWaXGuYkeCCHoZ").set({
        description: description,
        link: item.link,
        publishedDate: item.pubDate,
        title: item.title
      }, {merge: true})
    }
  }
}

module.exports = Rss