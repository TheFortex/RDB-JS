global.embed = {}

embed.blue = [45, 151, 299]

embed.info = (message, title) => {
    const embed = new Discord.MessageEmbed()
    embed.setDescription(message)
    embed.setColor([45, 151, 299])
    embed.setAuthor(title || "")
    return {embed: embed}
}

embed.success = (message) => {
    const embed = new Discord.MessageEmbed()
    embed.setDescription(message)
    embed.setColor([147, 218, 28])
    embed.setAuthor({
        name: "SUCCESS",
        iconURL: "https://icons.iconarchive.com/icons/custom-icon-design/flatastic-9/128/Accept-icon.png"
    })
    return {embed: embed}
}

embed.warning = (message) => {
    const embed = new Discord.MessageEmbed()
    embed.setDescription(message)
    embed.setColor([255, 212, 83])
    embed.setAuthor({
        name: "WARNING",
        iconURL: "https://icons.iconarchive.com/icons/papirus-team/papirus-status/128/dialog-warning-icon.png"
    })
    return {embed: embed}
}

embed.error = (message) => {
    const embed = new Discord.MessageEmbed()
    embed.setDescription(message)
    embed.setColor([219, 60, 48])
    embed.setAuthor({
        name: "ERROR",
        iconURL: "https://icons.iconarchive.com/icons/papirus-team/papirus-status/128/dialog-error-icon.png"
    })
    return {embed: embed}
}