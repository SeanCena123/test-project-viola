
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

let inputEmailsignin;
let inputPasswordsignin;
var welcome;
var signinbutton;
var signoutbutton;

var signinfunc;

var content = document.getElementById("content")
auth.onAuthStateChanged(user => {
    if (user) {
        // auth.signOut()
        handleSignedInUser(user)
        // firebase.auth().currentUser.getIdToken(false).then(function(idToken) {
        //     socket.emit('content', [idToken, 0])  
        // }).catch((error) => {
        //     console.log(error.code)
        //     auth.signOut()
        // });
        // socket.on('content', async function(data) {
        //     if (data[1] == user.uid) {
        //         console.log("user signed in")
        //         console.log(user)
        //         content.innerHTML = await data[0]
        //         signoutbutton = document.getElementById(`signoutbutton`)
        //         welcome = document.getElementById("welcome");
        //         welcome.innerHTML = `Welcome ${user.email}`;

        //         signoutbutton.onclick = async function() {
        //             console.log("You have signed out.")
        //             await auth.signOut()
        //             window.location.href = "/signup"; //REDIRECT TO HOMEPAGE WHEN HAVE ONE
        //             event.preventDefault();
        //         };

        //     }
        // });
        // socket.on('signinsocket', function (data) {
        //     socket.emit('signin', user.uid);
        // })
    } else {
        console.log("signed out.")
        content.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top" style="outline: black; ">          <a class="navbar-brand" href="/" style="color: #31b08f;;"><b>VIOLA</b></a>          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">            <span class="navbar-toggler-icon"></span>          </button>                  <div class="collapse navbar-collapse" id="navbarSupportedContent">            <ul class="navbar-nav mr-auto">              <li class="nav-item">                <a class="nav-link" href="/database" style="cursor: pointer">Database</a>              </li>              <li class="nav-item">                <a class="nav-link" href="#">About</a>              </li>            </ul>            <form class="form-inline my-2 my-lg-0">              <a class="btn my-2 my-sm-0" type="submit" style="color: white" href="/login">Account</a>            </form>          </div>        </nav>              <div class="text-center">          <form class="form-signup">            <h1 class="display-5" style="margin-bottom: 20px; font-size: 2.0rem;"> <b style="color: #31b08f;"> SIGN IN </b></h1> <br>                  <center>              <label for="inputEmail" class="sr-only">Email address</label>              <input type="email" id="inputEmail" class="form-control text-center" style=" margin-bottom: 5px;" placeholder="Email address" required autofocus>            </center>                  <center>              <label for="inputPassword" class="sr-only">Password</label>              <input type="password" id="inputPassword" class="form-control text-center" placeholder="Password" required>            </center><br>                  <center>            <div id="error-placement-login">                   </div>          </center><br>                  <center>              <button class="btn btn-lg btn-success btn-block" type="submit" id="signinbutton">Confirm</button>            </center><br>                  </form>          </div>          <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>          <link rel="stylesheet" type="text/css" href="css/style.css" />          <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js"></script>          <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-analytics.js"></script>          <script src="https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js"></script>          <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>          <script src="js/bootstrap.min.js"></script>          <script src="js/signin.js"></script>`
        inputEmailsignin = document.getElementById("inputEmail");
        inputPasswordsignin = document.getElementById("inputPassword");
        errorplacementlogin = document.getElementById("error-placement-login")
        signinbutton = document.getElementById("signinbutton")
        signinbutton.onclick = function() {
            event.preventDefault();
            signin()
        };
    }
});

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

const handleSignedInUser = function(user) {
    // Set session cookie
    console.log("getIdToken")
    user.getIdToken().then(function(idToken) {
      // Session login endpoint is queried and the session cookie is set.
      // CSRF token should be sent along with request.
      const csrfToken = getCookie('csrfToken')
      //RETURN BECUASE AFTER RES.END IN THE SERVER.JS OCCURS THEN IT GOES TO THE .THEN IN THIS FUNCTION.A
      return postIdTokenToSessionLogin('/sessionLogin', idToken, csrfToken)
        .then(function() {
          //REDIRECTS TO THE /PROFILE AFTER RES.END HAPPENS IN THE SERVER
          // Redirect to profile on success.
          window.location.assign('/profile');
        }, function(error) {
          // Refresh page on error.
          // In all cases, client side state should be lost due to in-memory
          // persistence.
          console.log("an error occured.")
        //   window.location.assign('/');
        });
    });
};

const postIdTokenToSessionLogin = function(url, idToken, csrfToken) {
    // POST to session login endpoint.
    console.log("postID")
    return $.ajax({
      type:'POST',
      url: url,
      data: {idToken: idToken, csrfToken: csrfToken},
      contentType: 'application/x-www-form-urlencoded'
    });
};

function signin() {
    errorplacementlogin.innerHTML = ""
    email = inputEmailsignin.value
    password = inputPasswordsignin.value
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
    auth.signInWithEmailAndPassword(email, password).then(function() {
        // await socket.emit('signinsocket', 'value')
    }).catch((error) => {
        errorplacementlogin.innerHTML = error.message
    });
}