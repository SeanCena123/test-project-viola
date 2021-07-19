const express = require('express')

require('dotenv').config();
const path = require('path')
const PORT = process.env.PORT
var app = express();
var firebase = require('firebase/app');

// Add the Firebase products that you want to use
require("firebase/auth");
require('firebase/database');
require("firebase/firestore");

var admin = require('firebase-admin');

var config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
  measurementId: process.env.MEASUREMENTID
};
firebase.initializeApp(config);
admin.initializeApp(config);

app.use(express.static('public'));

var server = app.listen(PORT, function() {
	console.log('Our app is running on http://localhost:' + PORT);
});

function boyer_moore_horspool(haystack, needle) {
    var badMatchTable = {};
    var maxOffset = haystack.length - needle.length;
    var offset = 0;
    var last = needle.length - 1;
    var scan;
  
    if (last < 0) return 0

    for (var i = 0; i < needle.length - 1; i++) {
        badMatchTable[needle[i]] = last - i;
    }

    while (offset <= maxOffset) {
        for (scan=last; needle[scan] === haystack[scan+offset]; scan--) {
            if (scan === 0) {
              return offset;
            }
        }
        offset += badMatchTable[haystack[offset + last]] || last || 1;
    }
    return -1;
}


function merge(arr){
    if(arr.length <= 1) return arr;
    let mid = Math.floor(arr.length/2);
    let left = merge( arr.slice(0, mid));
    let right = merge(arr.slice(mid))
        function mergeSort(arr1, arr2) {
          let result = [];
          let i=0;
          let j=0;
          while(i < arr1.length && j < arr2.length) {
            if(arr1[i][1] > arr2[j][1]){
              result.push(arr1[i])
              i++;
            } else {
              result.push(arr2[j])
              j++;
            }
          }
         while(i < arr1.length) {
            result.push(arr1[i])
            i++;
         }
         while(j < arr2.length){
            result.push(arr2[j])
            j++;
         }    
          return result
      }
    return mergeSort(left,right)
}

function textbold(haystack, needle) {
  var badMatchTable = {};
  var maxOffset = haystack.length - needle.length;
  var offset = 0;
  var last = (needle.length -1);
  var scan;
  var array = []

  if (last < 0) return [array]

  for (var i = 0; i < needle.length - 1; i++) {
      badMatchTable[needle[i]] = last - i;
  }

  while (offset <= maxOffset) {
      for (scan=last; needle[scan] === haystack.toLowerCase()[scan+offset]; scan--) {
          if (scan === 0) {
            array.push(offset);
          }
      }
      offset += badMatchTable[haystack.toLowerCase()[offset + last]] || last || 1;
  }

  var position = needle.length
  var a = haystack
  var b = `<b style="color:darkcyan;">`
  var c = `</b>`
  var carr = [...array]

  for (var i = 0; i < carr.length; i++) {
      a = [a.slice(0, carr[i]+position), c, a.slice(carr[i]+position)].join(''); 
      a = [a.slice(0, carr[i]), b, a.slice(carr[i])].join('');
      if (carr[i+1] != null) {
          carr[i+1] = carr[i+1]+(((b.length)+(c.length))*(i+1)) 
      }
  }
  return a
}

var datareqstore;
var io = require('socket.io')(server);

io.on('connection', function(socket) {
	console.log("User: "+socket.id+", Connected.");

  socket.on('active', function(data) {
    var ref = firebase.database().ref("users/ada");
    ref.update({
       onlineState: true,
       status: "I'm online."
    });
  });

  socket.on('signup', async function(data) {
    console.log(data)
    const secondsSinceEpoch = Math.round(Date.now() / 1000)
    var ref = firebase.database().ref(`user-data/user-info/${data[0]}`);
    ref.update({
      year: data[1],
      first: data[2],
      last: data[3],
      email: data[4],
      s1: data[5],
      s2: data[6],
      s3: data[7],
      s4: data[8],
      s5: data[9],
      account: "student",
      creation: secondsSinceEpoch
    });

  });

  socket.once('signinsocket', async function (data) {
    socket.emit('signinsocket', "value");
  });

  socket.once('signin', async function(data) {
    var count;
    var ref = firebase.database().ref('user-data/user-collect/'+data+"/login-history");
    await ref.once("value", (snapshot) => {
        count = snapshot.numChildren();
    });
    var refuser = firebase.database().ref('user-data/user-collect/'+data+"/login-history/"+count);
    const secondsSinceEpoch = Math.round(Date.now() / 1000)
    refuser.set({
      time: secondsSinceEpoch
    });
  });

  socket.once('content', async function(data) {
    var uid;
    await admin.auth().verifyIdToken(data[0]).then((decodedToken) => {
      uid = decodedToken.uid;
      var myDate2 = new Date((decodedToken.iat)*1000);
      var myDate = new Date((decodedToken.exp)*1000);
      console.log(myDate2.toLocaleString())
      console.log(myDate.toLocaleString())
      console.log(uid)
    }).catch((error) => {
      return console.log(error.message)
    });
    switch(data[1]) {
      case 0: //signin content
        var ref = firebase.database().ref('content/signin');
        ref.once('value', function(snapshot) {
          return socket.emit('content', [snapshot.val(), uid])
        });
      break;
      case 1: //signup content
        var ref = firebase.database().ref('content/signup');
        ref.once('value', function(snapshot) {
          return socket.emit('content', [snapshot.val(), uid])
        });
      break;
      case 2: //database content
        var ref = firebase.database().ref('content/database');
        ref.once('value', function(snapshot) {
          return socket.emit('content', [snapshot.val(), uid])
        });
      break;
      case 3: //question content
      var ref = firebase.database().ref('content/question');
      ref.once('value', function(snapshot) {
        return socket.emit('content', [snapshot.val(), uid])
      });
    break;
    }
  });

  var arrtext;
	socket.on('search', async function(data) {
    arrtext = data[0];
    var count;
    var ref = firebase.database().ref(`user-data/user-collect/${data[1]}/search-history`);
    await ref.once("value", (snapshot) => {
        count = snapshot.numChildren();
    });
    var refuser = firebase.database().ref(`user-data/user-collect/${data[1]}/search-history/`+count);
    const secondsSinceEpoch = Math.round(Date.now() / 1000)
    refuser.update({
      search: data[2],
      time: secondsSinceEpoch
    });
    console.log("searching...")
		arrres = []
		var ref1 = await firebase.database().ref('db-bank/');
		await ref1.once('value', function(snapshot) {
			snapshot.forEach(function(_child) {
				var society = _child.key;
				var temp = [society]
				var counter = 0
				for (var i = 0; i < arrtext.length; i++) {
					var result = boyer_moore_horspool(society.toLowerCase(), arrtext[i])
					if (result != -1) {
						counter +=1
					}
				}
				temp.push(counter)
        if (temp[1] > 0) {
          arrres.push(temp)
        }
				temp = []
			});
		});
		arrres = merge(arrres)
		console.log("page ranking shown.");
		socket.emit('search', arrres)

	});

	socket.on('arrayreq', async function(data) {
    var count;
    var string = '';
    var ref = firebase.database().ref(`user-data/user-collect/${data[1]}/question-history`);
    await ref.once("value", (snapshot) => {
        count = snapshot.numChildren();
    });
    var refuser = firebase.database().ref(`user-data/user-collect/${data[1]}/question-history/`+count);
    const secondsSinceEpoch = Math.round(Date.now() / 1000);
    for (var i = 0; i < data[0].length; i++) {
      if ((i == 6) || (i == 11) || (i == 4) || (i == 8) || (i == 2) || (i == 7) || (i == 3)) {
        string += ` ${data[0][i]} `;
      }
    }
    refuser.update({
      search: string,
      time: secondsSinceEpoch
    });
    datareqstore = data[0]
  });
  socket.on('arrayrec', async function(data) {
    socket.emit('arrayrec', datareqstore)
  });

	socket.on('butinfo', async function(data) {
    var array = []
    for (var i = 0; i < data[0][((data[1])-1)].length; i++) {
      var ref1 = await firebase.database().ref('db-bank/'+data[0][(data[1]-1)][i]);
      await ref1.once('value', function(snapshot) {
        var temp = []
        snapshot.forEach(function(_child) {
          temp.push(_child.val())
        });
        
        var string = temp[0]
        if(typeof String.prototype.replaceAll == "undefined") {
          String.prototype.replaceAll = function(match, replace) {
            return this.replace(new RegExp(match, 'g'), () => replace);
          }
        }
        string = string.replaceAll('<br>', '');
        for (var j = 0; j < arrtext.length; j++) {
          string = textbold(string, arrtext[j])
        }
        temp.push(string)

        array.push(temp)
      });
    }
    socket.emit('butinfo', array)
	});

});


app.get('/login', async function(req, res) {
	res.render('login');
});

app.get('/database', async function(req, res) {
	res.render('index');
});

app.get('/signup', async function(req, res) {
	res.render('signup');
});

app.get('/account', async function(req, res) {
	res.render('account');
});

app.get('/content', async function(req, res) {
	res.render('content');
});

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); 
app.get('/', function(req, res) {
	res.render('signup', { 
		title: 'Name',
	});
});