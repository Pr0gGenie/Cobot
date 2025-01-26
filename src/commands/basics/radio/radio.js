const { SlashCommandBuilder, GuildMember, Guild } = require("discord.js");
const presets = require("../presets");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("radio")
    .setDescription("Manage this radio bot")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("start")
            .setDescription("Start a preset in the current voice channel you are in")
            .addStringOption((option) =>
                option
                    .setName("preset")
                    .setDescription("Add a preset to the queue")
                    .setRequired(true)
                    .addChoices(
                        ...Object.keys(presets).map((name) => ({
                            name: name,
                            value: name,
                        }))
                    )
                )
            )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("stop")
            .setDescription("Stops the current playing preset, and disconnects the bot"))
    .addSubcommand((subcommand) => 
        subcommand
            .setName("replace")
            .setDescription("Replaces the playing preset with a different one"))
            .addStringOption((option) =>
                option
                    .setName("preset")
                    .setDescription("Replace with this preset")
                    .setRequired(true)
                    .addChoices(
                        ...Object.keys(presets).map((name) => ({
                            name: name,
                            value: name,
                        }))      
                    )
                ),
    
    // TODO: the user can control the timer the preset is played for
    // TODO: the user can choose to set it as a pomodoro timer instead
    // .addSubcommand((subcommand) =>
    //     subcommand
    //         .setName("timer")
    //         .setDescription("Adjusts the time the bot plays the music for")),
    

  async execute(interaction) {
  },
};
