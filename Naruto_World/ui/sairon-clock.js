/**
 * Sairon World Calendar & Clock System
 * 
 * Calendar structure:
 * - 13 months of 28 days each (364 days)
 * - 1 "Veil Day" at year end (day 365) - a festival day outside normal calendar
 * - 7-day week with alternating work/rest pattern
 * - 24 hours per day
 * 
 * 1 real second = 1 in-game hour
 */

const MONTHS = [
  "Dawnrise", "Bloomtide", "Verdance", "Highsun", "Emberpeak",
  "Harvestfall", "Duskwane", "Emberveil", "Frostwane",
  "Snowcrest", "Nightdeep", "Thawturn", "Skyfall"
];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const WORK_PATTERN = [1, 0, 1, 0, 1, 0, 1]; // 1 = work/training, 0 = rest

const DAYS_PER_MONTH = 28;
const MONTHS_PER_YEAR = 13;
const NORMAL_DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS_PER_YEAR; // 364
const TOTAL_DAYS_PER_YEAR = NORMAL_DAYS_PER_YEAR + 1;          // 365 including Veil Day
const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_TICK = 10; // 10 in-game minutes per real second

// Clock state
let clockState = {
  year: 1,
  dayOfYear: 1,  // 1..365
  hour: 0,       // 0..23
  minute: 0,     // 0..59
  running: true
};

let intervalId = null;
let clockElement = null;

/**
 * Check if a given day of year is Veil Day (the 365th day)
 */
function isVeilDay(doy) {
  return doy === TOTAL_DAYS_PER_YEAR;
}

/**
 * Get date parts from day of year
 */
function getDateParts(doy) {
  if (isVeilDay(doy)) {
    return { veil: true };
  }
  const zeroBased = doy - 1; // 0..363
  const monthIndex = Math.floor(zeroBased / DAYS_PER_MONTH); // 0..12
  const dayInMonth = (zeroBased % DAYS_PER_MONTH) + 1;       // 1..28
  const weekdayIndex = zeroBased % 7;                        // 0..6
  return {
    veil: false,
    monthIndex,
    monthName: MONTHS[monthIndex],
    dayInMonth,
    weekdayIndex,
    weekdayName: WEEKDAYS[weekdayIndex],
    workDay: WORK_PATTERN[weekdayIndex] === 1
  };
}

/**
 * Get time period based on hour (for display/theming)
 */
function getTimePeriod(hour) {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 14) return 'noon';
  if (hour >= 14 && hour < 18) return 'afternoon';
  if (hour >= 18 && hour < 20) return 'dusk';
  if (hour >= 20 || hour < 5) return 'night';
  return 'day';
}

/**
 * Advance time by one tick (10 minutes)
 */
function tick() {
  clockState.minute += MINUTES_PER_TICK;
  while (clockState.minute >= MINUTES_PER_HOUR) {
    clockState.minute -= MINUTES_PER_HOUR;
    clockState.hour++;
    if (clockState.hour >= HOURS_PER_DAY) {
      clockState.hour = 0;
      clockState.dayOfYear++;
      if (clockState.dayOfYear > TOTAL_DAYS_PER_YEAR) {
        clockState.dayOfYear = 1;
        clockState.year++;
      }
    }
  }
  renderClock();
  saveClock();
}

/**
 * Render the clock display
 */
function renderClock() {
  if (!clockElement) return;
  
  const parts = getDateParts(clockState.dayOfYear);
  const period = getTimePeriod(clockState.hour);
  const hourStr = clockState.hour.toString().padStart(2, '0');
  const minStr = clockState.minute.toString().padStart(2, '0');
  
  clockElement.dataset.period = period;
  
  if (parts.veil) {
    clockElement.innerHTML = `
      <span class="clock-date">Year ${clockState.year} — <em>Veil Day</em></span>
      <span class="clock-time">${hourStr}:${minStr}</span>
      <span class="clock-label festival">Festival Day</span>
    `;
  } else {
    const workLabel = parts.workDay ? 'Work Day' : 'Rest Day';
    const workClass = parts.workDay ? 'work' : 'rest';
    clockElement.innerHTML = `
      <span class="clock-date">Year ${clockState.year}, ${parts.monthName} ${parts.dayInMonth}</span>
      <span class="clock-weekday">${parts.weekdayName}</span>
      <span class="clock-time">${hourStr}:${minStr}</span>
      <span class="clock-label ${workClass}">${workLabel}</span>
    `;
  }
}

/**
 * Save clock state to localStorage
 */
function saveClock() {
  try {
    localStorage.setItem('sairon-clock', JSON.stringify(clockState));
  } catch (e) {
    // localStorage not available
  }
}

/**
 * Load clock state from localStorage
 */
function loadClock() {
  try {
    const saved = localStorage.getItem('sairon-clock');
    if (saved) {
      const parsed = JSON.parse(saved);
      clockState.year = parsed.year || 1;
      clockState.dayOfYear = parsed.dayOfYear || 1;
      clockState.hour = parsed.hour || 0;
      clockState.minute = parsed.minute || 0;
      clockState.running = parsed.running !== false;
    }
  } catch (e) {
    // localStorage not available or parse error
  }
}

/**
 * Start the clock
 */
function startClock() {
  if (intervalId) return;
  clockState.running = true;
  intervalId = setInterval(tick, 1000);
  saveClock();
}

/**
 * Stop the clock
 */
function stopClock() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  clockState.running = false;
  saveClock();
}

/**
 * Toggle clock running state
 */
function toggleClock() {
  if (clockState.running) {
    stopClock();
  } else {
    startClock();
  }
  return clockState.running;
}

/**
 * Set clock to specific time
 */
function setClock(year, dayOfYear, hour, minute = 0) {
  clockState.year = Math.max(1, year);
  clockState.dayOfYear = Math.max(1, Math.min(TOTAL_DAYS_PER_YEAR, dayOfYear));
  clockState.hour = Math.max(0, Math.min(23, hour));
  clockState.minute = Math.max(0, Math.min(59, minute));
  renderClock();
  saveClock();
}

/**
 * Get current clock state
 */
function getClockState() {
  return {
    ...clockState,
    parts: getDateParts(clockState.dayOfYear),
    period: getTimePeriod(clockState.hour)
  };
}

/**
 * Initialize the clock system
 */
export function initClock(elementId = 'sairon-clock') {
  clockElement = document.getElementById(elementId);
  if (!clockElement) {
    console.warn(`Sairon Clock: element #${elementId} not found`);
    return null;
  }
  
  loadClock();
  renderClock();
  
  if (clockState.running) {
    startClock();
  }
  
  // Click to toggle pause/resume
  clockElement.addEventListener('click', () => {
    const running = toggleClock();
    clockElement.classList.toggle('paused', !running);
  });
  
  return {
    start: startClock,
    stop: stopClock,
    toggle: toggleClock,
    set: setClock,
    getState: getClockState,
    tick: tick
  };
}

// Export constants for external use
export { MONTHS, WEEKDAYS, DAYS_PER_MONTH, MONTHS_PER_YEAR, TOTAL_DAYS_PER_YEAR };
