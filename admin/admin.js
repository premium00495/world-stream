// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDmZHJ0l9-WdjIccrGm9rt6jva5cQcvUKM",
  authDomain: "world-stream-895e6.firebaseapp.com",
  projectId: "world-stream-895e6",
  storageBucket: "world-stream-895e6.firebasestorage.app",
  messagingSenderId: "179269637013",
  appId: "1:179269637013:web:52a32a4564af7453a41c9c"
};

firebase.initializeApp(firebaseConfig);

// Auth login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location = "dashboard.html";
    })
    .catch(err => alert(err.message));
}

// Logout
function logout() {
  firebase.auth().signOut().then(() => {
    window.location = "login.html";
  });
}

// Firestore
const db = firebase.firestore();

// Add channel
function addChannel() {
  const name = document.getElementById("name").value;
  const thumbnail = document.getElementById("thumbnail").value;
  const category = document.getElementById("category").value;

  const streams = {};

  const q240 = document.getElementById("stream240").value;
  const q360 = document.getElementById("stream360").value;
  const q480 = document.getElementById("stream480").value;
  const q720 = document.getElementById("stream720").value;
  const q1080 = document.getElementById("stream1080").value;

  if (q240) streams["240p"] = q240;
  if (q360) streams["360p"] = q360;
  if (q480) streams["480p"] = q480;
  if (q720) streams["720p"] = q720;
  if (q1080) streams["1080p"] = q1080;

  db.collection("channels").add({
    name: name,
    thumbnail: thumbnail,
    category: category,
    streams: streams
  })
  .then(() => {
    alert("Channel added successfully!");
    clearForm();
  })
  .catch(err => alert(err.message));
}

// Clear form after add
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("thumbnail").value = "";
  document.getElementById("stream240").value = "";
  document.getElementById("stream360").value = "";
  document.getElementById("stream480").value = "";
  document.getElementById("stream720").value = "";
  document.getElementById("stream1080").value = "";
}

// Load channels
function loadChannels() {
  const list = document.getElementById("channelList");
  if (!list) return;

  db.collection("channels").onSnapshot(snapshot => {
    list.innerHTML = "";

    snapshot.forEach(doc => {
      const ch = doc.data();
      const id = doc.id;

      const div = document.createElement("div");
      div.className = "channel-item";

      div.innerHTML = `
        <div class="channel-left">
          <img src="${ch.thumbnail}">
          <div>
            <div class="channel-name">${ch.name}</div>
            <div class="channel-cat">${ch.category}</div>
          </div>
        </div>

        <div class="channel-actions">
          <button class="edit-btn" onclick="editChannel('${id}')">Edit</button>
          <button class="delete-btn" onclick="deleteChannel('${id}')">Delete</button>
        </div>
      `;

      list.appendChild(div);
    });
  });
}

// Delete
function deleteChannel(id) {
  if (confirm("Delete this channel?")) {
    db.collection("channels").doc(id).delete();
  }
}

// Edit
function editChannel(id) {
  db.collection("channels").doc(id).get().then(doc => {
    const ch = doc.data();

    document.getElementById("name").value = ch.name;
    document.getElementById("thumbnail").value = ch.thumbnail;
    document.getElementById("category").value = ch.category;

    if (ch.streams["240p"])
      document.getElementById("stream240").value = ch.streams["240p"];

    if (ch.streams["360p"])
      document.getElementById("stream360").value = ch.streams["360p"];

    if (ch.streams["480p"])
      document.getElementById("stream480").value = ch.streams["480p"];

    if (ch.streams["720p"])
      document.getElementById("stream720").value = ch.streams["720p"];

    if (ch.streams["1080p"])
      document.getElementById("stream1080").value = ch.streams["1080p"];

    deleteChannel(id);
  });
}

function updateAppVersion() {
  const version = document.getElementById("newVersion").value;

  if (!version) {
    alert("Enter version first");
    return;
  }

  db.collection("settings").doc("app").set({
    latestVersion: version
  });

  alert("New app version launched: " + version);
}



function launchNewVersion() {
  const version = document.getElementById("newVersion").value.trim();
  const notes = document.getElementById("updateNotes").value.trim();

  if (!version) {
    alert("Please enter version");
    return;
  }

  const docRef = db.collection("settings").doc("app");

  docRef.get().then(doc => {
    let history = [];

    if (doc.exists && doc.data().history) {
      history = doc.data().history;
    }

    history.unshift({
      version: version,
      notes: notes,
      date: new Date().toISOString()
    });

    return docRef.set({
      latestVersion: version,
      updateNotes: notes,
      history: history
    });
  })
  .then(() => {
    alert("Update launched successfully!");
    document.getElementById("newVersion").value = "";
    document.getElementById("updateNotes").value = "";
  })
  .catch(err => {
    console.error(err);
    alert("Error launching update");
  });
}
