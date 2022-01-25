// Data \\

global.data = {}
const files = [
    {name: "jobChannels",       defaults: {}},
    {name: "postCooldowns",     defaults: {}}
]

// Data Object \\

class DataFile {
    constructor({name, defaults}) {
        logLoad("LOADING", "Data File", name)
        const loadT = Date.now()

        this.name = name
        this.defaults = defaults
        this.path = `./data/${name}.json`
        fs.readFile(this.path, "utf8", (readErr, data) => {
            if (readErr) {return log(logLevel.error, `Error while reading ${name}.json: ${readErr}`)}
            try {
                this.data = JSON.parse(data) || defaults
            } catch (parseErr) {return log(logLevel.error, `Error while parsing ${name}.json: ${parseErr}`)}
        })

        logLoad("LOADED", "Data File", name, `~${Date.now() - loadT}ms`)
    }

    save() {
        fs.writeFile(this.path, JSON.stringify(this.data),
            err => {
                return log(logLevel.error, `Error while saving ${this.name}.json: ${err}`)
            }
        )
    }

    clear() {
        this.data = this.defaults
        fs.writeFile(this.path,
            err => {
                return log(logLevel.error, `Error while clearing ${this.name}.json: ${err}`)
            }
        )
    }

    get(index) {
        if (index) {
            return this.data[index]
        } else {
            return this.data
        }
    }

    subget(sub, index) {
        if (sub && index) {
            if (!this.data[sub]) self.data[sub] = {}
            return this.data[sub][index]
        } else if (sub) {
            if (!this.data[sub]) self.data[sub] = {}
            return this.data[sub]
        }
    }

    set(index, value) {
        if (index) {
            this.data[index] = value
            this.save()
        }
    }

    insert(value) {
        if (value) {
            this.data.push(value)
            this.save()
        }
    }

    subinsert(sub, value) {
        if (sub && value) {
            if (!this.data[sub]) self.data[sub] = {}
            this.data[sub].push(value)
            this.save()
        }
    }

    remove(index) {
        if (index) {
            this.data.splice(index, 1)
            this.save()
        }
    }

    subremove(sub, index) {
        if (sub && index && this.data[sub]) {
            this.data[sub].splice(index, 1)
            this.save()
        }
    }

    removeV(value) {
        if (value) {
            this.data.removeV(value)
            this.save()
        }
    }

    subremoveV(sub, value) {
        if (sub && value && this.data[sub]) {
            this.data[sub].removeV(value)
            this.save()
        }
    }
}

// Loading Data \\

if (!fs.existsSync("./data")) {
    log(logLevel.info, "Data Directory Not Found; Creating...")
    fs.mkdirSync("./data")
}

files.forEach(fileInfo => {
    data[fileInfo.name] = new DataFile(fileInfo)
})