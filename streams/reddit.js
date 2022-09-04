const https = require("https")
const config = require("../config/config.json")

class Reddit {
  static start(client, reddit, db) {
    const url = new URL("https://www.reddit.com/r/" + reddit.subreddit + "/top.json?t=" + reddit.frequency)
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
        // check safe for work hours
        const startTime = '19:00:00';
        const endTime = '23:59:00';
        const currentDate = new Date()   
        let startDate = new Date(currentDate.getTime())
        startDate.setHours(startTime.split(":")[0])
        let endDate = new Date(currentDate.getTime())
        endDate.setHours(endTime.split(":")[0])
        endDate.setMinutes(endTime.split(":")[1])
        const valid = startDate < currentDate && endDate > currentDate
        if (reddit.nsfw && !valid) {
          // Do nothing
        } else {
          const query = await db.collection("reddit").doc(reddit.docId).get()
          const releases = JSON.parse(str)
          if (query.data() !== undefined
            && releases.data.children[0].data.url_overridden_by_dest !== undefined
            && query.data().title !== releases.data.children[0].data.title) {
              try {
                await client.channels.fetch(reddit.destination)
                .then(channel => {
                  channel.send(`${reddit.nsfw} ${releases.data.children[0].data.url_overridden_by_dest} ${reddit.nsfw}`)
                  .then(ownMessage => {
                    if (reddit.poll) {
                      ownMessage.react(config.discord.emojis.thumbsUp)
                      ownMessage.react(config.discord.emojis.thumbsDown)
                    }
                  })
                })
                db.collection("reddit").doc(reddit.docId).set({
                  title: releases.data.children[0].data.title
                }, {merge: true})
              } catch (error) {
                console.error(error)
              }
          }
        }
      })
      stream.on("error", (error) => {
        return console.error(error)
      })
    })
  }
}

module.exports = Reddit