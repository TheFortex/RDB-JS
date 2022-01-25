client.cmds = {}
const JSONcmds = [];

fs.readdirSync("./modules/cmdModules/").forEach(folder => {
    fs.readdirSync("./modules/cmdModules/" + folder).forEach(file => {
        log(logLevel.debug, "Loading Command: "+file);
        const loadT = Date.now();

        const path = `./cmdModules/${folder}/${file}`
        const cmd = require(path);
        cmd.path = path

        client.cmds[cmd.data.name] = cmd
        JSONcmds.push(cmd.data.toJSON());

        log(logLevel.debug, `Loaded Command: ${file}; eslaped: ~${Date.now() - loadT}ms`);
    })
})

rest.put(Routes.applicationGuildCommands(env.clientId, env.guildId), { body: JSONcmds })
    .then(() => log(logLevel.info, 'Successfully registered application commands.'))
    .catch(console.error);

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const cmd = client.cmds[interaction.commandName]
    if (!cmd) return;

    // try {
        await cmd.execute(interaction)
    // } catch (err) {
    //     log(logLevel.error, `The bot ran into an error while executing ${cmd.path}: ${err})`);
    //     await interaction.reply({content: 'The bot ran into an error while executing this command', ephemeral: true});
    // }
})