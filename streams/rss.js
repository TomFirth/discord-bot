const { MessageEmbed } = require('discord.js')
const cron = require('cron')
const parse = require('feed-reader').parse
const firebase = require('firebase-admin')
const config = require('../config')

const db = firebase.firestore()

class Rss {
  static start(client, feed) {
    let scheduledMessage = new cron.CronJob('00 */15 * * * *', () => {
      parse(feed.url).then(async result => {
        const query = await db.collection(feed.db).doc(feed.docId).get()
        const doc = result.entries[0]
        if(query.data().pubDate !== doc.publishedDate
        && query.data().title !== doc.title) {
          const description = doc.contentSnippet.replace(/<.*>/, '')
          const feedEmbed = new MessageEmbed()
            .setTitle(doc.title)
            .setURL(doc.link)
            .setAuthor(feed.author)
            .setDescription(description)
            .setColor('BLUE')
          let channel = await client.channels.cache.find(channel => channel.name === feed.destination)
          channel.send({ embeds: [feedEmbed] })
          db.collection(feed.db).doc(feed.docId).update({
            description: description,
            link: doc.link,
            pubDate: doc.publishedDate,
            title: doc.title
          })
        }
      }).catch(error => {
        console.log(error)
      }).finally(() => {})
    })
    scheduledMessage.start()
  }
}

module.exports = Rss