const Twitter = require('twit')
const config = require('../../config')

const twitterConf = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
}
const twitterClient = new Twitter(twitterConf)

class TwitterFeed {
  static start(client) {
    const stream = twitterClient.stream('statuses/user_timeline', {
      follow: config.socials.twitter.user,
      include_rts: false
    })
    const emoji = client.emojis.cache.get(config.discord.emojis.twitter)

    stream.on('tweet', tweet => {
      let channel = client.channels.cache.find(channel => channel.name === config.discord.channels.socials)
      channel.send(`${emoji} https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str} ${emoji}`)
      return false
    })
  }
}

module.exports = TwitterFeed
