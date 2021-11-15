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
      if(query.data().published !== doc.published[0]
      && query.data().title !== doc.title[0]) {
        let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.news)
        const news = new MessageEmbed()
          .setTitle(doc.title[0])
          .setURL(doc.link[0].$.href)
          .setColor('RED')
        channel.send({ embeds: [news] })
        db.collection('news').doc(newsDocId).update({
          link: doc.link[0].$.href,
          published: doc.published[0],
          title: doc.title[0]
        })
      }
    }).catch(error => {
      console.log(error)
    }).finally(() => {})
  }
}

module.exports = NewsFeed