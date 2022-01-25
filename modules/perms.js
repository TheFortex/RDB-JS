global.perms = {}

// Require all conditions to pass.
perms.pand = (...rest) => {
    const args = [rest];
    return (interaction) => {
        args.forEach(p => {
            if (!p(interaction)) {return false};
        })
        return true;
    }
}

// Require any condition to pass.
perms.por = (...rest) => {
    const args = [rest];
    return (interaction) => {
        args.forEach(p => {
            if (p(interaction)) {return true};
        })
        return false;
    }
}

// Requires the inverse of the condition.
perms.pnot = p => {
    return interaction => {return !p(interaction)};
}

// Requires the call to be from a server
perms.inServer = () => {
    return interaction => {return interaction.guild != null};
}

// Requires a global permission.
perms.hasPerm = perm => {
    return interaction => {
        return interaction.member == nil ||
            interaction.member.permissions.has(perm);
    }
}

// Requires a channel permission.
perms.hasPermLocal = perm => {
    return interaction => {
        return interaction.member == nil ||
            interaction.member.permissionsIn(interaction.channel).has(perm);
    }
}

// Requires a specific role.
perms.hasRole = role => {
    return interaction => {
        return interaction.member == nil ||
            interaction.member.roles.resolve(role) != null;
    }
}

// Requires a specific channel.
perms.inChannel = id => {
    return interaction => {
        return interaction.channelId == id;
    }
}

// Requires a specific user.
perms.isUser = id => {
    return interaction => {
        return interaction.user.id == id;
    }
}

// Requires a developer.
perms.isDev = () => {
    return interaction => {
        return interaction.user.id == "97987478610251776"
    }
}

// Requires no permissions
perms.none = () => {return true}