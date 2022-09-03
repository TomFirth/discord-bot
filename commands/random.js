const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("Barber will select a random number, between two numbers")
    .addNumberOption(option =>
      option
        .setName("num1")
        .setDescription("Number 1")
        .setRequired(true)
    )
    .addNumberOption(option =>
      option
        .setName("num2")
        .setDescription("Number 2")
        .setRequired(true)
    ),
  async execute(interaction) {
    let num1 = interaction.options.getNumber("num1")
    let num2 = interaction.options.getNumber("num2")
    if (interaction.options.getNumber("num1") > interaction.options.getNumber("num2")) {
      num2 = interaction.options.getNumber("num1")
      num1 = interaction.options.getNumber("num2")
    }
    interaction.reply({
      content: `${Math.floor(Math.random() * (num2 - num1 + 1) + num1)}`,
      ephemeral: false
    })
  }
}