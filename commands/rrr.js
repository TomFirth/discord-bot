const { fetchSubreddit } = require("fetch-subreddit")

module.exports = {
  emoji: '🎵',
  name: 'rrr',
  description: 'Reddit Rhythm Roulette',
  execute(client, message) {
    let randomTracks = []
    let everything = []
    fetchSubreddit([
      'vintageobscura',
      'SoulMusic',
      'JazzMusic',
      'Jazz',
      'Disco'
    ])
    .then(urls => {
      everything = urls[0].urls.concat(urls[1].urls, urls[2].urls, urls[3].urls, urls[4].urls)
      while (randomTracks.length < 3) {
        let rand = Math.floor(Math.random() * everything.length - 1)
        if (everything[rand]
          && !randomTracks.includes(everything[rand])
          && everything[rand].includes("youtu")) {
            randomTracks.push(everything[rand])
        }
      }
      randomTracks = randomTracks.slice(0, 3)
      randomTracks.forEach((track, index) => {
        message.channel.send(track)
      })
    })
    .catch(error => console.error(error))
  }
}