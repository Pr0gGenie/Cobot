// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { TOKEN } = require('dotenv').config().parsed;


// Create a new client instance

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// We require the extractors from discord-player
const { DefaultExtractors } = require('@discord-player/extractor');
// We require the Player class from the discord-player package
const { Player } = require('discord-player');

// We create a new instance of the Player class, passing in the client instance
const playerInstance = new Player(client);
const playerExports = { player: playerInstance };

// We need to load the default extractors for discord-player
// The default extractors are what allow discord-player to extract audio from URLs
// We'll load them in an asynchronous function because it needs to happen at runtime
async function initPlayer() {
	try {
		// We use the loadMulti method of the extractors property on the player instance to load all the default extractors
		// The DefaultExtractors constant is an array of functions that represent the default extractors
		// The loadMulti method will run each of the functions in the array and add their extractors to the player
		await playerInstance.extractors.loadMulti(DefaultExtractors);
	} catch (error) {
		// If there's an error while loading the default extractors, we log it to the console
		console.error('Error while loading default extractors:', error);
	}
}

// We call the initPlayer function immediately, and if there's an error, we log it to the console
initPlayer().catch(console.error);

// Finally, we export the player exports object
module.exports = playerExports;

const searchQuery = "golden hour";
const result = await playerInstance.search(searchQuery);
console.log(result);

// Login to Discord with your bot's token
client.login(TOKEN);