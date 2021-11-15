const { MessageEmbed } = require('discord.js')
const cron = require('cron')
const https = require("https")
const parseString = require("xml2js").parseString
const firebase = require('firebase-admin')
const config = require('../config')

const db = firebase.firestore()

class FreeFeed {
  static start(client) {
    const newsDocId = 'tc64DI4XqbngplOEm3hO'
    let scheduledMessage = new cron.CronJob(`00 * * * * *`, async () => {
      https.get(config.streams.news, res => {
        const chunks = []
        res
          .on("data", data => chunks.push(data))
          .on("end", () => {
            const buffer = Buffer.concat(chunks)
            const rss = buffer.toString()
            parseString(rss, async (err, result) => {
              const query = await db.collection('news').doc(newsDocId).get()
              const doc = result.feed.entry[0]
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
            })
          })
      })
    })
    scheduledMessage.start()
  }
}

module.exports = FreeFeed