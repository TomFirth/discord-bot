const db = require("quick.db")
const request = new (require("rss-parser"))()
const config = require('../../config.json')

class YoutubeFeed {
  static start(client, account) {
    if (db.fetch(`postedVideos`) === null) db.set(`postedVideos`, [])
    setInterval(() => {
      request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${config.socials.youtube[`${account}`]}`)
      .then(data => {
        if (db.fetch(`postedVideos`).includes(data.items[0].link)) return
        else {
          db.set(`videoData`, data.items[0])
          db.push("postedVideos", data.items[0].link)
          let parsed = db.fetch(`videoData`)
          let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.socials)
          if (!channel) return
          channel.send(parsed.link)
        }
      })
    }, config.socials.youtube.watchInterval)
  }
}

module.exports = YoutubeFeed