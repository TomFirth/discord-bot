const { EmbedBuilder } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const utilities = require("../scripts/utilities")

class Patches {
  static async start(client, feed, db) {
    const query = await db.collection("rss").doc(feed.docId).get()
    let feeds = await parser.parseURL(feed.url)
    const item = feeds.items[0]
    if (query.data().publishedDate !== item.pubDate
      || query.data().title !== item.title) {
      let description = ""
      if (item.content || item.contentSnippet) {
        description = item.content || item.contentSnippet || item.description || ""
        description.replace(/<\/?[^>]+(>|$)/g, "")
      }
      if (item.title.includes("patch") || item.title.includes("release") || item.title.includes("update")) {
        let feedEmbed
        feedEmbed = new EmbedBuilder()
        .setColor(utilities.randomColour())
        .setTitle(item.title)
        .setURL(item.link)
        .setDescription(`${description.substring(0, 180)}...`)
        .setTimestamp()
      let channel = await client.channels.cache.find(channel => channel.name === feed)
      channel.send({ embeds: [feedEmbed] })
      db.collection("patches").doc(feed.docId).set({
        description: description,
        link: item.link,
        publishedDate: item.pubDate,
        title: item.title
      }, {merge: true})
      }
    }
  }
}

module.exports = Patches