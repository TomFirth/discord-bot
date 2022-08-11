const { MessageEmbed } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const config = require("../config.json")

class Rss {
  static start(client, feed, db) {
    (async () => {
      const query = await db.collection("rss").doc(feed.docId).get()
      const feed = parser.parseURL(feed.url)
      feed.items.forEach(async (item) => {
        console.log("item", item)
        if (query.data().publishedDate !== item.publishedDate
          || query.data().title !== item.title) {
          let description = ""
          if (feed.contentSnippet !== "") {
            description = item.contentSnippet.replace(/<.*>/, '')
          } else {
            console.log("rss - no contentSnippet", item) // 
          }
          if (config.ignore.some(element => description.includes(element))) {
            return // don't post these
          } else if(config.kindOfIgnore.some(element => description.includes(element)) && Math.random() * 3 == 0) {
            return // random chance to post these
          }
          const feedEmbed = new MessageEmbed()
            .setTitle(doc.title)
            .setURL(doc.link)
            .setAuthor({ name: feed.author })
            .setDescription(description)
            .setColor(feed.colour)
            .setTimestamp()
          let channel = await client.channels.cache.find(channel => channel.name === feed.destination)
          channel.send({ embeds: [feedEmbed] }).then(ownMessage => {
            if (feed.poll) {
              ownMessage.react(config.discord.emojis.thumbsUp)
              ownMessage.react(config.discord.emojis.thumbsDown)
            }
          })
          db.collection("rss").doc(feed.docId).set({
            description: description,
            link: doc.link,
            publishedDate: doc.publishedDate,
            title: doc.title
          }, {merge: true})
        }
      })
    })
  }
}

module.exports = Rss