const express = require("express");
const app = express();
app.get('/', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send('111');
})
app.listen(3000);