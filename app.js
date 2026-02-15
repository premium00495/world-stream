async function loadPremiumChannels() {
  const res = await fetch("channels.json");
  const data = await res.json();

  const container = document.getElementById("channels");

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
