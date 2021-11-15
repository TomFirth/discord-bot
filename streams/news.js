const { MessageEmbed } = require('discord.js')
const parse = require('feed-reader').parse
const firebase = require('firebase-admin')
const config = require('../config')

const db = firebase.firestore()

class NewsFeed {
  static start(client) {
    const newsDocId = 'tc64DI4XqbngplOEm3hO'
    parse(config.streams.news).then(async result => {
      const query = await db.collection('news').doc(newsDocId).get()
      const doc = result.entries[0]
      if(query.data().published !== doc.publishedDate
      && query.data().title !== doc.title) {
        const news = new MessageEmbed()
          .setTitle(doc.title)
          .setDescription(doc.contentSnippet)
          .setURL(doc.link)
          .setColor('RED')
        let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.news)
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
  }
}

module.exports = NewsFeed