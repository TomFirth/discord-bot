const cron = require("cron")
const utilities = require("../scripts/utilities")
const config = require("../config.json")

async function init(client, db) {
  const games = [
    "",
    "quiz",
    "pokemon",
    "",
    "riddle",
    "movies",
    ""
  ]
  const today = new Date()
  const dow = today.getDay()
  let scheduledMessage = new cron.CronJob("0 0 0 * * *", async () => {
    if (games[dow] !== "") {
      const lastQuestion = db.collection("answer").doc("uLLtQDVl1lo41har8LqO")
      const doc = await lastQuestion.get()
      if (!doc.data().used) {
        utilities.channel(client, config.discord.channels.general, `Today's answer was: ${doc.data().answer}`)
        db.collection("answer").doc("uLLtQDVl1lo41har8LqO").update({ used: true })
      }
    }
  })
  scheduledMessage.start()
}

module.exports = init