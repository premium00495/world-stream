let allChannels = [];
let currentCategory = "All";

async function loadPremiumChannels() {
  const res = await fetch("channels.json");
  allChannels = await res.json();
  renderChannels(allChannels);
}

function renderChannels(data) {
  const container = document.getElementById("channels");
  container.innerHTML = "";

  data.forEach(ch => {
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

    container.appendChild(div);
  });
}

function searchChannels() {
  const text = document.getElementById("search").value.toLowerCase();

  const filtered = allChannels.filter(ch =>
    ch.name.toLowerCase().includes(text) &&
    (currentCategory === "All" || ch.category === currentCategory)
  );

  renderChannels(filtered);
}

function filterCategory(cat) {
  currentCategory = cat;

  document.querySelectorAll(".categories button")
    .forEach(btn => btn.classList.remove("active"));

  event.target.classList.add("active");

  searchChannels();
}
