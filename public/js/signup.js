var socket = io.connect({secure: true}); 

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

let dropdownYearLeveltopic;
let inputFirstsign;
let inputLastsign;
let inputEmailsignup;
let inputPasswordsignup;

let dropdowns1topic;
let dropdowns2topic;
let dropdowns3topic;
let dropdowns4topic;
let dropdowns5topic;

let errorplacementsignup;

var content = document.getElementById("content")
document.getElementById("signupbody").style.visibility='hidden'
auth.onAuthStateChanged(user => {
    if (user) {
        firebase.auth().currentUser.getIdToken(false).then(function(idToken) {
            socket.emit('content', [idToken, 1])  
        }).catch((error) => {
            console.log(error.code)
            auth.signOut()
        });

        socket.once('content', async function(data) {
            if (data[1] == user.uid) {
                console.log("user signed in")
                console.log(user)
                content.innerHTML = await data[0]
                document.getElementById("signupbody").style.visibility='visible'
            }
        });
    } else {
        console.log("user has signed out")
        document.getElementById("signupbody").style.visibility='visible'
        // content.innerHTML = `    <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top" style="outline: black; ">      <a class="navbar-brand" href="/" style="color: #31b08f;;"><b>VIOLA</b></a>      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">        <span class="navbar-toggler-icon"></span>      </button>          <div class="collapse navbar-collapse" id="navbarSupportedContent">        <ul class="navbar-nav mr-auto">          <li class="nav-item">            <a class="nav-link" href="/database" style="cursor: pointer">Database</a>          </li>          <li class="nav-item">            <a class="nav-link" href="#">About</a>          </li>        </ul>        <form class="form-inline my-2 my-lg-0">          <a class="btn my-2 my-sm-0" type="submit" style="color: white" href="/login">Account</a>        </form>      </div>    </nav>            <div class="text-center">        <form class="form-signup">          <h1 class="display-5" style="margin-bottom: 20px; font-size: 2.0rem;"> <b style="color: #31b08f;"> SIGN UP USERS </b></h1> <br>                 <select class="js-example-basic-single" name="state" style="width:100%" id="dropdownYearLeveltopic" value="None">          <option value="None">Year Level</option>          <option value="Year 11">Year 11</option>          <option value="Year 12">Year 12</option>        </select> <br> <br>            <center>          <label for="inputFirstsign" class="sr-only">First Name</label>          <input type="first" id="inputFirstsign" class="form-control text-center" style=" margin-bottom: 5px;" placeholder="First Name" required autofocus>        </center>            <center>          <label for="inputLastsign" class="sr-only">Last Name</label>          <input type="last" id="inputLastsign" class="form-control text-center" style=" margin-bottom: 5px;" placeholder="Last Name" required autofocus>        </center>            <center>          <label for="inputEmailsign" class="sr-only">Email address</label>          <input type="email" id="inputEmailsign" class="form-control text-center" style=" margin-bottom: 5px;" placeholder="Email address" required autofocus>        </center>            <center>          <label for="inputPasswordsign" class="sr-only">Password</label>          <input type="password" id="inputPasswordsign" class="form-control text-center" placeholder="Password" required>        </center><br>            <div style="display:inline-block; padding: 2px;">          <select class="js-example-basic-single" name="state" style="width:100%" id="dropdowns1topic" value="None">            <option value="None">Subject 1</option>            <option value="Physics">Physics</option>            <option value="Chemistry">Chemistry</option>            <option value="Specalist">Specalist</option>            <option value="Methods">Methods</option>            <option value="Further">Further</option>          </select>          <select class="js-example-basic-single" name="state" style="width:100%" id="dropdowns2topic" value="None">            <option value="None">Subject 2</option>            <option value="Physics">Physics</option>            <option value="Chemistry">Chemistry</option>            <option value="Specalist">Specalist</option>            <option value="Methods">Methods</option>            <option value="Further">Further</option>          </select>          <select class="js-example-basic-single" name="state" style="width:100%" id="dropdowns3topic" value="None">            <option value="None">Subject 3</option>            <option value="Physics">Physics</option>            <option value="Chemistry">Chemistry</option>            <option value="Specalist">Specalist</option>            <option value="Methods">Methods</option>            <option value="Further">Further</option>          </select>          <select class="js-example-basic-single" name="state" style="width:100%" id="dropdowns4topic" value="None">            <option value="None">Subject 4</option>            <option value="Physics">Physics</option>            <option value="Chemistry">Chemistry</option>            <option value="Specalist">Specalist</option>            <option value="Methods">Methods</option>            <option value="Further">Further</option>          </select>          <select class="js-example-basic-single" name="state" style="width:100%" id="dropdowns5topic" value="None">            <option value="None">Subject 5</option>            <option value="Physics">Physics</option>            <option value="Chemistry">Chemistry</option>            <option value="Specalist">Specalist</option>            <option value="Methods">Methods</option>            <option value="Further">Further</option>          </select>          <script>            $(document).ready(function() {              $('.js-example-basic-single').select2();            });          </script>        </div>                <br> <br>            <center>        <div>           <p id="errorplacementsignup" style="font-size: 13px; color: red;"></p>        </div>      </center>            <center>          <button class="btn btn-lg btn-success btn-block" type="submit" onclick="signup()">Confirm</button>        </center><br>                </form>      </div>    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-analytics.js"></script>  <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js"></script>  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>    <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>  <link rel="stylesheet" type="text/css" href="css/style.css" />    <script src="js/bootstrap.min.js"></script>  <script src="js/signup.js"></script>`
        dropdownYearLeveltopic = document.getElementById("dropdownYearLeveltopic")
        inputFirstsign = document.getElementById("inputFirstsign");
        inputLastsign = document.getElementById("inputLastsign");
        inputEmailsignup = document.getElementById("inputEmailsign");
        inputPasswordsignup = document.getElementById("inputPasswordsign");

        dropdowns1topic = document.getElementById("dropdowns1topic")
        dropdowns2topic = document.getElementById("dropdowns2topic")
        dropdowns3topic = document.getElementById("dropdowns3topic")
        dropdowns4topic = document.getElementById("dropdowns4topic")
        dropdowns5topic = document.getElementById("dropdowns5topic")

        errorplacementsignup = document.getElementById("errorplacementsignup")
    }
});

function signup() {
    errorplacementsignup.innerHTML = ""
    if ((dropdownYearLeveltopic.value == "None") || (inputFirstsign.value == "") || (inputLastsign.value == "") || (inputEmailsignup.value == "") || (inputPasswordsignup.value == "")) {
        event.preventDefault();
        return errorplacementsignup.innerHTML = "All fields must be entered in order to sign up."
    }
    var selection = [
        dropdowns1topic,
        dropdowns2topic,
        dropdowns3topic,
        dropdowns4topic,
        dropdowns5topic
    ]
    for (var i = 0; i < selection.length; i++) {
        if (selection[i].value == "None") {
            event.preventDefault();
            return errorplacementsignup.innerHTML = "You must fill in all subject dropdowns."
        }
        for (var j = i+1; j < selection.length; j++) {
            if (i != j) {
                if (selection[j].value == selection[i].value) {
                    event.preventDefault();
                    return errorplacementsignup.innerHTML = "You have chosen the same subject in one of the dropdowns."
                }
            }
        }
    }
    email = inputEmailsignup.value
    password = inputPasswordsignup.value
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log("created an account")
        var credentials = [cred.user.uid, dropdownYearLeveltopic.value, inputFirstsign.value, inputLastsign.value, inputEmailsignup.value, dropdowns1topic.value, dropdowns2topic.value, dropdowns3topic.value, dropdowns4topic.value, dropdowns5topic.value]
        socket.emit('signup', credentials)
        window.location.href = "/login";
    }).catch((error) => {
        event.preventDefault();
        return errorplacementsignup.innerHTML = error.message
    });
    event.preventDefault();
}