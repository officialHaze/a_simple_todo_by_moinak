

const express = require('express');

const app = express();

app.use(express.static('function'));

app.get('/', function(req, res){
    res.sendFile(__dirname+'/list.html');
});



















app.listen(process.env.PORT || 5000, function(){
    console.log("server running on port 5000");
});