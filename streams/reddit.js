const https = require("https")
const config = require("../config.json")

class Reddit {
  static start(client, reddit, db) {
    const url = new URL("https://www.reddit.com/r/" + reddit.subreddit + "/top.json?t=" + reddit.frequency)
    https.get({
      hostname: url.hostname,
      path: url.pathname,
      headers: {'User-Agent': 'agent'}
    }, async response => {
      let data = []
      response.on('data', chunk => {
        data.push(chunk)
      })
      response.on('end', async () => {
        // check safe for work hours
        const startTime = '19:00:00'
        const endTime = '23:59:00'
        const currentDate = new Date()   
        let startDate = new Date(currentDate.getTime())
        startDate.setHours(startTime.split(":")[0])
        let endDate = new Date(currentDate.getTime())
        endDate.setHours(endTime.split(":")[0])
        endDate.setMinutes(endTime.split(":")[1])
        const valid = startDate < currentDate && endDate > currentDate
        if ((reddit.hide && valid) || !reddit.hide) {
          const query = await db.collection("reddit").doc(reddit.docId).get()
          const releases = JSON.parse(Buffer.concat(data).toString())
          if (releases.reason) console.error("subreddit is private")
          else {
            try {
              if (query.data() !== undefined
                && releases.data.children[0].data.url_overridden_by_dest !== undefined
                && query.data().title !== releases.data.children[0].data.title) {
                  try {
                    console.error("++", reddit.subreddit)
                    await client.channels.fetch(reddit.destination)
                    .then(channel => {
                      channel.send(`${reddit.hide} ${releases.data.children[0].data.url_overridden_by_dest} ${reddit.hide}`)
                      .then(ownMessage => {
                        if (reddit.poll) {
                          ownMessage.react(config.discord.emojis.thumbsUp)
                          ownMessage.react(config.discord.emojis.thumbsDown)
                        }
                      })
                      .catch(console.error)
                    })
                    db.collection("reddit").doc(reddit.docId).set({
                      title: releases.data.children[0].data.title
                    }, {merge: true})
                  } catch (error) {
                    console.error(error)
                  }
              }
            } catch (error) {
              console.error(error)
            }
          }
        }
        response.destroy()
      })
      response.on("error", (error) => {
        return console.error
      })
    })
  }
}

module.exports = Reddit