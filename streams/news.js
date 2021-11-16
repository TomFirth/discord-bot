const { MessageEmbed } = require('discord.js')
const cron = require('cron')
const parse = require('feed-reader').parse
const firebase = require('firebase-admin')
const config = require('../config')

const db = firebase.firestore()

class NewsFeed {
  static start(client) {
    let scheduledMessage = new cron.CronJob('00 */15 * * * *', () => {
      const newsDocId = 'tc64DI4XqbngplOEm3hO'
      parse(config.streams.news).then(async result => {
        const query = await db.collection('news').doc(newsDocId).get()
        const doc = result.entries[0]
        console.log("doc", doc)
        if(query.data().published !== doc.publishedDate
        && query.data().title !== doc.title) {
          const news = new MessageEmbed()
            .setTitle(doc.title)
            .setDescription(doc.contentSnippet)
            .setURL(doc.link)
            .setColor('RED')
          let channel = await client.channels.cache.find(channel => channel.name === config.discord.channels.news)
          channel.send({ embeds: [news] })
          db.collection('news').doc(newsDocId).update({
            description: doc.contentSnippet,
            link: doc.link,
            published: doc.publishedDate,
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

module.exports = NewsFeed