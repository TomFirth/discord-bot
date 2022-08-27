module.exports = {
  emoji: '🟡',
  name: 'coin',
  description: 'Flip a coin!',
  execute(client, message) {
    const coin = [
      "heads",
      "tails"
    ]
    return message.channel.send(coin[Math.floor(Math.random() * coin.length)])
  },
}