const { MessageEmbed } = require("discord.js")
const parse = require("feed-reader").parse
const utilities = require("../scripts/utilities.js")
const config = require("../config.json")

class Rss {
  static start(client, feed, db) {
    parse(feed.url).then(async result => {
      const query = await db.collection("rss").doc(feed.docId).get()
      const doc = result.entries[0]
      if (query.data().publishedDate !== doc.publishedDate
      && query.data().title == undefined
      || query.data().title !== doc.title) {
        const description = doc.contentSnippet.replace(/<.*>/, '')
        const feedEmbed = new MessageEmbed()
          .setTitle(doc.title)
          .setURL(doc.link)
          .setAuthor(feed.author)
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
    }).catch(error => {
      console.error(error)
    }).finally(() => {})
  }
}

module.exports = Rss