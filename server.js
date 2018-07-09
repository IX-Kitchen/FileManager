'user strict'

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const bodyParser = require('body-parser');
const archiver = require('archiver');
const trash = require('trash');
const formidable = require('formidable')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

// Reuse express server
const server = require('http').createServer(app);
// Port
const port = process.env.PORT;

const dir = process.env.DIR

// CORS
app.use(cors())
// req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/test", function (req, res, next) {
    res.send("OK!")
});

app.get("/checkContent", function (req, res) {
    getDirectoryStructure(dir).then(result => {
        res.status(200).send(result)
    }).catch(err => {
        console.log(err);
        res.status(500).send(err)
    })
});

app.get("/show", (req, res) => {
    res.sendFile(req.query.path)
})

app.get("/download", (req, res, next) => {
    const dir = req.query.path
    let isDirectory = fs.lstatSync(dir).isDirectory()
    if (isDirectory) {
        let archive = archiver('zip', {});
        archive.on('error', function (err) {
            throw err;
        });
        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                console.log(err)
            } else {
                throw err;
            }
        });
        if (!fs.existsSync(dir)) {
            return next({ message: "Path to be downloaded does not exist" })
        }
        archive.directory(dir, false);
        archive.pipe(res)
        archive.finalize()
        res.header('Content-Type', 'application/zip');
        res.header('Content-Disposition', `attachment; filename=${path.basename(dir)}.zip`);
    } else {
        res.download(dir)
    }
})

app.post("/delete", (req, res, next) => {
    const dir = req.body.path
    let isDirectory = fs.lstatSync(dir).isDirectory()
    if (isDirectory) {
        trash(dir).then(() => {
            res.sendStatus(200)
        });
    } else {
        fs.unlink(dir, (err) => {
            if (err) throw next(err);
            res.sendStatus(200)
        });
    }
})

app.post("/upload", function (req, res, next) {
    var form = new formidable.IncomingForm()
    form.uploadDir = dir
    let tempPath
    form.on('field', function (name, value) {
        tempPath = path.resolve(dir,value)
    });
    form.on('end', function() {
        res.sendStatus(200)
    });
    form.on('file', function(field, file) {
        let temp = path.resolve(tempPath,file.name)
        fs.rename(file.path, path.resolve(tempPath,file.name))
    });
    form.on('error', function(err) {
        console.log(err)
        next(err)
    });
    form.parse(req)
});

app.post("/createFolder", (req, res, next) => {
    const tempPath = path.resolve(dir, req.body.path, req.body.name)
    fs.mkdir(tempPath, err => {
        if (err) console.log(err)
        next(err)
    })
})

// URL UI
app.use(express.static(__dirname + '/ui/build'));

// Last middleware - No response - 404
app.use(function (req, res, next) {
    res.status(404);
    res.send({ error: 'Route not defined' });
});

server.listen(port, async function () {
    console.log('Server listening at port %d', port);
});

const readDirectory = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, list) => {
            if (err) reject(err)
            resolve(list)
        })
    })
}

const isDirectory = (dir) => {
    return new Promise((resolve, reject) => {
        fs.stat(dir, (err, stats) => {
            if (err) reject(err)
            resolve(stats.isDirectory())
        })
    })
}

const addObject = (list, object) => {
    return new Promise((resolve, reject) => {
        list.push(object)
        resolve(list)
    })
}

async function getDirectoryStructure(dir) {
    let files = await readDirectory(dir)
    let struct = []
    for (const element of files) {
        let tempPath = path.resolve(dir, element)
        let newObject = {}
        if (await isDirectory(tempPath)) {
            let tempObj = await getDirectoryStructure(tempPath)
            newObject = {
                'name': element,
                'type': 'directory',
                'path': tempPath,
                'children': tempObj
            }
        } else {
            newObject = {
                'name': element,
                'type': 'file',
                path: tempPath
            }
        }
        await addObject(struct, newObject)
    };
    return struct
}