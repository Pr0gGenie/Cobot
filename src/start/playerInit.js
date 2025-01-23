const { Player } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei");

async function initPlayer(client) {
  // Initialize the player
  const player = new Player(client);

  // Now, lets load all the default extractors
  await player.extractors.register(YoutubeiExtractor, {});
}

module.exports = { initPlayer };
