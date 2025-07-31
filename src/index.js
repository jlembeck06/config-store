const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Config Store API');
});

db.authenticate()
    .then(() => {
        console.log('Connected to PostgreSQL');
        return db.sync();
    })
    .then(() => {
        console.log('Database synchronized, starting server.');
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to DB');
        console.error(err);
    });
