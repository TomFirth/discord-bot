const { SlashCommandBuilder } = require("@discordjs/builders")
const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

module.exports = {
  data: new SlashCommandBuilder()
    .setName("question")
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
      'temperature': 1,
      'frequency_penalty': 0,
      'presence_penalty': 0.6,
      'stream': false,
      'stop': '\nHuman'
    })
    await interaction.deferReply()
    setTimeout(async () => {
      console.log(response.data)
      await interaction.editReply(String(response.data.choices[0].text)).catch(console.error)
    }, 4000)
  }
}