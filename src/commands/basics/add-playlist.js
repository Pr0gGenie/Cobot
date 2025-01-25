// modules
const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add_preset")
        .setDescription("Add your own playlist on youtube as a preset")
};