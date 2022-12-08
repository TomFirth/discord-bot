const { EmbedBuilder } = require("discord.js")
const { SlashCommandBuilder } = require("@discordjs/builders")
const { Configuration, OpenAIApi } = require("openai")
const utilities = require("../scripts/utilities")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("openai")
    .setDescription("OpenAI Code helper")
    .addStringOption(option =>
      option
        .setName("question")
        .setDescription("Ask a question")
        .setRequired(true)
    ),
  async execute(interaction) {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: interaction.options.getString("question"),
      'max_tokens': 150,
      'temperature': 0.9,
      'frequency_penalty': 0,
      'presence_penalty': 0.6,
      'stop': '\nHuman'
    })
    await interaction.deferReply()
    setTimeout(async () => {
      console.log(response.data)
      await interaction.editReply(String(response.data.choices[0].text)).catch(console.error)
    }, 4000)
  }
}