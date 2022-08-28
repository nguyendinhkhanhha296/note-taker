const notes = require('express').Router();
const fs = require('fs');
const util = require('util');
const readFromFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
let parsedData;

// GET Route for retrieving all the notes
notes.get('/', (req, res) =>
    readFromFile('./db/db.json').then((data) => {
        parsedData = JSON.parse(data);
        res.json(parsedData)
    })
);

// POST Route for submitting note
notes.post('/', (req, res) => {
    readFromFile("db/db.json", "utf8").then(function (data) {

        // Destructuring assignment for the items in req.body
        parsedData = JSON.parse(data);

        // Variable for the object we will save
        const newNote = req.body;
        const currentID = parsedData.length;

        newNote.id = currentID + 1;

        parsedData.push(newNote);
        parsedData = JSON.stringify(parsedData);

        writeFile("db/db.json", parsedData).then(function () {
            console.log("Note has been added.");
        });

        res.json(parsedData);
    })
});

// DELETE request
notes.delete("/:id", (req, res) => {
    let ID = parseInt(req.params.id);
    //  Read JSON file
    for (let i = 0; i < parsedData.length; i++) {
        if (ID === parsedData[i].id) {
            parsedData.splice(i, 1);
            let noteJSON = JSON.stringify(parsedData, null, 2);

            writeFile("db/db.json", noteJSON).then(function () {
                console.log("Note has been deleted.");
            });
        }
    }
    res.json(parsedData);
});

module.exports = notes;
