const { fetchSubreddit } = require('fetch-subreddit')

module.exports = {
  emoji: '🎵',
  name: 'rrr',
  description: 'Reddit Rhythm Roulette',
  execute(client, interaction) {
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
      urls.forEach(tracks => {
        everything.push(tracks.urls)
      })
      const completeList = everything[0].concat(everything[1], everything[2], everything[3])
      while (randomTracks.length < 3) {
        let rand = Math.floor(Math.random() * completeList.length)
        if (completeList[rand]
          && !randomTracks.includes(completeList[rand])
          && randomTracks.indexOf(completeList[rand]) > -1
          && completeList[rand].includes('youtu')) {
            randomTracks.push(completeList[rand])
        }
      }
      randomTracks = randomTracks.slice(0, 3)
      randomTracks.forEach((track, index) => {
        interaction.channel.send(track)
      })
    })
    .catch(error => console.error(error))
  }
}