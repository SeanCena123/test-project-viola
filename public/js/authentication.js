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

let inputEmailsignup = document.getElementById("inputEmailsign");
let inputPasswordsignup = document.getElementById("inputPasswordsign");
function signup() {
    email = inputEmailsignup.value
    password = inputPasswordsignup.value
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        console.log("created an account")
    })
    email = ''
    password = ''
    event.preventDefault();
}

function signout() {
    auth.signOut()
    event.preventDefault();
}

let inputEmailsignin = document.getElementById("inputEmail");
let inputPasswordsignin = document.getElementById("inputPassword");
function signin() {
    email = inputEmailsignin.value
    password = inputPasswordsignin.value
    auth.signInWithEmailAndPassword(email, password).then(cred => {
    })
    event.preventDefault();
}

auth.onAuthStateChanged(user => {
    if (user) {
        console.log("user signed in")
        console.log(user)
    } else {
        console.log("user has signed out")
    }
});

socket.emit('connections', 'value');
