global.prompt = {}

prompt.choice = ({user, channel, promptDesc, choices, timeout, limit}) => {
    const picked = [];

    let looping = true
    while (picked.length < limit && choices.length > 0 && looping) {
        channel.send([
            embeds = [[
                color = [45, 151, 229],
                description = `${promptDesc}\n\`${choices.join("` - `")}\`\n\n You can pick up to ${limit} option${limit > 1 && "s" || ""}\nRespond with \`end\` to finish picking.\nRespond with \`cancel\` to cancel this prompt.`,
                footer = [text = `This prompt will timeout in ${timeout} minutes.`]
            ]]
        ]).catch(err => {log(logLevel.error, err); return null, err;});

        const collector = channel.createMessageCollector({time: timeout * 60000, filter: message => {
            if (message.channelId == channel.id && message.authorId == user.id) {
                if (message.content.toLowerCase() == "cancel" || message.content.toLowerCase() == "end") {
                    return true;
                } else {
                    if (choices.some(choice => choice.toLowerCase() == message.content.toLowerCase())) {
                        return true
                    } else {
                        channel.send(embed.warning("Invalid Input."));
                        return false
                    }
                }
            }

            return false
        }});

        collector.on("collect", message => {
            if (message.content.toLowerCase() == "cancel") {
                channel.send("Prompt Cancelled.");
                log(logLevel.info, `${userIdentifier(user)} canceled their prompt`);
                return
            } else if (message.content.toLowerCase() == "end") {
                if (picked.length > 0) {
                    collector.stop();
                    looping = false;
                } else {
                    channel.send(embed.warning("You have to pick something"));
                }
            } else {
                choices.forEach(choice => {
                    if (choice.toLowerCase() == message.content.toLowerCase()) {
                        picked.push(choice);
                        choices.splice(choices.findIndex(v => {return v == choice}), 1);
                        looping = false;
                    }
                })
            }
        })

        collector.on("end", collected, reason => {
            if (collected.size == 0) {
                channel.send(reason)
            }
        })
    }

    return picked
}

prompt.number = ({user, channel, promptDesc, examples, timeout}) => {
    channel.send([
        embeds = [[
            color = [45, 151, 229],
            description = `${promptDesc}\n\`${examples.join("` - `")}\`\n\nRespond with \`cancel\` to cancel this prompt.`,
            footer = [text = `This prompt will timeout in ${timeout} minutes.`]
        ]]
    ]).catch(err => {log(logLevel.error, err); return null, err;});

    const collector = channel.createMessageCollector({time: timeout * 60000, filter: message => {
        if (message.channelId == channel.id && message.authorId == user.id) {
            if (message.content.toLowerCase() == "cancel" || message.content.toNumber()) {
                return true;
            } else {
                channel.send(embed.warning("Invalid Input."));
                return false
            }
        }

        return false
    }});

    collector.on("collect", message => {
        if (message.content.toLowerCase() == "cancel") {
            channel.send("Prompt Cancelled.");
            log(logLevel.info, `${userIdentifier(user)} canceled their prompt`);
            return
        } else {
            return message.content.toNumber()
        }
    })

    collector.on("end", collected, reason => {
        if (collected.size == 0) {
            channel.send(reason)
        }
    })
}

prompt.text = ({user, channel, promptDesc, examples, timeout, limit}) => {
    channel.send([
        embeds = [[
            color = [45, 151, 229],
            description = `${promptDesc}\n\`${examples.join("` - `")}\`\n\nRespond with \`cancel\` to cancel this prompt.`,
            footer = [text = `This prompt will timeout in ${timeout} minutes.`]
        ]]
    ]).catch(err => {log(logLevel.error, err); return null, err;});

    const collector = channel.createMessageCollector({time: timeout * 60000, filter: message => {
        if (message.channelId == channel.id && message.authorId == user.id) {
            if (limit) {
                if (message.content.length > limit) {
                    log(logLevel.debug, `${user.tag} returned a too long string`)
                    channel.send(`The text you sent is too long. Excess starts from ${message.content.substring(limit)}`)
                    return false
                } else {return true}
            } else {return true}
        } else {return false}
    }});

    collector.on("collect", message => {
        if (message.content.toLowerCase() == "cancel") {
            channel.send("Prompt Cancelled.");
            log(logLevel.info, `${userIdentifier(user)} canceled their prompt`);
            return
        } else {
            return message.content
        }
    })

    collector.on("end", collected, reason => {
        if (collected.size == 0) {
            channel.send(reason)
        }
    })
}

prompt.channel = ({user, channel, promptDesc, examples, timeout}) => {
    channel.send([
        embeds = [[
            color = [45, 151, 229],
            description = `${promptDesc}\n\`${examples.join("` - `")}\`\n\nRespond with \`cancel\` to cancel this prompt.`,
            footer = [text = `This prompt will timeout in ${timeout} minutes.`]
        ]]
    ]).catch(err => {log(logLevel.error, err); return null, err;});

    let data
    const collector = channel.createMessageCollector({time: timeout * 60000, filter: message => {
        if (message.channelId == channel.id && message.authorId == user.id) {
            if (message.content.toLowerCase() == "cancel" || message.content.toNumber()) {
                return true;
            } else {
                const channelId = extractId(message.content)
                if (!channelId) {channel.send(embed.warning("Invalid Input.")); return false;}
                channel.send(embed.warning("Invalid Input."));

                data = client.channels.fetch(channelId)
                if (!data) {channel.send(embed.warning("Channel Not Found.")); return false;}
                
                return true
            }
        }

        return false
    }});

    collector.on("collect", message => {
        if (message.content.toLowerCase() == "cancel") {
            channel.send("Prompt Cancelled.");
            log(logLevel.info, `${userIdentifier(user)} canceled their prompt`);
            return
        } else {
            return data
        }
    })

    collector.on("end", collected, reason => {
        if (collected.size == 0) {
            channel.send(reason)
        }
    })
}

prompt.bool = ({user, channel, promptDesc, examples, timeout}) => {
    channel.send([
        embeds = [[
            color = [45, 151, 229],
            description = `${promptDesc}\n\`${examples.join("` - `")}\`\n\nRespond with \`cancel\` to cancel this prompt.`,
            footer = [text = `This prompt will timeout in ${timeout} minutes.`]
        ]]
    ]).catch(err => {log(logLevel.error, err); return null, err;});

    const truelist  = ["yes", "true", "ye", "y"];
    const falselist = ["no", "false", "n"];

    let data
    const collector = channel.createMessageCollector({time: timeout * 60000, filter: message => {
        if (message.channelId == channel.id && message.authorId == user.id) {
            if (message.content.toLowerCase() == "cancel") {
                return true;
            } else
            if (truelist.some(t => t == message.content.toLowerCase())) {data = true; return true} else
            if (falselist.some(t => t == message.content.toLowerCase())) {data = false; return true}
        }
        return false
    }});

    collector.on("collect", message => {
        if (message.content.toLowerCase() == "cancel") {
            channel.send("Prompt Cancelled.");
            log(logLevel.info, `${userIdentifier(user)} canceled their prompt`);
            return
        } else {
            return data
        }
    })

    collector.on("end", collected, reason => {
        if (collected.size == 0) {
            channel.send(reason)
        }
    })
}

prompt.image = ({user, channel, promptDesc, examples, timeout}) => {
    channel.send([
        embeds = [[
            color = [45, 151, 229],
            description = `${promptDesc}\n\`${examples.join("` - `")}\`\n\nRespond with \`skip\` to skip this prompt.\nRespond with \`cancel\` to cancel this prompt.`,
            footer = [text = `This prompt will timeout in ${timeout} minutes.`]
        ]]
    ]).catch(err => {log(logLevel.error, err); return null, err;});

    let data
    const collector = channel.createMessageCollector({time: timeout * 60000, filter: message => {
        if (message.channelId == channel.id && message.authorId == user.id) {
            if (message.content.toLowerCase() == "cancel" || message.content.toLowerCase() == "skip") {
                return true;
            } else if (message.content.match("/^https:\/\//")) {data = message.content; return true;}
        }

        return false
    }});

    collector.on("collect", message => {
        if (message.content.toLowerCase() == "cancel") {
            channel.send("Prompt Cancelled.");
            log(logLevel.info, `${userIdentifier(user)} canceled their prompt`);
            return
        } else {
            return data
        }
    })

    collector.on("end", collected, reason => {
        if (collected.size == 0) {
            channel.send(reason)
        }
    })
}