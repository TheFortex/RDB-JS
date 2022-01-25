global.memberIdentifier = (member) => {
    return `${member.user.tag}(${member.user.id})`
}

global.userIdentifier = (user) => {
    return `${user.tag}(${user.id})`
}

global.extractId = (content) => {
    return content.match("\d+")
}

global.findInObj = (t, v) => {
    for (const i in t) {
        if (t[i] == v) {return i}
    }
}

global.timeStringNow = () => {
    const now = new Date();
    return `${now.getUTCDate().toString().padStart(2, "0")}-${(now.getUTCMonth()+1).toString().padStart(2, "0")}-${now.getUTCFullYear().toString().padStart(4, "0")} ${now.getUTCHours().toString().padStart(2, "0")}:${now.getUTCMinutes().toString().padStart(2, "0")}:${now.getUTCSeconds().toString().padStart(2, "0")}.${now.getUTCMilliseconds().toString().padStart(3, "0")}`;
}

// Array Custom Methods \\

Array.prototype.findV = (value) => {
    return this.findIndex(v => v == value);
};

Array.prototype.removeV = (value) => {
    const i = this.findV(v => v == value);
    if (i) {this.splice(i, 1)};
};

// Logger \\

global.logLevel = {"none": 0,"error": 1,"warning": 2,"info": 3,"debug": 4}
const filePath = "./logs.txt";
fs.writeFile(filePath, "========================= RDB LOGS =========================", err => {if (err) throw err});

global.log = (level, message) => {
    message = `${timeStringNow()} | ${("["+findInObj(logLevel, level).toUpperCase()+"]").padEnd(9)} | ${message}`
    fs.appendFile(filePath, "\n"+message, err => {if (err) throw err})
    console.log(message)
}

global.logLoad = (action, object, subobject, eslaped) => {
    log(logLevel.info, `${("["+action+"]").padEnd(9)} | ${object.padEnd(14)} | ${subobject.padEnd(14)} | ${eslaped}`)
}

// Time Functions \\

timetostring = (ms) => {
    const seconds = ms/1000
    const days = math.floor(seconds/60/60/24)
    seconds = seconds - days*60*60*24
    const hours = math.floor(seconds/60/60)
    seconds = seconds - hours*60*60
    const minutes = math.floor(seconds/60)
    seconds = seconds - minutes*60

    return (days>0 ? days+" Days, " : "")+(hours>0 ? hours+" Hours, " : "")+(minutes>0 ? minutes+" Minutes, " : "")+seconds+" Seconds"
}