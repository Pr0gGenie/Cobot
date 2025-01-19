const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');

async function initPlayer(client) {
    // Initialize the player
    const player = new Player(client);
    
    // Now, lets load all the default extractors
    await player.extractors.loadMulti(DefaultExtractors);
};

module.exports = {initPlayer};