const { EmbedBuilder } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const config = require("../config.json")

class Rss {
  static async start(client, feed, db) {
    console.log("hi", feed.author)
    const query = await db.collection("rss").doc(feed.docId).get()
    const feeds = await parser.parseURL(feed.url)
    const item = feeds.items[0]
    if (query.data().publishedDate !== item.pubDate
      || query.data().title !== item.title) {
      let description = ""
      if (item.contentSnippet !== "") {
        description = item.contentSnippet.replace(/<.*>/, '')
      }
      if (!config.kindOfIgnore.some(element => description.includes(element)) && Math.random() * 2 !== 0) {
        const feedEmbed = new EmbedBuilder()
        .setTitle(item.title)
        .setURL(item.link)
        .setAuthor({ name: feed.author })
        .setDescription(description)
        .setColor(feed.colour)
        .setTimestamp()
        let channel = await client.channels.cache.find(channel => channel.name === feed.destination)
        console.log("5")
        channel.send({ embeds: [feedEmbed] }).then(ownMessage => {
          if (feed.poll) {
            ownMessage.react(config.discord.emojis.thumbsUp)
            ownMessage.react(config.discord.emojis.thumbsDown)
          }
        })
        console.log("6")
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