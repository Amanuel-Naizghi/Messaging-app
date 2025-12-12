const express = require('express');
const app = express();
const path = require('node:path');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get('/', (req,res) => {
    res.render("test",{testing:"Testing connection"})
})

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Your app is running on port ${PORT}`);
})