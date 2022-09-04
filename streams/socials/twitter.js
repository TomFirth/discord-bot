const Twitter = require("twit")
const config = require("../../config.json")
if (process.env.NODE_ENV) require("dotenv").config()

const twitterConf = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
}
const twitterClient = new Twitter(twitterConf)

class TwitterFeed {
  static start(client, user, destination) {
    const stream = twitterClient.stream("statuses/filter", {
      follow: user
    })

    stream.on("tweet", tweet => {
      if (tweet.retweeted_status
        || tweet.in_reply_to_status_id
        || tweet.in_reply_to_status_id_str
        || tweet.in_reply_to_user_id
        || tweet.in_reply_to_user_id_str
        || tweet.in_reply_to_screen_name) return false
      const channel = client.channels.cache.find(channel => channel.name === destination)
      channel.send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`).then(ownMessage => {
        if (destination == config.discord.channels.free) {
          ownMessage.react(config.discord.emojis.thumbsUp)
          ownMessage.react(config.discord.emojis.thumbsDown)
        }
      })
    })
    stream.on("error", error => {
      console.error(error)
    })
  }
}

module.exports = TwitterFeed