# Discord bot

## What

A simple Discord bot to promote a healthy and active server.

## Why

There were a few features that I specifically wanted and found that I required multiple bots to achieve this.
I think my OCD kicked in and it seemed like a good idea to aggregate them.

## Features

- [X] Temporary voice and text channels creation with pruning after inactivity.
- [X] Polls.
- [X] The ability to follow multiple social media channels
- - [X] Twitter
- - [X] Youtube
- - [ ] Twitch
- - [ ] Instagram
- - [ ] Soundcloud
- [X] Google search that returns the top result.
- [X] Reddit Rhythm Roulette integration (provides three songs to be used as samples).
- [X] Meme of the day.
- [X] Weekly quizzes with a prize!
- [X] Notifications of Free games.
- [X] Amazon Gaming freebies
- [X] Gaming and Tech news.
- [X] OpenAI integration
- [X] Facts & Jokes
- [X] Patch notes for specfic games and software
- [ ] News on video games betas.
- [ ] Crypto integration
- [ ] Trading
- [ ] Add user Steam libraries and allow them to search for people to play with.
- [ ] Valheim server
- [ ] Game of games
- [ ] Pet fighting discord game
- [ ] Weather, coldest (12am) and hottest (12pm) of the day

### Usage

- [Create bot on discord's developer portal](https://discord.com/developers/applications)
- Find somewhere to host your new bot (maybe on a spare Raspberry Pi?) [Heroku have affordable plans](https://www.heroku.com).
- Clone this repo to your host.
- `cd <your bot dir> && npm i`
- Install `pm2` and follow setup steps (`sudo apt-get install pm2`)
- `pm2 start <your bot ecosystem file>`

#### Useful resources

[discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome)
[npm pm2](https://www.npmjs.com/package/pm2)
[npm cron](https://www.npmjs.com/package/cron)
[npm fetch-subreddit](https://www.npmjs.com/package/fetch-subreddit)
[npm firebase-admin](https://www.npmjs.com/package/firebase-admin)
[googleapis](https://www.npmjs.com/package/googleapis)
[google-it](https://www.npmjs.com/package/google-it)
[node-cache](https://www.npmjs.com/package/node-cache)
[openai](https://www.npmjs.com/package/openai)
[rss-parser](https://www.npmjs.com/package/rss-parser)
[twit](https://www.npmjs.com/package/twit)

##### Alternatives for Discord:

[https://mee6.xyz/](MEE6)
[https://patchbot.io/](PatchBot)
[https://ifttt.com/](IFTTT)
