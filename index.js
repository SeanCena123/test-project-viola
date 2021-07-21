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
const { TIMEOUT } = require('dns');

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

var io = require('socket.io')(server);

io.on('connection', function(socket) {
	console.log("User: "+socket.id+", Connected.");

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

  //This is used to store when the user logs in
  socket.on('signinsocket', async function (data) {
    await socket.emit('signinsocket', "value");
    console.log("sent signinsocket")
  });

  socket.once('signin', async function(data) {
    console.log("sent signinsocket")
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

  socket.on('subjectdropdown', async function(data) {
    switch (data) {
      case "Physics":
        socket.emit('subjectdropdown', ['None', 'Special Relativity', 'Waves'])
      break;
      case "Methods":
        socket.emit('subjectdropdown', ['None', 'Polynomial', 'Linear'])
      break;
      case "Chemistry":
        socket.emit('subjectdropdown', ['None', 'Electrochemical', 'Cells'])
      break;
      case "Further":
        socket.emit('subjectdropdown', ['None', 'Regression', 'Trigonometry'])
      break;
      default:
        socket.emit('subjectdropdown', ['None'])
      break;
    }
  });

  socket.on('content', async function(data) {
    console.log("content")
    var uid;
    await admin.auth().verifyIdToken(data[0]).then((decodedToken) => {
      uid = decodedToken.uid;
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

        var subjects = [];
        var refsub = firebase.database().ref('user-data/user-info/'+data[2]);
        await refsub.once('value', function(snapshot) {
          snapshot.forEach(function(_child) {
            if (((_child.key)[0] == 's') && ((_child.key).length == 2)) {
              subjects.push(_child.val())
            }
          });
        });

        var string = ''
        for (var i = 0; i < subjects.length; i++) {
          string += await `<a class="dropdown-item btn-sm" href="#" onclick='dropdowntagfilter("${subjects[i]}", 0)'>${subjects[i]}</a>`
        }
        ref.once('value', function(snapshot) {
          return socket.emit('content', [snapshot.val(), uid, string])
        });
      break;
      case 3: //question content
      var ref = firebase.database().ref('content/question');
      ref.once('value', function(snapshot) {
        return socket.emit('content', [0, snapshot.val(), uid])
      });
      break;
      case 4: //when clicking to delete a solution
      var refuser = firebase.database().ref('db-bank/'+data[3]+'/solutions/'+data[2]); 
      refuser.once('child_added', function(snapshot) {
        return snapshot.ref.remove();
      });
      break;
      case 5: //when clicking to add a solution
      console.log("entered")
      var refuser = firebase.database().ref('user-data/user-info/'+data[2].uid+"/account");
      var first = firebase.database().ref('user-data/user-info/'+data[2].uid+"/first");
      var last = firebase.database().ref('user-data/user-info/'+data[2].uid+"/last");
      var solutions = firebase.database().ref('db-bank/'+data[4]+'/solutions');

      refuser.once('value', async function(snapshot) {
        var username = ''
        var account;
        if (snapshot.val() == "Teacher") {
          var today = new Date();
          var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
          await first.once('value', function(first) {
            username += first.val()
          });
          await last.once('value', function(last) {
            username += " "+last.val()
          });
          account = snapshot.val()
  
          var dataset = [date, username, account, data[3], data[2].uid]
  
          solutions.push({
            date: dataset[0],
            name: dataset[1],
            accounttype: dataset[2],
            URL: dataset[3],
            uid: dataset[4]
          });
        }
      });
      break;
      case 6:
        var refuser = firebase.database().ref('user-data/user-info/'+data[2].uid+"/account");

        var first = firebase.database().ref('user-data/user-info/'+data[2].uid+"/first");
        var last = firebase.database().ref('user-data/user-info/'+data[2].uid+"/last");
        var dataset;
        var username = ''
        var account;
    
        refuser.once('value', async function(snapshot) {
          if (snapshot.val() == "Teacher") {
            var today = new Date();
            var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
            await first.once('value', function(first) {
              username += first.val()
            });
            await last.once('value', function(last) {
              username += " "+last.val()
            });
            account = snapshot.val()
    
            dataset = [date, username, account]
            socket.emit('content', [1, dataset])
          }
        });
      break;
    }
  });

  // socket.on('tableactivity1', async function(data) {
  //   var refuser = firebase.database().ref('user-data/user-info/'+data.uid+"/account");

  //   var first = firebase.database().ref('user-data/user-info/'+data.uid+"/first");
  //   var last = firebase.database().ref('user-data/user-info/'+data.uid+"/last");
  //   var dataset;
  //   var username = ''
  //   var account;

  //   refuser.once('value', async function(snapshot) {
  //     if (snapshot.val() == "Teacher") {
  //       var today = new Date();
  //       var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
  //       await first.once('value', function(first) {
  //         username += first.val()
  //       });
  //       await last.once('value', function(last) {
  //         username += " "+last.val()
  //       });
  //       account = snapshot.val()

  //       dataset = [date, username, account]
  //       socket.emit('tableactivity1', dataset)
  //     }
  //   });
  // });

  socket.on('tabledata', async function(data) {
    var ref = firebase.database().ref('content/teacher/addnewbutton');
    var refuser = firebase.database().ref('user-data/user-info/'+data+"/account");
    refuser.once('value', function(snapshot) {
      if (snapshot.val() == "Teacher") {
        ref.once('value', function(data) {
          return socket.emit('tabledata', [data.val(), 1])
        });
      } else {
        ref.once('value', function(data) {
          return socket.emit('tabledata', [data.val(), 0])
        });  
      }
    });
  });

  // socket.on('questionsub', async function(data) {
  //   var refuser = firebase.database().ref('user-data/user-info/'+data[0].uid+"/account");
  //   var first = firebase.database().ref('user-data/user-info/'+data[0].uid+"/first");
  //   var last = firebase.database().ref('user-data/user-info/'+data[0].uid+"/last");
  //   var solutions = firebase.database().ref('db-bank/'+data[2]+'/solutions');
  //   // var count = 0;
  //   // await solutions.once("value", (snapshot) => {
  //   //   count = snapshot.numChildren();
  //   // });

  //   refuser.once('value', async function(snapshot) {
  //     var username = ''
  //     var account;
  //     if (snapshot.val() == "Teacher") {
  //       var today = new Date();
  //       var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
  //       await first.once('value', function(first) {
  //         username += first.val()
  //       });
  //       await last.once('value', function(last) {
  //         username += " "+last.val()
  //       });
  //       account = snapshot.val()

  //       var dataset = [date, username, account, data[1], data[0].uid]

  //       // var refsol = firebase.database().ref('db-bank/'+data[2]+'/solutions/');
  //       solutions.push({
  //         date: dataset[0],
  //         name: dataset[1],
  //         accounttype: dataset[2],
  //         URL: dataset[3],
  //         uid: dataset[4]
  //       });
  //     }
  //   });
  // });

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

    var subjects = [];
    var refsub = firebase.database().ref('user-data/user-info/'+data[1]);
    await refsub.once('value', function(snapshot) {
      snapshot.forEach(function(_child) {
        if (((_child.key)[0] == 's') && ((_child.key).length == 2)) {
          subjects.push(_child.val())
        }
      });
    });

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
          for (var j = 0; j < subjects.length; j++) {
            var result = boyer_moore_horspool(society.toLowerCase(), subjects[j].toLowerCase())
            if (result != -1) {
              arrres.push(temp)
              break;
            }
          }

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
  });

	socket.on('butinfo', async function(data) {
    var array = []
    var mysol;
    var dataset = [];
    for (var i = 0; i < data[0][0][((data[0][1])-1)].length; i++) {

      var ref1 = firebase.database().ref('db-bank/'+data[0][0][(data[0][1]-1)][i]);
      await ref1.once('value', function(snapshot) {
        var temp = []
        var count = 0;
        snapshot.forEach(function(_child) {
          count++
          if ((count == 7) && (typeof _child.val() !== 'object')) {
            temp.push([])
            temp.push([])
          }
          mysol = [];
          if ((count == 7) && (typeof _child.val() === 'object')) {
            var temparr = [];
            var dataset;
            var mysol = []
            _child.forEach(function(arr) {
              dataset = [arr.key, arr.val().URL, arr.val().accounttype, arr.val().date, arr.val().name]
              if (data[1] === arr.val().uid) {
                temparr.push(arr.key)
              }
              mysol.push(dataset)
            });
            console.log(temparr)
            temp.push(temparr)
            temp.push(mysol)
          } else {
            temp.push(_child.val()) 
          }
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
        temp.push(data[0][0][(data[0][1]-1)][i])
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