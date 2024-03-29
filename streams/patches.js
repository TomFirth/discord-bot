const { EmbedBuilder } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const utilities = require("../scripts/utilities")

class Patches {
  static async start(client, feed, db) {
    try {
      const query = await db.collection("patches").doc(feed.docId).get()
      let feeds = await parser.parseURL(feed.url)
      const item = feeds.items[0]
      if (query.data().publishedDate !== item.pubDate
        || query.data().title !== item.title) {
        let description = ""
        if (item.content || item.contentSnippet) {
          description = item.contentSnippet || item.content || item.description || ""
          description = description.replace(/<\/?[^>]+(>|$)/gi, "")
        }
        if (item.title.includes("patch") || item.title.includes("release") || item.title.includes("update")) {
          let feedEmbed
          feedEmbed = new EmbedBuilder()
          .setColor(utilities.randomColour())
          .setTitle(item.title)
          .setURL(item.link)
          .setDescription(`${description.substring(0, 180)}...`)
          .setTimestamp()
          await client.channels.fetch(config.discord.channels.bot)
            .then(channel => {
              channel.send({ embeds: [errorEmbed] }).catch(console.error)
            })
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
    } catch (error) {
      console.error(error)
    }
  }
}

module.exports = Patches