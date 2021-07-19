var socket = io.connect({secure: true}); 

var viewfiles;
var sourcepaperpdf;

var viewfilessolution;
var sourcesolutionpdf;

var viewfileswritten;
var sourcewritten;

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
            if (data[1] == user.uid) {
                content.innerHTML = data[0]
                viewfiles = document.getElementById("viewfiles")
                sourcepaperpdf = document.getElementById("sourcepaperpdf"); //'Examination Paper' Content ***

                viewfilessolution = document.getElementById("viewfilessolution")
                sourcesolutionpdf = document.getElementById("sourcesolutionpdf")

                viewfileswritten = document.getElementById("viewfileswritten");
                sourcewritten = document.getElementById("sourcewritten")
                console.log("user signed in")
                console.log(user)
                
                var questiondata = localStorage.getItem("questiondata");
                questiondata = (questiondata) ? JSON.parse(questiondata) : [];

                examcontent.innerHTML = `${questiondata[6]} ${questiondata[11]} Examination Paper`
                titlecontent.innerHTML = `${questiondata[6]} | ${questiondata[11]} | ${questiondata[3]} | ${questiondata[8]} | ${questiondata[4]} | Q${questiondata[2]} | ${questiondata[7]}`
                descriptioncontent.innerHTML = questiondata[0]
        
                viewfiles.onclick = function changeContent() {
                    if (sourcepaperpdf.innerHTML == "") {
                        content1 = datareqstore[1];
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
        
                viewfilessolution.onclick = function changeContent() {
                    if (sourcesolutionpdf.innerHTML == "") {
                        content2 = datareqstore[5];
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
        
                viewfileswritten.onclick = function changeContent() {
                    if (sourcewritten.innerHTML == "") {
                        content3 = datareqstore[10];
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
