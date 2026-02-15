let channelData = [];

async function loadChannels() {
  const res = await fetch("channels.json");
  channelData = await res.json();

  const container = document.getElementById("channels");

  channelData.forEach(ch => {
    const div = document.createElement("div");
    div.className = "channel";
    div.innerHTML = `
      <img src="${ch.thumbnail}">
      <p>${ch.name}</p>
    `;
    div.onclick = () => {
      localStorage.setItem("channel", JSON.stringify(ch));
      window.location = "player.html";
    };
    container.appendChild(div);
  });
}

function loadPlayer() {
  const ch = JSON.parse(localStorage.getItem("channel"));
  document.getElementById("channelName").innerText = ch.name;

  const video = document.getElementById("video");
  const qualityDiv = document.getElementById("qualities");

  Object.keys(ch.streams).forEach(q => {
    const btn = document.createElement("button");
    btn.innerText = q;
    btn.onclick = () => {
      video.src = ch.streams[q];
      video.play();
    };
    qualityDiv.appendChild(btn);
  });

  // autoplay first quality
  const first = Object.keys(ch.streams)[0];
  video.src = ch.streams[first];
}
