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
const db = firebase.firestore();

let allChannels = [];
let currentCategory = "All";

// Load channels from Firebase
function loadChannels() {
  db.collection("channels").onSnapshot(snapshot => {
    allChannels = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id;
      allChannels.push(data);
    });

    renderChannels();
  });
}

// Render channels
function renderChannels() {
  const list = document.getElementById("channelList");
  list.innerHTML = "";

  let filtered = allChannels;

  if (currentCategory !== "All") {
    filtered = allChannels.filter(c => c.category === currentCategory);
  }

  filtered.forEach(ch => {
    const div = document.createElement("div");
    div.className = "channel-card";

    div.innerHTML = `
      <img src="${ch.thumbnail}">
      <div class="channel-info">
        <div class="channel-name">${ch.name}</div>
        <div class="live-tag">LIVE</div>
      </div>
    `;

    div.onclick = () => {
      localStorage.setItem("channel", JSON.stringify(ch));
      window.location = "player.html";
    };

    list.appendChild(div);
  });
}

// Category filter
function filterCategory(cat) {
  currentCategory = cat;
  renderChannels();
}

// Start loading
loadChannels();
