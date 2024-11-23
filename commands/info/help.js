const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder 
} = require("discord.js");
const { glob } = require("glob");
const { promisify } = require("util");
const { prefix } = require('../../config.json');
const { Utils } = require("devtools-ts");

const utilites = new Utils();

module.exports = {
    name: "help",
    description: "Feeling lost?",
    cooldown: 5000,
    async execute(client, message, args) {
        try {
            // Promisify glob to use async/await
            const globPromise = promisify(glob);
            const commandFiles = await globPromise(`${process.cwd()}/commands/music/**/*.js`);

            // Initialize the embed
            const embed = new EmbedBuilder()
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setTitle("Help Menu")
                .setDescription("List of available commands:");

            // Loop through command files and add them to the embed
            commandFiles.map((value) => {
                const file = require(value);
                const splitted = value.split("/");
                const directory = splitted[splitted.length - 2];

                if (file.name) {
                    const properties = { directory, ...file };
                    embed.addFields({
                        name: `${prefix}${properties.name}`,
                        value: properties.description || "No description provided.",
                        inline: false
                    });
                }
            });

            // Create buttons
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel("Invite Bot")
                        .setURL(`https://your-invite-link.com`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel("Server Support")
                        .setURL("https://discord.gg/angelsrp")
                );

            // Send the embed and buttons as a reply
            await message.reply({ embeds: [embed], components: [row] });
        } catch (err) {
            console.error("Error executing help command:", err);

            // Send error message to the user (optional)
            message.reply({
                content: "An error occurred while executing the help command. Please try again later.",
                ephemeral: true
            });
        }
    },
};