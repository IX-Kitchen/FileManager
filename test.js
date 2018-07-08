const fs = require('fs');
const path = require('path');
const dir = "../test"

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

async function get(dir) {
    let files = await readDirectory(dir)
    let struct = []
    for (const element of files){
        let tempPath = path.resolve(dir, element)
        let newObject = {}
        if (await isDirectory(tempPath)) {
            let tempObj = await get(tempPath)
            newObject = {
                'name': element,
                'type': 'directory',
                'children': tempObj
            }
        } else {
            newObject = {
                'name': element,
                'type': 'file'
            }
        }
        await addObject(struct, newObject)
    };
    return struct
}

get(dir).then(struct => console.log("Final",JSON.stringify(struct))).catch(err => console.log(error))