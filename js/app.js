const themeToggle = document.getElementById('themeToggle');
const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const timezoneSelect = document.getElementById('timezone');
const formatSelect = document.getElementById('format');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeToggle.innerHTML = document.body.classList.contains('dark-theme') 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
});

// Clock Update
function updateTime() {
    const tz = timezoneSelect.value;
    const fmt = formatSelect.value;
    let now = new Date();

    if (tz !== "local") {
        const zones = {
            utc: "UTC",
            est: "America/New_York",
            pst: "America/Los_Angeles",
            london: "Europe/London",
            tokyo: "Asia/Tokyo"
        };
        now = new Date(new Date().toLocaleString("en-US", { timeZone: zones[tz] || "UTC" }));
    }

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    let ampm = '';

    if (fmt === "12") {
        ampm = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12 || 12;
    }

    timeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}${ampm}`;
    dateElement.textContent = now.toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
}

updateTime();
setInterval(updateTime, 1000);

// Fullscreen
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});