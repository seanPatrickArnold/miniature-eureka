// Load dependencies
const express = require('express');
const { notes } = require('./db/db');
const path = require('path');
const db = require('./db/db');
const fs = require('fs');

// Boiler plate code to set up express.js backend
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Setup a get route to retrive db.json
app.get('/api/notes', (req, res) => {
    res.json(db);
});

// Setup post route to handle adding a note to db.json
app.post('/api/notes', (req, res) => {
    // if no data in req.body, send 400 error back
    if (!req.body) {
        res.status(400).send('There is no body.');
    } else {
        db.push({ title: req.body.title, text: req.body.text, id: req.body.id });
        fs.writeFileSync(
            path.join(__dirname, './db/db.json'),
            JSON.stringify(db, null, 2)
        );
        res.json(db);
    }
});
 // Setup delete route to remove a note based on the notes id
app.delete('/api/notes/:id', (req, res) => {
    // if no data in req.body, send 400 error back
    if (!req.params.id) {
        res.status(400).send('Invalid note id.');
    } else {
        const result = db.filter(note => note.id === req.params.id)[0];
        db.splice(db.indexOf(result), 1);
        fs.writeFileSync(
            path.join(__dirname, './db/db.json'),
            JSON.stringify(db, null, 2)
        );
        res.json(db);
    }
});

// Setup html routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});