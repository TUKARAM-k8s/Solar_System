const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// 🟢 मँगोडीबी कनेक्शन (Modern Promise Syntax)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connection Successful ✅"))
.catch((err) => {
    console.log("MongoDB Connection Failed ❌");
    console.error(err);
});

var Schema = mongoose.Schema;

var dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});
var planetModel = mongoose.model('planets', dataSchema);

// 🟢 आधुनिक पद्धतीने फाईंड वन (Modern Async/Await Syntax)
app.post('/planet', async function(req, res) {
    try {
        const planetData = await planetModel.findOne({ id: req.body.id });
        if (!planetData) {
            return res.status(404).send("Planet not found");
        }
        res.send(planetData);
    } catch (err) {
        res.status(500).send("Error in Planet Data");
    }
});

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/os', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        "os": OS.hostname(),
        "env": process.env.NODE_ENV
    });
});

app.get('/live', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ "status": "live" });
});

app.get('/ready', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ "status": "ready" });
});

app.listen(3000, () => {
    console.log("Server successfully running on port - " + 3000);
});

module.exports = app;