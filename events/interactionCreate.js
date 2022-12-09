const config = require("../config.json")

module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return
  const { commandName, options } = interaction
  const command = client.commands.get(commandName)
  if (!command) return
  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: error,
      ephemeral: true
    })
  }
}