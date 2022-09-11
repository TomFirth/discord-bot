const { EmbedBuilder } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const colours = require("../../colours")
const config = require("../../config.json")

class YoutubeFeed {
  static async start(client, db, user) {
    const query = await db.collection("youtube").doc(user.docId).get()
    const feeds = await parser.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${user.id}`)
    const item = feeds.items[0]
    if (item == undefined) return
    if (query.data().publishedDate !== item.pubDate
      || query.data().title !== item.title) {
      let description = ""
      if (item.content || item.contentSnippet) {
        description = item.content || item.contentSnippet || item.description || ""
        description.replace(/<\/?[^>]+(>|$)/g, "")
      }
      const embed = new EmbedBuilder()
        .setColor(colours.red)
        .setTitle(item.title)
        .setURL(item.link)
        .setAuthor({ name: feed.author })
        .setTimestamp()
      await client.channels.fetch(config.discord.channels.socials)
        .then(channel => {
          channel.send({ embeds: [embed] })
        })
      db.collection("youtube").doc(user.docId).set({
        publishedDate: item.pubDate,
        title: item.title
      }, {merge: true})
    }
  }
}

module.exports = YoutubeFeed