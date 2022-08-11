const { MessageEmbed } = require("discord.js")
const parse = require("feed-reader").parse
const config = require("../config.json")

class Rss {
  static start(client, feed, db) {
    parse(feed.url).then(async result => {
      const query = await db.collection("rss").doc(feed.docId).get()
      const doc = result.entries[0]
      if (query.data().publishedDate !== doc.publishedDate
        && query.data().title == undefined
        || query.data().title !== doc.title) {
        let description = ""
        if (doc.contentSnippet !== "") {
          description = doc.contentSnippet.replace(/<.*>/, '')
        } else {
          console.log("rss - no contentSnippet", doc) // 
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
    }).catch(error => {
      console.error(error)
    }).finally(() => {})
  }
}

module.exports = Rss