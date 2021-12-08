const timedCache = require("timed-cache")
const cache = new timedCache({ defaultTtl: 300 * 1000 }) // 5minutes

module.exports = {
  emoji: '🔢',
  name: 'games',
  description: 'Play a random game',
  execute(client, message) {
    if (!cache.get("highlow")) this.higherLower(message)
    else if (!cache.get("guess")) this.guessTheNumber(message)
    else message.channel.send(`All games are currently being played.`)
  },
  higherLower(message) {
    cache.put("highlow", Math.floor(Math.random() * 12))
    cache.put("highlownew", Math.floor(Math.random() * 12))
    cache.put("highlowstreak", 0)
    message.channel.send(`A new game has started! The first number is: ${highlow}. Will the next number be HIGHER or LOWER?\n(The range is 0-12)\nPlay with "higher" or "lower"`)
  },
  guessTheNumber(message) {
    cache.put("guess", Math.floor(Math.random() * 999))
    message.channel.send(`A new game has started! \n(The range is 0-999 - 5 minute time limit!)\nPlay with "guess <number>"`)
  }
}