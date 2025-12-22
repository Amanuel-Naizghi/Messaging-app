const express = require('express');
const app = express();
const path = require('node:path');
const router = require('./router/userRouter');

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Your app is running on port ${PORT}`);
})