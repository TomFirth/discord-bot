const { EmbedBuilder } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const config = require("../config.json")

class Rss {
  static async start(client, feed, db) {
    const query = await db.collection("rss").doc(feed.docId).get()
    const feeds = await parser.parseURL(feed.url)
    const item = feeds.items[0]
    if (query.data().publishedDate !== item.pubDate
      || query.data().title !== item.title) {
      let description = ""
        if (item.content || item.contentSnippet) {
          description = item.content || item.contentSnippet || ""
          description.replace(/<.*>/, '')
        }
      if (!config.kindOfIgnore.some(element => description.includes(element)) && Math.random() * 2 !== 0) {
        let feedEmbed
        if (feed.author) {
          feedEmbed = new EmbedBuilder()
          .setColor(feed.colour)
          .setTitle(item.title)
          .setURL(item.link)
          .setAuthor({ name: feed.author })
          .setImage(item.enclosure.url)
          .setTimestamp()
        } else {
          feedEmbed = new EmbedBuilder()
          .setColor(feed.colour)
          .setTitle(item.title)
          .setURL(item.link)
          .setAuthor({ name: feed.author })
          .setDescription(`${description.substring(0, 180)}...`)
          .setTimestamp()
        }
        
        let channel = await client.channels.cache.find(channel => channel.name === feed.destination)
        channel.send({ embeds: [feedEmbed] }).then(ownMessage => {
          if (feed.poll) {
            ownMessage.react(config.discord.emojis.thumbsUp)
            ownMessage.react(config.discord.emojis.thumbsDown)
          }
        })
        db.collection("rss").doc(feed.docId).set({
          description: description,
          link: item.link,
          publishedDate: item.pubDate,
          title: item.title
        }, {merge: true})
      }
    }
  }
}

module.exports = Rss