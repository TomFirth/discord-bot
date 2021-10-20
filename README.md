*What*
A simple Discord bot to promote a healthy and active server.

*Why*
There were a few features that I specifically wanted and found that I required multiple bots to achieve this. I think my OCD kicked in and it seemed like a good idea to aggregate them.

*Features*
- Temporary voice and text channels
- Polls
- The ability to follow multiple social media channels (twitter and youtube currently, twitch and instagram to follow).
- Can be self hosted. This is currently running from a Raspberry Pi 3b+

*Future features*
- Daily/weekly/monthly quiz with a prize!
- Search engine that provides top result (kinda like Alexa/Google assistant)
- Coin flip / dice roll
- Reddit Rhythm Roulette integration (provides three songs to be used as samples)
- Server user birthdays (searchable, visible who's next and notifications!)
- Gaming news
- News on video games betas
- News on free games (Epic..etc)
- Meme of the day (`r/meme`)
- Patch notes for certain video games.

*Requirements*
`discord.js v13` requires `node v16.6+`

`pm2` for process management and `./ecosystem.config.js` for tokens.
`./config.json` for user specific details.

*Usage*

*Useful resources*
https://discord.js.org/#/docs/main/stable/general/welcome
https://www.npmjs.com/package/pm2
