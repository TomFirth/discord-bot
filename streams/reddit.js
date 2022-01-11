const axios = require("axios")
const config = require("../config.json")

class Reddit {
  static start(client, reddit, db) {
    let scheduledMessage = new cron.CronJob("* * * * * */1", () => {
      const url = new URL("https://www.reddit.com/r/" + reddit.subreddit + "/top.json?t=" + reddit.frequency)
      axios.get(url.hostname + url.pathname)
        .then(async response => {
          const query = await db.collection("reddit").doc(reddit.docId).get()
          const releases = JSON.parse(response)
          if (query.data() !== undefined
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
        .catch(error => {
          console.error(error)
        })
        // .then(() => {})
    })
    scheduledMessage.start()
  }
}

module.exports = Reddit