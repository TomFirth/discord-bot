const https = require("https")
const config = require("../config.json")

class Reddit {
  static start(client, reddit, db) {
    const url = new URL("https://www.reddit.com/r/" + reddit.subreddit + "/top.json?t=" + reddit.frequency)
    const getReddit = () => {
      https.get({
        hostname: url.hostname,
        path: url.pathname,
        headers: {'User-Agent': 'agent'}
      }, async stream => {
        let str = ''
        stream.on("data", data => {
          str += data
        })
        stream.on("end", async () => {
          const query = await db.collection("reddit").doc(reddit.docId).get()
          const releases = JSON.parse(str)
          if(query.data() !== undefined
            && releases.data.children[0].data.url_overridden_by_dest !== undefined
            && query.data().title !== releases.data.children[0].data.title) {
            const channel = await client.channels.cache.find(channel => channel.name === reddit.destination)
            try {
              channel.send(`${reddit.nsfw} ${releases.data.children[0].data.url_overridden_by_dest} ${reddit.nsfw}`).then(ownMessage => {
                if (reddit.poll) {
                  ownMessage.react(config.discord.emojis.thumbsUp)
                  ownMessage.react(config.discord.emojis.thumbsDown)
                }
              })
              db.collection("reddit").doc(reddit.docId).set({
                title: releases.data.children[0].data.title
              }, {merge: true})
            } catch(error) {
              console.error("channel error", error, reddit)
            }
          }
        })
        stream.on("error", (error) => {
          return console.error(error)
        })
      })
    }
    const min = 82800000 // 23hrs
    const max = 90000000 // 25hrs
    const timeout = Math.random() * (max - min) + min
    while (true) {
      setTimeout(() => {
        getReddit()
      }, timeout)
      getReddit()
    }
  }
}

module.exports = Reddit