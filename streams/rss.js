const { EmbedBuilder } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const config = require("../config.json")

class Rss {
  static async start(client, feed, db) {
    try {
      const query = await db.collection("rss").doc(feed.docId).get()
      const feeds = await parser.parseURL(feed.url)
      const item = feeds.items[0]
      if (query.data().title !== item.title) {
        let description = ""
        if (item.contentSnippet || item.content) {
          description = item.contentSnippet || item.content || ""
          description = description.replace(/<\/?[^>]+(>|$)/gi, "")
        }
        if (!config.kindOfIgnore.some(element => item.title.includes(element)) && Math.random() * 2 !== 0) {
          let feedEmbed
          if (feed.author == "NASA") {
            feedEmbed = new EmbedBuilder()
            .setColor(feed.colour)
            .setTitle(item.title)
            .setURL(item.link)
            .setAuthor({ name: feed.author })
            .setImage(item.enclosure.url)
          } else {
            feedEmbed = new EmbedBuilder()
            .setColor(feed.colour)
            .setTitle(item.title)
            .setURL(item.link)
            .setAuthor({ name: feed.author })
            .setDescription(`${description.substring(0, 180)}...`)
          }
          
          let channel = await client.channels.cache.find(channel => channel.name === feed.destination)
          channel.send({ embeds: [feedEmbed] }).then(ownMessage => {
            if (feed.poll) {
              ownMessage.react(config.discord.emojis.thumbsUp)
              ownMessage.react(config.discord.emojis.thumbsDown)
            }
          }).catch(console.error)
          db.collection("rss").doc(feed.docId).set({
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

module.exports = Rss