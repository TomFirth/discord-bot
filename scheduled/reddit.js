const cron = require('cron')
const https = require("https")
const { MessageEmbed } = require('discord.js')

class Reddit {
  static start(client, reddit) {
    const url = new URL("https://www.reddit.com/r/" + reddit.subreddit + "/hot.json")
    https.get({
      hostname: url.hostname,
      path: url.pathname,
      headers: {'User-Agent': 'agent'}
    }, async response => {
      let str = ''
      response.on('data', data => {
        str += data
      })
      response.on('end', async () => {
        const query = await db.collection('reddit').doc(reddit.docId).get()
        if(query.data().title !== doc.title) {
          const releases = JSON.parse(str)
          const channel = client.channels.cache.find(channel => channel.name === reddit.destination)
          const post = new MessageEmbed()
            .setTitle(releases.data.children.data.title)
            .setAuthor(reddit.author)
            .setImage(releases.data.children.data.preview.images[0].url)
            .setColor('#FF5700')
          channel.send({ embeds: [post] })
          db.collection('reddit').doc(reddit.docId).set({
            title: releases.data.children.data.title
          }, {merge: true})
        }
      })
    })
  }
}

module.exports = Reddit