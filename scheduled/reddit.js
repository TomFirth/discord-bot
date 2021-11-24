const cron = require('cron')
const https = require("https")

class Reddit {
  static start(client, reddit, db) {
    const url = new URL("https://www.reddit.com/r/" + reddit.subreddit + "/top.json?t=today")
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
        const releases = JSON.parse(str)
        const date = new Date()
        let hour = date.getHours()
        if(query.data() !== undefined
        && releases.data.children[0].data.url_overridden_by_dest !== undefined
        && query.data().title !== releases.data.children[0].data.title) {
          // if (reddit.nsfw && (hour < 20 || hour !== 0)) return false
          const channel = client.channels.cache.find(channel => channel.name === reddit.destination)
          channel.send(releases.data.children[0].data.url_overridden_by_dest)
          db.collection('reddit').doc(reddit.docId).set({
            title: releases.data.children[0].data.title
          }, {merge: true})
        }
      })
      response.on('error',  (error) => {
        const channel = client.channels.cache.find(channel => channel.name === "bot")
        channel.send(error)
      })
    })
  }
}

module.exports = Reddit