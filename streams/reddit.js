const { getSubredditName } = require("fetch-subreddit")
const https = require("https")

class Reddit {
  static start(client, reddit, db) {
    const url = new URL("https://www.reddit.com/r/" + reddit.subreddit + "/top.json?t=" + reddit.frequency)
    const min = 82800000 // 23hrs
    const max = 90000000 // 25hrs
    const timeout = Math.random() * (max - min) + min
    setTimeout(() => {
      getReddit()
    }, timeout)
    (getReddit = () => {
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
            let channel = client.channels.cache.find(channel => channel.name === reddit.destination)
            channel.send(`${reddit.nsfw} ${releases.data.children[0].data.url_overridden_by_dest} ${reddit.nsfw}`).then(ownMessage => {
              if (feed.poll) {
                ownMessage.react(config.discord.emojis.thumbsUp)
                ownMessage.react(config.discord.emojis.thumbsDown)
              }
            })
            db.collection("reddit").doc(reddit.docId).set({
              title: releases.data.children[0].data.title
            }, {merge: true})
          }
        })
        stream.on("error", (error) => {
          return console.error(error)
        })
      })
    })()
  }
}

module.exports = Reddit