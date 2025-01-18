const { SlashCommandBuilder, VoiceChannel, Client, ClientVoiceManager, CommandInteraction, PermissionsBitField } =  require('discord.js');
const { Internal } = ('@discord-player/extractor');
const { player } = require('../../index');
// Preset musics with start, which plays the music in the current voice channel the user is in

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Starts the music preset in the current voice channel')
        .addStringOption(
            (option) => option
                .setName('song')
                .setDescription('The song to play')
                .setRequired(true)
        ),
    /**
     * The execute function for the start command. This function is called whenever the start command is invoked.
     * @param {CommandInteraction} interaction The interaction object from Discord.js
     */
    async execute(interaction) {
        // Check if the user is in a guild and has joined a voice channel
        if (!interaction.guild || !interaction.member || !interaction.member.voice?.channel) {
            // If the user is not in a guild or has not joined a voice channel, reply with an error message
            return interaction.reply('You need to be in a voice channel to play music!');
        }

        // Get the guild object from the interaction
        const data = {
            guild: interaction.guild
        };

        // Get the query from the user
        const query = interaction.options.getString('song', true);

        // Check if the bot is already playing in another channel
        const botVoiceChannel = interaction.guild.members.me?.voice?.channel;
        if (botVoiceChannel && botVoiceChannel !== interaction.member.voice.channel) {
            // If the bot is already playing in another channel, reply with an error message
            return interaction.reply('The bot is already playing in another channel!');
        }

        // Check if the bot has permission to join the channel
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) {
            // If the bot does not have permission to join the channel, reply with an error message
            return interaction.reply('I do not have permission to join the voice channel!');
        }

        // Check if the bot has permission to speak in the channel
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) {
            // If the bot does not have permission to speak in the channel, reply with an error message
            return interaction.reply('I do not have permission to speak in the voice channel!');
        }

        // Play the song and catch any errors
        try {
            // Search for query
            const searchQuery = query;
            const result = await player.search(searchQuery);

            // Play the song
            await player.play(result)

            // Reply to the user of the success
            return interaction.reply('The song has been added to the queue!');
        } catch (error) {
            // If there was an error while trying to play the song, catch the error and log it to the console
            console.error(error);
            // Reply to the user with an error message
            return interaction.reply('There was an error while trying to play the song!');
        }
    }
};