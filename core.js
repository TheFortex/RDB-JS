const { Client, Intents } = require('discord.js');
const { TIMEOUT } = require('dns');
global.env = require('./env.json');
global.Routes = require('discord-api-types/v9').Routes;
global.fs = require('fs');
global.SlashCommandBuilder = require("@discordjs/builders").SlashCommandBuilder;
global.client = new Client({ intents: [Intents.FLAGS.GUILDS] });
global.rest = new (require('@discordjs/rest').REST)({ version: '9' }).setToken(env.token);

// Loading Modules

const modules = ["utils","embeds","prompts","perms","data","cmds"];
modules.forEach(path => {
	require("./modules/"+path);
})

// When the client is ready, run this code
client.on('ready', () => {
	log(logLevel.info, `${client.user.username} is Online`);
});

// Login to Discord with your client's token
client.login(env.token);