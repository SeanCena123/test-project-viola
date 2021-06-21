const express = require('express')
require('dotenv').config();
const path = require('path')
const PORT = process.env.PORT
var app = express();
var firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyBhMXBMkDgf5rmg6XEpRllsGCalgdoxQtk",
    authDomain: "test-project-899c2.firebaseapp.com",
    projectId: "test-project-899c2",
    storageBucket: "test-project-899c2.appspot.com",
    messagingSenderId: "200667215684",
    appId: "1:200667215684:web:3d03b2275c1c664bfa0911",
    measurementId: "G-PTDY828H1D"
};
firebase.initializeApp(firebaseConfig);

app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); 
app.get('/', function(req, res) {
	res.render('index', { 
		title: 'Name',
	});
});

var server = app.listen(PORT, function() {
	console.log('Our app is running on http://localhost:' + PORT);
});

var io = require('socket.io')(server);
io.on('connection', function(socket) {
  console.log("User: "+socket.id+", Connected.");
});
