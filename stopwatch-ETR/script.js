// ==========================
// Mode switching
// ==========================

const showTimerButton = document.getElementById("show-timer");
const showCountdownButton = document.getElementById("show-countdown");

const timerSection = document.getElementById("timer-section");
const countdownSection = document.getElementById("countdown-section");

showTimerButton.addEventListener("click", () => {
    timerSection.classList.add("active");
    countdownSection.classList.remove("active");

    showTimerButton.classList.add("active");
    showCountdownButton.classList.remove("active");
});

showCountdownButton.addEventListener("click", () => {
    countdownSection.classList.add("active");
    timerSection.classList.remove("active");

    showCountdownButton.classList.add("active");
    showTimerButton.classList.remove("active");
});


// ==========================
// Stopwatch logic
// ==========================

const timerDisplay = document.getElementById("timer-display");
const startTimerButton = document.getElementById("start-timer");
const pauseTimerButton = document.getElementById("pause-timer");
const resetTimerButton = document.getElementById("reset-timer");

let timerInterval = null;
let timerStartTime = 0;
let timerElapsedTime = 0;
let timerRunning = false;

function formatStopwatchTime(milliseconds) {
    const totalCentiseconds = Math.floor(milliseconds / 10);

    const centiseconds = totalCentiseconds % 100;
    const totalSeconds = Math.floor(totalCentiseconds / 100);

    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);

    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

function pad(value) {
    return String(value).padStart(2, "0");
}

function updateTimerDisplay() {
    const currentElapsedTime = Date.now() - timerStartTime + timerElapsedTime;
    timerDisplay.textContent = formatStopwatchTime(currentElapsedTime);
}

startTimerButton.addEventListener("click", () => {
    if (timerRunning) {
        return;
    }

    timerRunning = true;
    timerStartTime = Date.now();

    timerInterval = setInterval(updateTimerDisplay, 10);
});

pauseTimerButton.addEventListener("click", () => {
    if (!timerRunning) {
        return;
    }

    timerRunning = false;
    clearInterval(timerInterval);

    timerElapsedTime += Date.now() - timerStartTime;
});

resetTimerButton.addEventListener("click", () => {
    timerRunning = false;
    clearInterval(timerInterval);

    timerStartTime = 0;
    timerElapsedTime = 0;

    timerDisplay.textContent = "00:00:00.00";
});


// ==========================
// Countdown logic
// ==========================

const hoursInput = document.getElementById("hours-input");
const minutesInput = document.getElementById("minutes-input");
const secondsInput = document.getElementById("seconds-input");

const countdownDisplay = document.getElementById("countdown-display");
const countdownMessage = document.getElementById("countdown-message");

const startCountdownButton = document.getElementById("start-countdown");
const pauseCountdownButton = document.getElementById("pause-countdown");
const resetCountdownButton = document.getElementById("reset-countdown");

let countdownInterval = null;
let countdownRemainingTime = getCountdownInputTime();
let countdownEndTime = 0;
let countdownRunning = false;

function getCountdownInputTime() {
    const hours = Number(hoursInput.value) || 0;
    const minutes = Number(minutesInput.value) || 0;
    const seconds = Number(secondsInput.value) || 0;

    return ((hours * 3600) + (minutes * 60) + seconds) * 1000;
}

function formatCountdownTime(milliseconds) {
    const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));

    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);

    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function updateCountdownDisplay() {
    countdownRemainingTime = countdownEndTime - Date.now();

    if (countdownRemainingTime <= 0) {
        countdownRemainingTime = 0;
        clearInterval(countdownInterval);
        countdownRunning = false;

        countdownDisplay.textContent = "00:00:00";
        countdownMessage.textContent = "Time is up!";
        countdownSection.classList.add("finished");

        return;
    }

    countdownDisplay.textContent = formatCountdownTime(countdownRemainingTime);
}

function refreshCountdownFromInputs() {
    if (countdownRunning) {
        return;
    }

    countdownRemainingTime = getCountdownInputTime();
    countdownDisplay.textContent = formatCountdownTime(countdownRemainingTime);
    countdownMessage.textContent = "";
    countdownSection.classList.remove("finished");
}

hoursInput.addEventListener("input", refreshCountdownFromInputs);
minutesInput.addEventListener("input", refreshCountdownFromInputs);
secondsInput.addEventListener("input", refreshCountdownFromInputs);

startCountdownButton.addEventListener("click", () => {
    if (countdownRunning) {
        return;
    }

    if (countdownRemainingTime <= 0) {
        countdownRemainingTime = getCountdownInputTime();
    }

    if (countdownRemainingTime <= 0) {
        countdownMessage.textContent = "Please enter a time greater than zero.";
        return;
    }

    countdownRunning = true;
    countdownMessage.textContent = "";
    countdownSection.classList.remove("finished");

    countdownEndTime = Date.now() + countdownRemainingTime;
    countdownInterval = setInterval(updateCountdownDisplay, 250);
    updateCountdownDisplay();
});

pauseCountdownButton.addEventListener("click", () => {
    if (!countdownRunning) {
        return;
    }

    countdownRunning = false;
    clearInterval(countdownInterval);

    countdownRemainingTime = countdownEndTime - Date.now();
    countdownDisplay.textContent = formatCountdownTime(countdownRemainingTime);
});

resetCountdownButton.addEventListener("click", () => {
    countdownRunning = false;
    clearInterval(countdownInterval);

    countdownRemainingTime = getCountdownInputTime();
    countdownDisplay.textContent = formatCountdownTime(countdownRemainingTime);

    countdownMessage.textContent = "";
    countdownSection.classList.remove("finished");
});

refreshCountdownFromInputs();
