const cmd = new SlashCommandBuilder();
cmd.setName("userinfo");
cmd.setDescription("Replies with user info");

exports.data = cmd;
exports.perms = perms.none;
exports.execute = async (interaction) => {
    interaction.reply(`Your tag: ${interaction.user.tag}\nYour ID: ${interaction.user.id}`);
}