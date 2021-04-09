const generateUniqueId = require('generate-unique-id');

const express = require('express');
const { get } = require('https');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3500;

notes = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', (err, data) => {
        if (err) throw err;
        let note = JSON.parse(data);
        //console.log(note);
        res.json(note);
    });
    // res.json(notes);
});

app.post("/api/notes", (req, res) => {
    // console.log(req.body)
    let note = req.body;
    note.id = generateUniqueId({length: 16, useLetters: true});
    notes.push(note);
    console.log(notes);
    res.json(note);
    let writeStream = fs.createWriteStream('db/db.json');
    writeStream.write(JSON.stringify(notes), 'utf8');
    writeStream.on('finish', () => {
      console.log('wrote all data to file');
    });
}) 

//delete
app.delete("/api/notes/:id", (req, res) => {
    let id;
    console.log(req.params.id);
    fs.readFile('db/db.json', (err, data) => {
        if (err) throw err;
        let note = JSON.parse(data);
        for (i=0; i<notes.length; i++) {
            if (req.params.id === notes[i].id) {
                notes.splice(i,1);
            }
        }
        for (i=0; i<note.length; i++) {
            if (req.params.id === note[i].id) {
                note.splice(i,1);
            }
        }
        fs.writeFile('db/db.json', JSON.stringify(note), function (err) {
            if (err) return console.log(err);
            console.log(note);
          });
    });
    res.end();
})

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));