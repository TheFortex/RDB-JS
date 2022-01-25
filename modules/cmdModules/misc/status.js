const cmd = new SlashCommandBuilder();
cmd.setName("status");
cmd.setDescription("Replies bot status");

exports.data = cmd;
exports.perms = perms.none;
exports.execute = (interaction) => {
    interaction.reply(`Uptime: [PlaceHolder]\nPing: [PlaceHolder]`);
}