const { MessageEmbed } = require('discord.js')
const parse = require('feed-reader').parse
const firebase = require('firebase-admin')
const config = require('../config')

const db = firebase.firestore()

class FreeFeed {
  static start(client) {
    const freeGameDocId = 'agEt3DFhkDVt0O71Nf7x'
    parse(config.streams.free).then(async result => {
      const query = await db.collection('freeGame').doc(freeGameDocId).get()
      const doc = result.entries[0]
      if(query.data().pubDate !== doc.publishedDate
      && query.data().title !== doc.title) {
        const description = doc.contentSnippet.replace(/<.*>/, '')
        const freeGame = new MessageEmbed()
          .setTitle(doc.title)
          .setURL(doc.link)
          .setDescription(description)
          .setColor('BLUE')
        let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.freeGames)
        channel.send({ embeds: [freeGame] })
        db.collection('freeGame').doc(freeGameDocId).update({
          description: description,
          link: doc.link,
          pubDate: doc.publishedDate,
          title: doc.title
        })
      }
    }).catch(error => {
      console.log(error)
    }).finally(() => {})
  }
}

module.exports = FreeFeed