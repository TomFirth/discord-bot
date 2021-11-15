const { MessageEmbed } = require('discord.js')
const cron = require('cron')
const https = require("https")
const parseString = require("xml2js").parseString
const firebase = require('firebase-admin')
const config = require('../config')

const db = firebase.firestore()

class FreeFeed {
  static start(client) {
    const freeGameDocId = 'agEt3DFhkDVt0O71Nf7x'
    let scheduledMessage = new cron.CronJob(`00 00 * * * *`, async () => {
      https.get(config.streams.free, res => {
        const chunks = []
        res
          .on("data", data => chunks.push(data))
          .on("end", () => {
            const buffer = Buffer.concat(chunks)
            const rss = buffer.toString()
            parseString(rss, async (err, result) => {
              const query = await db.collection('freeGame').doc(freeGameDocId).get()
              const doc = result.rss.channel[0].item[0]
              if(query.data().pubDate !== doc.pubDate[0]
              && query.data().title !== doc.title[0]) {
                let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.freeGames)
                const description = doc.description[0].replace(/<.*>/, '')
                const freeGame = new MessageEmbed()
                  .setTitle(doc.title[0])
                  .setURL(doc.link[0])
                  .setDescription(description)
                  .setColor('BLUE')
                channel.send({ embeds: [freeGame] })
                db.collection('freeGame').doc(freeGameDocId).update({
                  description: description,
                  link: doc.link[0],
                  pubDate: doc.pubDate[0],
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