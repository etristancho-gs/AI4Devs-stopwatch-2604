document.addEventListener("DOMContentLoaded", () => {
    // ==========================
    // DOM helpers
    // ==========================

    function getElement(id) {
        return document.getElementById(id);
    }

    function hasRequiredElements(elements) {
        return elements.every(Boolean);
    }

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    function setButtonDisabled(button, disabled) {
        if (button) {
            button.disabled = disabled;
        }
    }

    // ==========================
    // DOM references
    // ==========================

    const showTimerButton = getElement("show-timer");
    const showCountdownButton = getElement("show-countdown");

    const timerSection = getElement("timer-section");
    const countdownSection = getElement("countdown-section");

    const timerDisplay = getElement("timer-display");
    const startTimerButton = getElement("start-timer");
    const pauseTimerButton = getElement("pause-timer");
    const resetTimerButton = getElement("reset-timer");

    const hoursInput = getElement("hours-input");
    const minutesInput = getElement("minutes-input");
    const secondsInput = getElement("seconds-input");

    const countdownDisplay = getElement("countdown-display");
    const countdownMessage = getElement("countdown-message");

    const startCountdownButton = getElement("start-countdown");
    const pauseCountdownButton = getElement("pause-countdown");
    const resetCountdownButton = getElement("reset-countdown");

    const requiredElements = [
        showTimerButton,
        showCountdownButton,
        timerSection,
        countdownSection,
        timerDisplay,
        startTimerButton,
        pauseTimerButton,
        resetTimerButton,
        hoursInput,
        minutesInput,
        secondsInput,
        countdownDisplay,
        countdownMessage,
        startCountdownButton,
        pauseCountdownButton,
        resetCountdownButton
    ];

    if (!hasRequiredElements(requiredElements)) {
        console.warn("Timer and Countdown app could not start because some DOM elements are missing.");
        return;
    }

    // ==========================
    // Mode switching
    // ==========================

    function showTimerMode() {
        timerSection.classList.add("active");
        countdownSection.classList.remove("active");

        showTimerButton.classList.add("active");
        showCountdownButton.classList.remove("active");
    }

    function showCountdownMode() {
        countdownSection.classList.add("active");
        timerSection.classList.remove("active");

        showCountdownButton.classList.add("active");
        showTimerButton.classList.remove("active");
    }

    showTimerButton.addEventListener("click", showTimerMode);
    showCountdownButton.addEventListener("click", showCountdownMode);

    // ==========================
    // Shared countdown formatting
    // ==========================

    function formatCountdownTime(milliseconds) {
        const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));

        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);

        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }

    // ==========================
    // Stopwatch logic
    // ==========================

    let timerAnimationFrameId = null;
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

    function updateTimerButtons() {
        setButtonDisabled(startTimerButton, timerRunning);
        setButtonDisabled(pauseTimerButton, !timerRunning);
        setButtonDisabled(resetTimerButton, timerRunning || timerElapsedTime === 0);
    }

    function renderTimer() {
        const currentElapsedTime = Date.now() - timerStartTime + timerElapsedTime;
        timerDisplay.textContent = formatStopwatchTime(currentElapsedTime);

        if (timerRunning) {
            timerAnimationFrameId = requestAnimationFrame(renderTimer);
        }
    }

    function startTimer() {
        if (timerRunning) {
            return;
        }

        timerRunning = true;
        timerStartTime = Date.now();

        updateTimerButtons();
        timerAnimationFrameId = requestAnimationFrame(renderTimer);
    }

    function pauseTimer() {
        if (!timerRunning) {
            return;
        }

        timerRunning = false;
        cancelAnimationFrame(timerAnimationFrameId);

        timerElapsedTime += Date.now() - timerStartTime;
        timerDisplay.textContent = formatStopwatchTime(timerElapsedTime);

        updateTimerButtons();
    }

    function resetTimer() {
        timerRunning = false;
        cancelAnimationFrame(timerAnimationFrameId);

        timerAnimationFrameId = null;
        timerStartTime = 0;
        timerElapsedTime = 0;

        timerDisplay.textContent = "00:00:00.00";
        updateTimerButtons();
    }

    startTimerButton.addEventListener("click", startTimer);
    pauseTimerButton.addEventListener("click", pauseTimer);
    resetTimerButton.addEventListener("click", resetTimer);

    // ==========================
    // Countdown logic
    // ==========================

    let countdownIntervalId = null;
    let countdownRemainingTime = 0;
    let countdownEndTime = 0;
    let countdownRunning = false;

    function clampNumber(value, min, max) {
        const numericValue = Number(value);

        if (Number.isNaN(numericValue)) {
            return min;
        }

        return Math.min(Math.max(Math.floor(numericValue), min), max);
    }

    function normalizeCountdownInputs() {
        const hours = clampNumber(hoursInput.value, 0, 99);
        const minutes = clampNumber(minutesInput.value, 0, 59);
        const seconds = clampNumber(secondsInput.value, 0, 59);

        hoursInput.value = String(hours);
        minutesInput.value = String(minutes);
        secondsInput.value = String(seconds);

        return {
            hours,
            minutes,
            seconds
        };
    }

    function readCountdownInputTime() {
        const { hours, minutes, seconds } = normalizeCountdownInputs();

        return ((hours * 3600) + (minutes * 60) + seconds) * 1000;
    }

    function setCountdownInputsDisabled(disabled) {
        hoursInput.disabled = disabled;
        minutesInput.disabled = disabled;
        secondsInput.disabled = disabled;
    }

    function clearCountdownMessage() {
        countdownMessage.textContent = "";
        countdownSection.classList.remove("finished");
    }

    function updateCountdownButtons() {
        const inputTime = readCountdownInputTime();
        const hasValue = inputTime > 0 || countdownRemainingTime > 0;

        setButtonDisabled(startCountdownButton, countdownRunning);
        setButtonDisabled(pauseCountdownButton, !countdownRunning);
        setButtonDisabled(resetCountdownButton, countdownRunning || !hasValue);

        setCountdownInputsDisabled(countdownRunning);
    }

    function resetCountdownToZero() {
        countdownRunning = false;
        clearInterval(countdownIntervalId);

        countdownIntervalId = null;
        countdownRemainingTime = 0;
        countdownEndTime = 0;

        hoursInput.value = "0";
        minutesInput.value = "0";
        secondsInput.value = "0";

        countdownDisplay.textContent = "00:00:00";

        clearCountdownMessage();
        updateCountdownButtons();
    }

    function finishCountdown() {
        countdownRunning = false;
        countdownRemainingTime = 0;

        clearInterval(countdownIntervalId);
        countdownIntervalId = null;

        countdownDisplay.textContent = "00:00:00";
        countdownMessage.textContent = "Time is up!";
        countdownSection.classList.add("finished");

        updateCountdownButtons();
    }

    function updateCountdownDisplay() {
        countdownRemainingTime = countdownEndTime - Date.now();

        if (countdownRemainingTime <= 0) {
            finishCountdown();
            return;
        }

        countdownDisplay.textContent = formatCountdownTime(countdownRemainingTime);
    }

    function refreshCountdownFromInputs() {
        if (countdownRunning) {
            return;
        }

        countdownRemainingTime = readCountdownInputTime();
        countdownDisplay.textContent = formatCountdownTime(countdownRemainingTime);

        clearCountdownMessage();
        updateCountdownButtons();
    }

    function startCountdown() {
        if (countdownRunning) {
            return;
        }

        countdownRemainingTime = readCountdownInputTime();

        if (countdownRemainingTime <= 0) {
            countdownDisplay.textContent = "00:00:00";
            countdownMessage.textContent = "Please enter a time greater than zero.";
            countdownSection.classList.remove("finished");
            updateCountdownButtons();
            return;
        }

        countdownRunning = true;
        countdownEndTime = Date.now() + countdownRemainingTime;

        clearCountdownMessage();
        updateCountdownButtons();
        updateCountdownDisplay();

        countdownIntervalId = setInterval(updateCountdownDisplay, 250);
    }

    function pauseCountdown() {
        if (!countdownRunning) {
            return;
        }

        countdownRunning = false;
        clearInterval(countdownIntervalId);

        countdownIntervalId = null;
        countdownRemainingTime = Math.max(0, countdownEndTime - Date.now());
        countdownDisplay.textContent = formatCountdownTime(countdownRemainingTime);

        updateCountdownButtons();
    }

    hoursInput.addEventListener("input", refreshCountdownFromInputs);
    minutesInput.addEventListener("input", refreshCountdownFromInputs);
    secondsInput.addEventListener("input", refreshCountdownFromInputs);

    hoursInput.addEventListener("blur", refreshCountdownFromInputs);
    minutesInput.addEventListener("blur", refreshCountdownFromInputs);
    secondsInput.addEventListener("blur", refreshCountdownFromInputs);

    startCountdownButton.addEventListener("click", startCountdown);
    pauseCountdownButton.addEventListener("click", pauseCountdown);
    resetCountdownButton.addEventListener("click", resetCountdownToZero);

    // ==========================
    // Initial state
    // ==========================

    resetTimer();
    resetCountdownToZero();
});
