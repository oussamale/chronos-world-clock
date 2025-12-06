const themeToggle = document.getElementById('themeToggle');

const tabs = document.querySelectorAll('.tab');
const pages = document.querySelectorAll('.page');

const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const timezoneSelect = document.getElementById('timezone');
const formatSelect = document.getElementById('format');
const fullscreenBtn = document.getElementById('fullscreenBtn');

const stopwatchDisplay = document.getElementById('stopwatchDisplay');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsContainer = document.getElementById('lapsContainer');

// Countdown elements
const countdownDisplay = document.getElementById('countdownDisplay');
const hoursInput = document.getElementById('hoursInput');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const countdownStartBtn = document.getElementById('countdownStartBtn');
const countdownPauseBtn = document.getElementById('countdownPauseBtn');
const countdownResetBtn = document.getElementById('countdownResetBtn');
const countdownAlert = document.getElementById('countdownAlert');

let stopwatchRunning = false;
let stopwatchStartTime = 0;
let stopwatchElapsedTime = 0;
let stopwatchInterval;
let lapCount = 1;

// Countdown variables
let countdownRunning = false;
let countdownInterval;
let countdownTime = 0;
let originalCountdownTime = 0;

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeToggle.innerHTML = document.body.classList.contains('dark-theme') 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
});

// Tab Switching
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(tab.dataset.tab + '-page').classList.add('active');
    });
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

// Stopwatch Logic (unchanged)
function formatStopwatchTime(ms) {
    const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
    const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${h}:${m}:${s}.${cs}`;
    // return `${h}:${m}:${s}`;
}

function updateStopwatch() {
    stopwatchElapsedTime = Date.now() - stopwatchStartTime;
    stopwatchDisplay.textContent = formatStopwatchTime(stopwatchElapsedTime);
}

function start() { if (!stopwatchRunning) { stopwatchStartTime = Date.now() - stopwatchElapsedTime; stopwatchInterval = setInterval(updateStopwatch, 10); stopwatchRunning = true; } }
function pause() { if (stopwatchRunning) { clearInterval(stopwatchInterval); stopwatchRunning = false; } }
function reset() { clearInterval(stopwatchInterval); stopwatchRunning = false; stopwatchElapsedTime = 0; stopwatchDisplay.textContent = "00:00:00.00"; lapsContainer.innerHTML = ''; lapCount = 1; }
function lap() {
    if (stopwatchRunning) {
        const item = document.createElement('div');
        item.className = 'lap-item';
        item.innerHTML = `<span>Lap ${lapCount++}</span><span>${formatStopwatchTime(stopwatchElapsedTime)}</span>`;
        lapsContainer.prepend(item);
    }
}

startBtn.onclick = start;
pauseBtn.onclick = pause;
resetBtn.onclick = reset;
lapBtn.onclick = lap;


// Countdown Logic
function formatCountdownTime(ms) {
    const h = Math.floor(ms / 3600000).toString().padStart(2, '0');
    const m = Math.floor((ms % 3600000) / 60000).toString().padStart(2, '0');
    const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

function updateCountdown() {
    if (countdownTime <= 0) {
        clearInterval(countdownInterval);
        countdownRunning = false;
        countdownDisplay.textContent = "00:00:00";
        countdownAlert.style.display = 'block';
        return;
    }
    
    countdownTime -= 1000;
    countdownDisplay.textContent = formatCountdownTime(countdownTime);
    
    // Change color when time is running low
    if (countdownTime <= 10000) { // 10 seconds
        countdownDisplay.style.color = 'var(--danger)';
    } else if (countdownTime <= 30000) { // 30 seconds
        countdownDisplay.style.color = 'var(--warning)';
    } else {
        countdownDisplay.style.color = 'var(--accent)';
    }
}

function startCountdown() {
    if (!countdownRunning) {
        // If countdown hasn't started yet, set initial time
        if (countdownTime === 0) {
            const hours = parseInt(hoursInput.value) || 0;
            const minutes = parseInt(minutesInput.value) || 0;
            const seconds = parseInt(secondsInput.value) || 0;
            
            countdownTime = (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
            originalCountdownTime = countdownTime;
            
            if (countdownTime <= 0) {
                alert("Please set a valid time for the countdown.");
                return;
            }
        }
        
        countdownInterval = setInterval(updateCountdown, 1000);
        countdownRunning = true;
        countdownAlert.style.display = 'none';
    }
}

function pauseCountdown() {
    if (countdownRunning) {
        clearInterval(countdownInterval);
        countdownRunning = false;
    }
}

function resetCountdown() {
    clearInterval(countdownInterval);
    countdownRunning = false;
    countdownTime = 0;
    countdownDisplay.textContent = "00:00:00";
    countdownDisplay.style.color = 'var(--accent)';
    countdownAlert.style.display = 'none';
    
    // Reset inputs to original values
    if (originalCountdownTime > 0) {
        const hours = Math.floor(originalCountdownTime / 3600000);
        const minutes = Math.floor((originalCountdownTime % 3600000) / 60000);
        const seconds = Math.floor((originalCountdownTime % 60000) / 1000);
        
        hoursInput.value = hours;
        minutesInput.value = minutes;
        secondsInput.value = seconds;
    }
    updateCountdownPreview();
}

// Input validation and real-time preview
function updateCountdownPreview() {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    const totalTime = (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
    
    // Only update the preview if the countdown is not running
    if (!countdownRunning) {
        countdownDisplay.textContent = formatCountdownTime(totalTime);
        
        // Reset color to default
        countdownDisplay.style.color = 'var(--accent)';
    }
}

hoursInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (isNaN(value) || value < 0) this.value = 0;
    if (value > 99) this.value = 99;
    updateCountdownPreview();
});

minutesInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (isNaN(value) || value < 0) this.value = 0;
    if (value > 59) this.value = 59;
    updateCountdownPreview();
});

secondsInput.addEventListener('input', function() {
    let value = parseInt(this.value);
    if (isNaN(value) || value < 0) this.value = 0;
    if (value > 59) this.value = 59;
    updateCountdownPreview();
});

countdownStartBtn.onclick = startCountdown;
countdownPauseBtn.onclick = pauseCountdown;
countdownResetBtn.onclick = resetCountdown;

// Initialize the preview with the current input values
updateCountdownPreview();
