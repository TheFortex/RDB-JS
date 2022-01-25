const cmd = new SlashCommandBuilder();
cmd.setName("post");
cmd.setDescription("Create a post in one of the job channels.");

const postingUsers = []

exports.data = cmd;
exports.perms = perms.none;
exports.execute = (interaction) => {
    try {
        let user, userDM
        interaction.user.fetch(false)
            .then(data => {user = data})
            .catch(err => {throw err})
        
        user.createDM(user.tag)
            .then(data => {userDM = data})
            .catch(err => {throw err})
        
        if (postingUsers.some(v => v == user.id)) {
            log(logLevel.info, `${user.tag} is already making a post, ignoring...`)
            interaction.reply("Please finish your post or wait for it to be approved...")
            return
        }

        userDM.send("Hello!")
            .then(() => interaction.reply({content: "Check your DMs to continue.", ephermal: true, fetchReply: false}))
            .catch(() => {
                interaction.reply({content: "Please turn on your DMs.", ephermal: true, fetchReply: false});
                postingUsers.removeV(user.id)
                return
            });
        
        postingUsers.push(user.id)

        // Channel \\

        log(logLevel.debug, `${user.tag} prompted for channel`)
        let channelObj
        let channel = prompt.choice({
            user: user,
            channel: userDM,
            promptDesc: `What are you making your post for? You are .......`,
            examples: ["Hiring", "For Hire", "Selling"],
            timeout: 5,
            limit: 1
        })
        if (!channel) {return log(logLevel.debug, `${user.tag} returned no channel`), postingUsers.removeV(user.id)}
        channel = channel[1]
        log(logLevel.debug, `${user.tag} returned "${channel}" for the channel prompt`)
        client.channels.fetch(data.jobChannels[channel])
            .then(obj => {channelObj = obj})
            .catch(err => {throw `Couldn't fetch channel ${channel}: ${err}`})

        // Checking Channel Cooldown \\

        if (data.postCooldowns.subget(user.id, data.jobChannels[channel])) {
            const postTime = data.postCooldowns.subget(user.id, data.jobChannels[channel])
            const days = (Date.now() - postTime)/1000/60/60/24
            if (days < 1) {
                log(logLevel.info, `${user.tag} is making a new post while on cooldown; canceling...`)
                userDM.send(`You are posting in the same channel too fast! Please wait ${timetostring(1000*60*60*24-(Date.now() - postTime))}`)

                return postingUsers.removeV(user.id)
            } else {
                data.postCooldowns.subremove(user.id, data.jobChannels[channel])
            }
        }

        // Checking for an Old Post by the Same User \\

        let oldPost
        channelObj.messages.fetch({limit: 300})
            .then(messages => {
                const index = messages.findIndex(message => extractId(message.content) == user.id)
                if (index != -1) {
                    userDM.send(embed.warning("Please note that you already have a post in that channel. If you make another one, the old one will be deleted."))
                    oldPost = messages[index]
                }
            })
            .catch(err => {throw `Couldn't fetch messages in ${channel.name}: ${err}`})
            
        // Payment Methods \\

        log(logLevel.debug, `${user.tag} prompted for payment methods`)
        const paymentMethods = prompt.choice({
            user: user,
            channel: userDM,
            promptDesc: "Select payment method(s)",
            examples: ["Robux", "Real Money", "Other"],
            timeout: 5,
            limit: 3
        })
        if (!paymentMethods) {return log(logLevel.debug, `${user.tag} returned no payment methods`), postingUsers.removeV(user.id)}
        log(logLevel.debug, `${user.tag} returned "${paymentMethods.join(', ')}" for the payment methods prompt`)

        // Payment Amounts \\

        const payments = {}
        paymentMethods.forEach(method => {
            log(logLevel.debug, `${user.tag} prompted for amount in ${method}`)
            payments[method] = prompt.text({
                user: user,
                channel: userDM,
                promptDesc: `Specify the amount/range ${channel == "Hiring" ? "you offer" : "you request"} in this **${method}**`,
                examples: method == "Real Money" && ["$5 USD", "$5-30 USD", "$3 CAD"] || method == "Robux" && ["200", "200-1000"] || method == "Other" && ["50% of game revenue", "0.0001 BTC"] && {},
                timeout: 5,
                limit: 100
            })
            if (!payments[method]) {return log(logLevel.debug, `${user.tag} returned no payment amount for ${method}`), postingUsers.removeV(user.id)}
            log(logLevel.debug, `${user.tag} returned "${payments[method]}" for amount in ${method}`)
        })

        // Description \\

        log(logLevel.debug, `${user.tag} prompted for description`)
        const description = prompt.text({
            user: user,
            channel: userDM,
            promptDesc: `Please write a description with details about ${
                channel == "Hiring" && "your offer, such as what will the recipent be doing and/or how long they are expected to work" ||
                channel == "Selling" && "your product, such as how it works or any extra notes about it that you would like to add" ||
                channel == "For Hire" && "you, such as your previous works and/or experience"
            }`,
            examples: {},
            timeout: 20,
            limit: 4000
        })
        if (!description) {return log(logLevel.debug, `${user.tag} returned no description`), postingUsers.removeV(user.id)}
        log(logLevel.debug, `${user.tag} returned "${description}" for the description prompt`)

        // Image \\

        log(logLevel.debug, `${user.tag} prompted for image`)
        const attachedImage = prompt.image({
            user: user,
            channel: userDM,
            promptDesc: `Send an image to be included in the post (optional)`,
            examples: ["https://cdn.discordapp.com/attachments/639848186374127649/935420599969402920/220px-Trollface_non-free.png"],
            timeout: 5
        })
        if (description == false) {postingUsers.removeV(user.id)}
        if (description == null) {return log(logLevel.debug, `${user.tag} returned no image`)}
        log(logLevel.debug, `${user.tag} returned "${description}" for the description prompt`)

    } catch (err) {
        postingUsers.removeV(interaction.user.id)
        interaction.user.createDM("The bot ran into an error. Try making your post again. If the problem persists then open a ticket.")
        throw err
    }
}