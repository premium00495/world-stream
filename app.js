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
  if (!list) return;

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
function filterCategory(cat, el) {
  currentCategory = cat;

  // remove active from all buttons
  document.querySelectorAll(".categories button")
    .forEach(btn => btn.classList.remove("active"));

  // add active to clicked button
  if (el) el.classList.add("active");

  renderChannels();
}

// Player logic
function loadPlayer() {
  const ch = JSON.parse(localStorage.getItem("channel"));
  if (!ch) return;

  document.getElementById("channelName").textContent = ch.name;
  document.getElementById("channelLogo").src = ch.thumbnail;

  const video = document.getElementById("video");
  const btns = document.getElementById("qualityButtons");

  // Fixed order (best first)
  const order = ["240p", "360p", "480p", "720p", "1080p"];

  btns.innerHTML = "";

  let firstSet = false;

  order.forEach(q => {
    if (!ch.streams[q]) return;

    const b = document.createElement("button");
    b.textContent = q;

    // First available = auto start
    if (!firstSet) {
      video.src = ch.streams[q];
      b.classList.add("active");
      firstSet = true;
    }

    b.onclick = () => {
      video.src = ch.streams[q];
      document
        .querySelectorAll(".quality-grid button")
        .forEach(btn => btn.classList.remove("active"));
      b.classList.add("active");
    };

    btns.appendChild(b);
  });
}

// Start loading channels on home
loadChannels();
