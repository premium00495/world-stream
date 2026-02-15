// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDmZHJ0l9-WdjIccrGm9rt6jva5cQcvUKM",
  authDomain: "world-stream-895e6.firebaseapp.com",
  projectId: "world-stream-895e6",
  storageBucket: "world-stream-895e6.firebasestorage.app",
  messagingSenderId: "179269637013",
  appId: "1:179269637013:web:52a32a4564af7453a41c9c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Login function
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location = "dashboard.html";
    })
    .catch(err => alert(err.message));
}
