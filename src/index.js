const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});