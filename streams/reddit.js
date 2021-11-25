const https = require("https")

class Reddit {
  static start(client, reddit, db) {
    const url = new URL("https://www.reddit.com/r/" + reddit.subreddit + "/top.json?t=" + reddit.frequency)
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
        if(query.data() !== undefined
        && releases.data.children[0].data.url_overridden_by_dest !== undefined
        && query.data().title !== releases.data.children[0].data.title) {
          let channel = client.channels.cache.find(channel => channel.name === reddit.destination)
          console.log("channel", channel)
          channel.send(`${reddit.nsfw} ${releases.data.children[0].data.url_overridden_by_dest} ${reddit.nsfw}`)
          db.collection('reddit').doc(reddit.docId).set({
            title: releases.data.children[0].data.title
          }, {merge: true})
        }
      })
      response.on('error',  (error) => {
        console.log("error")
      })
    })
  }
}

module.exports = Reddit