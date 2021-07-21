var socket = io.connect({secure: true}); 

var viewfiles;
var sourcepaperpdf;

var viewfilesvideo;
var sourcevideo;

var viewfileswritten;
var sourcewritten;

var viewfilesexternalexplain;
var sourceexternalwritten;
var cellbody;
var addnew;

var viewfilessolution;
var sourcesolutionpdf;

var config = {
    apiKey: "AIzaSyBhMXBMkDgf5rmg6XEpRllsGCalgdoxQtk",
    authDomain: "test-project-899c2.firebaseapp.com",
    databaseURL: "https://test-project-899c2-default-rtdb.firebaseio.com",
    projectId: "test-project-899c2",
    storageBucket: "test-project-899c2.appspot.com",
    messagingSenderId: "200667215684",
    appId: "1:200667215684:web:3d03b2275c1c664bfa0911",
    measurementId: "G-PTDY828H1D"
};
firebase.initializeApp(config);
firebase.analytics();
const auth = firebase.auth();

// document.getElementById('homeBody').style.visibility = "hidden";
var content = document.getElementById("content")
auth.onAuthStateChanged(user => {
    if (user) {
        firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
            socket.emit('content', [idToken, 3])  
        }).catch((error) => {
            console.log(error.code)
            auth.signOut()
        });

        socket.on('content', function(data) {
            if ((data[2] == user.uid) && (data[0] == 0)) {
                content.innerHTML = data[1]
                viewfiles = document.getElementById("viewfiles")
                sourcepaperpdf = document.getElementById("sourcepaperpdf"); //'Examination Paper' Content ***

                viewfilesvideo = document.getElementById("viewfilesvideo");
                sourcevideo = document.getElementById("sourcevideo")

                viewfileswritten = document.getElementById("viewfileswritten");
                sourcewritten = document.getElementById("sourcewritten")

                viewfilesexternalexplain = document.getElementById("viewfilesexternalexplain");
                sourceexternalwritten = document.getElementById("sourceexternalwritten")

                viewfilessolution = document.getElementById("viewfilessolution")
                sourcesolutionpdf = document.getElementById("sourcesolutionpdf")

                console.log("user signed in")
                console.log(user)
                
                var questiondata = localStorage.getItem("questiondata");
                questiondata = (questiondata) ? JSON.parse(questiondata) : [];
                console.log(questiondata)

                examcontent.innerHTML = `${questiondata[8]} ${questiondata[13]} Examination Paper`
                titlecontent.innerHTML = `${questiondata[8]} | ${questiondata[13]} | ${questiondata[3]} | ${questiondata[10]} | ${questiondata[4]} | Q${questiondata[2]} | ${questiondata[9]}`
                descriptioncontent.innerHTML = questiondata[0]
        
                viewfiles.onclick = function changeContent() {
                    if (sourcepaperpdf.innerHTML == "") {
                        content1 = questiondata[1];
                        var hr = document.createElement("hr");
                        hr.style = "width: 30%; margin-right: 1000px; height: 0.5px; "
                        sourcepaperpdf.appendChild(hr)
        
        
                        var iframeexam = document.createElement("iframe");
                        iframeexam.id = "frameofquestion";
                        iframeexam.style = "width: 690px; height: 1000px; margin-left: 20px; margin-top: 5px; outline: 5px #31b08f; outline-style: outset;'"
                        iframeexam.src = content1;	
                        sourcepaperpdf.innerHTML = '';	   	
                        sourcepaperpdf.appendChild(iframeexam)
                        return 0	
                    } else {
                        sourcepaperpdf.innerHTML = "";
                    }
                }

                viewfilesvideo.onclick = function changeContent() {
                    if (sourcevideo.innerHTML == "") {
                        if (questiondata[11] == "value") {
                            content3 = "There is currently no video model answer. Please come back later.";
                        } else {
                            content3 = questiondata[11];
                        }
                        var p1 = document.createElement("p");
                        p1.style = "margin-left: 20px; font-size: 125%;";
                        p1.innerHTML = content3;
                        sourcevideo.innerHTML = '';	
                        sourcevideo.appendChild(p1);
                        return 0	
                    } else {
                        sourcevideo.innerHTML = "";
                    }
                }

                viewfileswritten.onclick = function changeContent() {
                    if (sourcewritten.innerHTML == "") {
                        if (questiondata[12] == "value") {
                            content3 = "There is currently no written model answer. Please come back later.";
                        } else {
                            content3 = questiondata[12];
                        }
                        var p1 = document.createElement("p");
                        p1.style = "margin-left: 20px; font-size: 125%;";
                        p1.innerHTML = content3;
                        sourcewritten.innerHTML = '';	
                        sourcewritten.appendChild(p1);
                        
                        var script = document.createElement('script');
                        script.type = "text/javascript";
                        script.charset = "utf-8";
                        script.src = "js/jqmath-etc-0.4.6.min.js"; 
                        document.getElementsByTagName("head")[0].appendChild(script);
                        return 0	
                    } else {
                        sourcewritten.innerHTML = "";
                    }
                }

                viewfilesexternalexplain.onclick = function changeContent() {
                    if (sourceexternalwritten.innerHTML == "") {
                        sourceexternalwritten.innerHTML = `            <div class="container-lg">              <div class="table-responsive">                  <div class="table-wrapper">                      <div class="table-title">                          <div class="row">                              <div class="col-sm-8"><h2><b>Teacher & Tutor Solutions</b></h2></div>                              <div class="col-sm-4" id="addnew"></div>                          </div>                      </div>                      <table class="table table-bordered">                          <thead>                              <tr>                                  <th>Date</th>                                  <th>Name</th>                                  <th>Account Type</th>                                  <th>URL</th>                                  <th>Actions</th>                              </tr>                          </thead>                          <tbody id="cellbody"></tbody>                      </table>                  </div>              </div>          </div>`;
                        cellbody = document.getElementById("cellbody");
                        addnew = document.getElementById("addnew");
                            
                        function addcellbody(date, username, accounttype, url, num, value) {
                            if (num) {
                                var celladd = `<tr><td>${date}</td><td>${username}</td><td>${accounttype}</td><td><a style="color: #3871E0;" href="${url}" target="_blank">Solution</a></td>                                  <td>                                      <a class="add" title="Add" data-toggle="tooltip"><i class="material-icons">&#xE03B;</i></a>                                      <a class="delete" title="Delete" data-toggle="tooltip" id="${value}"><i class="material-icons">&#xE872;</i></a></td></tr>`    
                            } else {
                                var celladd = `<tr><td>${date}</td><td>${username}</td><td>${accounttype}</td><td><a style="color: #3871E0;" href="${url}" target="_blank">Solution</a></td></tr>`
                            }
                            cellbody.innerHTML += celladd
                        }
                        
                        function runtable() {
                            var script = document.createElement("script");
                            script.type = "text/javascript";
                            script.src = "js/table.js"; 
                            document.getElementById("homeBody").appendChild(script);
                            return false;
                        }

                        socket.emit('tabledata', user.uid)

                        socket.on('tabledata', async function(data) {
                            if (data[1]) {
                                var addnewbut = await data[0]
                                addnew.innerHTML = addnewbut   
                                if (questiondata[6].length > 0) {
                                    for (var j = 0; j < questiondata[7].length; j++) {
                                        for (var i = 0; i < questiondata[6].length; i++) {
                                            if (questiondata[6][i] == questiondata[7][j][0]) {
                                                addcellbody(questiondata[7][j][3], questiondata[7][j][4], questiondata[7][j][2], questiondata[7][j][1], 1, questiondata[7][j][0])
                                                break;
                                            } 
                                            if (i == (questiondata[6].length-1)) {
                                                addcellbody(questiondata[7][j][3], questiondata[7][j][4], questiondata[7][j][2], questiondata[7][j][1], 0, questiondata[7][j][0])
                                            }
                                        }
                                    } 
                                } else {
                                    for (var i = 0; i < questiondata[7].length; i++) {
                                        addcellbody(questiondata[7][i][3], questiondata[7][i][4], questiondata[7][i][2], questiondata[7][i][1], 0, questiondata[7][i][0])
                                    }
                                }
                            } else {
                                for (var i = 0; i < questiondata[7].length; i++) {
                                    addcellbody(questiondata[7][i][3], questiondata[7][i][4], questiondata[7][i][2], questiondata[7][i][1], 0, questiondata[7][i][0])
                                }
                            }
                            runtable()
                        });
                    } else {
                        sourceexternalwritten.innerHTML = "";
                    }
                }

                viewfilessolution.onclick = function changeContent() {
                    if (sourcesolutionpdf.innerHTML == "") {
                        content2 = questiondata[5];
                        var hr = document.createElement("hr");
                        hr.style = "width: 30%; margin-right: 1000px; height: 0.5px; "
                        sourcesolutionpdf.appendChild(hr)
                        
                        var iframesolution = document.createElement("iframe")
                        iframesolution.id = "frameofquestion";
                        iframesolution.style = "width: 690px; height: 1000px; margin-left: 20px; margin-top: 5px; outline: 5px #31b08f; outline-style: outset;'"
                        iframesolution.src = content2;
                        
                        sourcesolutionpdf.innerHTML = '';	
                        sourcesolutionpdf.appendChild(iframesolution)
                        return 0	
                    } else {
                        sourcesolutionpdf.innerHTML = "";
                    }
                }

            } else {
                document.getElementById('homeBody').innerHTML = " Decoding Firebase ID token failed. Make sure you create an account and login to get a valid token. <br> Visit: ___/signup.";
                document.getElementById('homeBody').style.visibility = "visible";
                console.log("user has signed out")
            }
        });
    } else {
        document.getElementById('homeBody').innerHTML = " Decoding Firebase ID token failed. Make sure you create an account and login to get a valid token. <br> Visit: ___/signup.";
        document.getElementById('homeBody').style.visibility = "visible";
        console.log("user has signed out")
        // window.location.href = "/";
    }
});
