const cmd = new SlashCommandBuilder();
cmd.setName("serverinfo");
cmd.setDescription("Replies with server info");

exports.data = cmd;
exports.perms = perms.none;
exports.execute = (interaction) => {
    interaction.reply(`**Server name:** ${interaction.guild.name}\n**Member count:** ${interaction.guild.memberCount}\n**Created in:** ${interaction.guild.createdAt}`);
}