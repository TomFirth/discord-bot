const { MessageEmbed } = require("discord.js")
const Parser = require("rss-parser")
const parser = new Parser()
const config = require("../config.json")

class Rss {
  static start(client, feed, db) {
    parser.parseURL(feed.url).then(async results => {
      const query = await db.collection("rss").doc(feed.docId).get()
      const latest = results[0]
      console.log("latest", latest)
      if (query.data().publishedDate !== latest.publishedDate
        && query.data().title == undefined
        || query.data().title !== latest.title) {
        let description = ""
        if (feed.contentSnippet !== "") {
          description = latest.contentSnippet.replace(/<.*>/, '')
        } else {
          console.log("rss - no contentSnippet", latest) // 
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