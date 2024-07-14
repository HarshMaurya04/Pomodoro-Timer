(function () {

  const Body = document.querySelector("body");
  const workDurationInput = document.querySelector("#work-duration");
  const restDurationInput = document.querySelector("#rest-duration");
  const timerTime = document.querySelector("#timer-time");
  const circleProgress = document.querySelector(".circle-progress");

  let workDuration = parseInt(workDurationInput.value) * 60;
  let restDuration = parseInt(restDurationInput.value) * 60;
  let remainingTime = workDuration;
  let isPause = true;
  let isWorking = true;
  let intervalId;

  window.addEventListener("load", () => {
    Body.classList.add("page-loaded");
  });

  const completed = document.querySelector("#completed-session");
  let completedSession = 0;

  const startBtn = document.querySelector("#start-btn");
  startBtn.addEventListener("click", () => {
    isPause = false;
    Body.classList.add("timer-running");

    if (isWorking) {
      Body.classList.remove("timer-paused");
    } else {
      Body.classList.add("rest-mode");
      Body.classList.remove("timer-paused");
    }

    if (!intervalId) {
      intervalId = setInterval(updateTimer, 1000);
    }
  });

  const pauseBtn = document.querySelector("#pause-btn");
  pauseBtn.addEventListener("click", () => {
    isPause = true;
    Body.classList.remove("timer-running");
    Body.classList.add("timer-paused");
  });

  const settingOpenBtn = document.querySelector("#setting-btn");
  const settingCloseBtn = document.querySelector("#close-setting");

  settingOpenBtn.addEventListener("click", settings);
  settingCloseBtn.addEventListener("click", settings);
  document.addEventListener("keydown", settings);

  function settings() {
    if (event.type === "click") {
      setSetting();
    } else if (event.type === "keydown" && event.keyCode === 27) {
      Body.classList.remove("setting-active");
    }
  }

  function setSetting() {
    Body.classList.contains("setting-active") ? Body.classList.remove("setting-active") : Body.classList.add("setting-active");
  }

  workDurationInput.addEventListener("change", () => {
    workDuration = parseInt(workDurationInput.value) * 60;
    if (isWorking) {
      remainingTime = workDuration;
      updateProgress();
    }
  });

  restDurationInput.addEventListener("change", () => {
    restDuration = parseInt(restDurationInput.value) * 60;
    if (isWorking) {
      remainingTime = restDuration;
      updateProgress();
    }
  });

  const resetBtn = document.querySelector("#reset-btn");
  resetBtn.addEventListener("click", () => {
    clearInterval(intervalId);
    intervalId = null;
    isPause = true;
    isWorking = true;
    remainingTime = workDuration;
    Body.classList.remove("timer-running", "timer-paused", "rest-mode");
    updateProgress();
  });

  function updateTimer() {
    if (!isPause) {
      remainingTime--;

      if (remainingTime <= 0) {
        isWorking = !isWorking;
        remainingTime = isWorking ? workDuration : restDuration;

        if (!isWorking) {
          Body.classList.add("rest-mode");
          Body.classList.remove("timer-running");

          completedSession++;
          completed.textContent = completedSession;
        } else {
          Body.classList.remove("rest-mode");
          Body.classList.remove("timer-running");
        }

        isPause = true;
        Body.classList.remove("timer-work-active");
      }

      updateProgress();
    }
  }

  function updateProgress() {
    const r = 45;
    const c = 2 * Math.PI * r;

    const totalDuration = isWorking ? workDuration : restDuration;
    const dashOffset = c - (c * remainingTime) / totalDuration;

    circleProgress.style.strokeDasharray = c;
    circleProgress.style.strokeDashoffset = dashOffset;
    timerTime.textContent = formatTime(remainingTime);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  
})();
