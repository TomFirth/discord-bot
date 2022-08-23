module.exports = {
  emoji: '🗣️',
  name: 'lie',
  description: 'Lie Detector',
  run(client, message) {
    message.delete()
    const lies = [
      "That was most certainly bullshit.",
      "No lie was detected.",
      "Uncertain. *sniffs*. Possible.",
      "Say that again, with your hand on a bible.",
      "Honest as the day is long.",
      "Lie.",
      "Honest Abe/'s second cousin, twice removed.",
      "Fake, false, untrue.",
      "I detect no lie.",
      "Go forth and remain pure.",
      "<message too full of nonsense to detect lie>",
      "Truth.",
      "OJ couldn't have said it better.",
      "I'll flip a coin for this one.",
      "Could be either, most likely both.",
      "You have said many truths, this was not one of them.",
      "Liar liar, pants on fire!",
      "That one was off the scale."
    ]
    message.channel.send(lies[Math.floor(Math.random() * lies.length)])
  },
}