# Discord bot

## What

A simple Discord bot to promote a healthy and active server.

## Why

There were a few features that I specifically wanted and found that I required multiple bots to achieve this.
I think my OCD kicked in and it seemed like a good idea to aggregate them.

## Features

- [X] Temporary voice and text channels creation with pruning after inactivity.
- [X] Polls.
- [X] The ability to follow multiple social media channels (twitter, youtube, twitch and instagram coming soon).
- [X] Can be self hosted (a good use for a spare raspberry pi).
- [X] Google search that returns the top result.
- [X] Reddit Rhythm Roulette integration (provides three songs to be used as samples).
- [X] Meme of the day.
- [X] Weekly quiz with a prize!
- [X] Notifications of Free games.
- [X] Gaming news.
- [ ] Patch notes for certain video games.
- [ ] News on video games betas.
- [ ] Crypto integration
- [ ] Trading
- [ ] Add user Steam libraries and allow them to search for people to play with.

### Usage

- [Create bot on discord's developer portal](https://discord.com/developers/applications)
- Find somewhere to host your new bot (maybe on a spare Raspberry Pi?) [Heroku have affordable plans](https://www.heroku.com).
- Clone this repo to your host.
- `cd <your bot dir> && npm i`
- Create files: `config.json` and `ecosystem.config.js` (remote) and additionally `.env` (local) - I also have a credentials.json file for the Google Firestore.
- Install `pm2` and follow setup steps (`sudo apt-get install pm2`)
- `pm2 start <your bot file>`

*Updates are currently manual, but will be automatic once I stop messing about with it).*

#### Useful resources

[discord.js documentation](https://discord.js.org/#/docs/main/stable/general/welcome)
[npm pm2](https://www.npmjs.com/package/pm2)
[npm cron](https://www.npmjs.com/package/cron)

#### Alternatives for Discord:
[https://mee6.xyz/](MEE6)
[https://patchbot.io/](PatchBot)
[https://ifttt.com/](IFTTT)
