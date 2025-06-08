// Framework used ==> jQuery and jQuery UI

/* Create an array of months and year with their span numbers
   Loop through the array and add them to the date element */
const months = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const monthNames = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const yearArray = {
  2022: {
    january: 6,
    february: 2,
    march: 2,
    april: 5,
    may: 7,
    june: 3,
    july: 5,
    august: 1,
    september: 4,
    october: 6,
    november: 2,
    december: 4,
  },
  2023: {
    january: 7,
    february: 3,
    march: 3,
    april: 6,
    may: 1,
    june: 4,
    july: 6,
    august: 2,
    september: 5,
    october: 7,
    november: 3,
    december: 5,
  },
  2024: {
    january: 1,
    february: 4,
    march: 5,
    april: 1,
    may: 3,
    june: 6,
    july: 1,
    august: 4,
    september: 7,
    october: 2,
    november: 5,
    december: 7,
  },
  2025: {
    january: 3,
    february: 6,
    march: 6,
    april: 2,
    may: 4,
    june: 7,
    july: 2,
    august: 5,
    september: 1,
    october: 3,
    november: 6,
    december: 1,
  },
  2026: {
    january: 4,
    february: 7,
    march: 7,
    april: 3,
    may: 5,
    june: 1,
    july: 3,
    august: 6,
    september: 2,
    october: 4,
    november: 7,
    december: 2,
  },
  2027: {
    january: 5,
    february: 1,
    march: 1,
    april: 4,
    may: 6,
    june: 2,
    july: 4,
    august: 7,
    september: 3,
    october: 5,
    november: 1,
    december: 3,
  },
  2028: {
    january: 6,
    february: 2,
    march: 3,
    april: 6,
    may: 1,
    june: 4,
    july: 6,
    august: 2,
    september: 5,
    october: 7,
    november: 3,
    december: 5,
  },
};

const yearLocalStorage = {
  2022: "event22",
  2023: "event23",
  2024: "event24",
  2025: "event25",
  2026: "event26",
  2027: "event27",
  2028: "event28",
};

// Global Variables
let id;
let pushEventDetail = [];
let todoListDate = [];
let todoListDay = [];
let todoListMonths = [];
let todoListEvent = [];
let todoListReminder = [];
let todoListID = [];
let todoListDone = [];
let currentYearName = $("#currentYear").html() || "2024";
let currentYearData = yearArray[currentYearName];
let dateSelector = "";
let fullDate;
let daysToGo;
let reminderName = "";
let category = "";
let reminderDate = "";
let currentYearStorage = getYearStorage(currentYearName);
let submitted = false;
let monthName = "";
let dayName = "";
let dayIndex = "";
let monthSpan = "";
let intDate = "";
let date = "";
let alltodoList = [];

// Utility Functions
function showMessage(message, type = "success") {
  const messageDiv = $(`<div class="message ${type}">${message}</div>`);
  $("body").prepend(messageDiv);
  setTimeout(() => {
    messageDiv.fadeOut(300, function () {
      $(this).remove();
    });
  }, 3000);
}

function setLoadingState(element, isLoading) {
  if (isLoading) {
    element.addClass("loading").prop("disabled", true);
  } else {
    element.removeClass("loading").prop("disabled", false);
  }
}

/**
 * Get year storage key for localStorage
 * @param {string} currentyear - The current year
 * @returns {string} Storage key for the year
 */
function getYearStorage(currentyear) {
  return yearLocalStorage[currentyear] || "event24";
}

/**
 * Get data from localStorage and populate arrays
 * @param {string} yearStorage - Storage key for the year
 */
function getLocalStorageData(yearStorage) {
  try {
    const storedData = window.localStorage.getItem(yearStorage);
    alltodoList = storedData ? JSON.parse(storedData) : [];

    // Reset arrays
    todoListMonths = [];
    todoListDay = [];
    todoListDate = [];
    todoListEvent = [];
    todoListReminder = [];
    todoListID = [];
    todoListDone = [];

    if (alltodoList && alltodoList.length > 0) {
      alltodoList.forEach((item) => {
        if (item && item.reminderDate) {
          const dateParts = item.reminderDate.split(" ");
          if (dateParts.length >= 3) {
            todoListMonths.push(dateParts[2]);
            todoListDay.push(dateParts[1]);
            todoListDate.push(dateParts[0].replace(",", ""));
            todoListEvent.push(item.category || "");
            todoListReminder.push(item.reminderName || "");
            todoListID.push(item.id || 0);
            todoListDone.push(item.done || false);
          }
        }
      });
    }
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    alltodoList = [];
  }
}

/**
 * Get current year data from yearArray
 */
function getCurrentYearData() {
  currentYearData = yearArray[currentYearName] || yearArray["2024"];
}

/**
 * Add date numbers to each month with proper day alignment
 */
function addNumberOfDatesToMonth() {
  $('.dates div[class*="span"]').remove();
  $(".dates .date").remove();

  $(".month").each(function () {
    const month30 = ["april", "june", "september", "november"];
    let monthlength = 31;
    const id = $(this).attr("id");

    // Determine month length
    if (id === "february") {
      monthlength = 28;
      // Check for leap year
      if (
        parseInt(currentYearName) % 4 === 0 &&
        (parseInt(currentYearName) % 100 !== 0 ||
          parseInt(currentYearName) % 400 === 0)
      ) {
        monthlength = 29;
      }
    } else if (month30.includes(id)) {
      monthlength = 30;
    }

    // Add dates
    let once = true;
    for (let i = 1; i <= monthlength; i++) {
      if (once) {
        $("#" + id + " .dates").append(`<div class="date"></div>`);
        once = false;
      }
      $("#" + id + " .dates").append(`<div class="date">${i}</div>`);
    }
  });
}

/**
 * Highlight current date with animation
 */
function highlightUserDate() {
  // Clear previous highlights
  $(".userDate").removeClass("userDate");

  const userFullDate = new Date().toDateString();
  const userDate = userFullDate.split(" ");

  if (currentYearName == userDate[3]) {
    $(".month").each(function () {
      const monthId = $(this).attr("id");
      const monthAbbr = userDate[1].toLowerCase();

      // Map month abbreviations to full names
      const monthMap = {
        jan: "january",
        feb: "february",
        mar: "march",
        apr: "april",
        may: "may",
        jun: "june",
        jul: "july",
        aug: "august",
        sep: "september",
        oct: "october",
        nov: "november",
        dec: "december",
      };

      if (monthId === monthMap[monthAbbr]) {
        $(this)
          .find(".date")
          .each(function () {
            if ($(this).text() == parseInt(userDate[2])) {
              $(this).addClass("userDate");
            }
          });
      }
    });
  }
}

/**
 * Set month span for proper calendar alignment
 * @param {Object} yearData - Year data with month spans
 */
function monthSpanner(yearData) {
  Object.entries(yearData).forEach(([month, span]) => {
    const firstDate = $(`#${month} .dates .date:first`);
    if (firstDate.length > 0) {
      // Remove existing span classes
      firstDate.removeClass(function (index, className) {
        return (className.match(/(^|\s)span-\S+/g) || []).join(" ");
      });
      // Add new span class
      firstDate.addClass(`span span-${span}`);
    }
  });
}

/**
 * Save event to localStorage
 * @param {string} yearStorage - Storage key for the year
 */
function saveToStorage(yearStorage) {
  if (!category || !reminderName) {
    showMessage("Please fill in all required fields", "error");
    return false;
  }

  try {
    let existingData =
      JSON.parse(window.localStorage.getItem(yearStorage)) || [];

    // Generate new ID
    const newId =
      existingData.length > 0
        ? Math.max(...existingData.map((item) => item.id || 0)) + 1
        : 1;

    const eventDetail = {
      id: newId,
      reminderDate: reminderDate,
      category: category,
      reminderName: reminderName,
      done: false,
      createdAt: new Date().toISOString(),
    };

    existingData.push(eventDetail);
    window.localStorage.setItem(yearStorage, JSON.stringify(existingData));
    submitted = true;
    return true;
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    showMessage("Error saving event. Please try again.", "error");
    return false;
  }
}

/**
 * Update reminder display in sidebar
 */
function updateReminder() {
  getLocalStorageData(currentYearStorage);

  $(".todoList .content").html("");

  if (todoListMonths.length > 0) {
    todoListMonths.forEach((month, index) => {
      const done = todoListDone[index] ? "markAsDone" : "";
      const markIcon = todoListDone[index] ? "fa-check-circle" : "fa-circle";
      const markTitle = todoListDone[index] ? "Mark as undone" : "Mark as done";

      const eventHtml = `
                <div class="eventContent ${done}" id="${todoListID[index]}">
                    <div>
                        <span class="event-date">${todoListDay[index]} ${todoListDate[index]} → </span>
                        <span class="event-category">${todoListEvent[index]}:</span>
                        <span class="event-name">${todoListReminder[index]}</span>
                    </div>
                    <span class="event-actions">
                        <i class="fas ${markIcon} optionTodo" id="mark" title="${markTitle}"></i>
                        <i class="fas fa-trash optionTodo" id="delete" title="Delete"></i>
                    </span>
                </div>
            `;

      $(`.todoList .${month}`).append(eventHtml);
    });
  }

  // Show/hide month headers based on content
  $(".todoList h3").show();
  let emptyCounter = 0;

  $(".todoList .content").each(function () {
    if ($(this).html().trim() === "") {
      const emptyClass = $(this).attr("class").split(" ")[1];
      $(`#todo-${emptyClass}`).hide();
      emptyCounter++;
    }
  });

  // Show empty message if no events
  if (emptyCounter === 12) {
    $(".emptyInfo").show().html(`
            <div class="empty-state">
                <i class="fas fa-calendar-plus"></i>
                <h4>No events added yet</h4>
                <p>Click on any date to add your first event</p>
            </div>
        `);
  } else {
    $(".emptyInfo").hide();
  }
}

/**
 * Add new event categories to dropdown
 */
function addNewEvent() {
  const existingOptions = [];
  $("#events option").each(function () {
    existingOptions.push($(this).val());
  });

  const uniqueEvents = [...new Set(todoListEvent)];
  uniqueEvents.forEach((event) => {
    if (event && !existingOptions.includes(event)) {
      $("#others").before(`<option value="${event}">${event}</option>`);
    }
  });
}

/**
 * Outline dates that have events
 */
function outlineEventDates() {
  $(".date").removeAttr("title").removeClass("outline");
  getLocalStorageData(currentYearStorage);

  todoListDate.forEach((dateNum, index) => {
    const month = todoListMonths[index];
    $(`#${month} .date`).each(function () {
      if ($(this).text() == dateNum) {
        const tooltipReminder = todoListReminder[index];
        const tooltipEvent = todoListEvent[index];
        const fullDateStr = `${dateNum} ${month.slice(
          0,
          3
        )}, ${currentYearName} 00:00:00`;

        dateCountDown(fullDateStr);
        $(this).addClass("outline");

        let tooltipText = `${tooltipEvent} → ${tooltipReminder}\n`;
        if (daysToGo < 0) {
          tooltipText += `${Math.abs(daysToGo)} days ago`;
        } else if (daysToGo > 0) {
          tooltipText += `${daysToGo} days to go`;
        } else {
          tooltipText += "Today!";
        }

        $(this).attr("title", tooltipText);
      }
    });
  });
}

/**
 * Color Sundays red
 */
function redSundays() {
  $(".date").removeAttr("style");
  Object.entries(yearArray[currentYearName]).forEach(([month, span]) => {
    const sundayFormula = 16 - span;
    $(`#${month} .dates .date:nth-child(7n+${sundayFormula})`).css(
      "color",
      "#e53e3e"
    );
  });
}

/**
 * Calculate days until/since event
 * @param {string} eventDate - Date string for the event
 */
function dateCountDown(eventDate) {
  try {
    const eventTime = new Date(eventDate).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = eventTime - currentTime;
    daysToGo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error("Error calculating date countdown:", error);
    daysToGo = 0;
  }
}

/**
 * Remove outline from dates
 */
function removeOutline() {
  $(".date.outline").removeClass("outline");
}

/**
 * Initialize calendar with current year data
 */
function initializeCalendar() {
  currentYearStorage = getYearStorage(currentYearName);
  addNumberOfDatesToMonth();
  getCurrentYearData();
  monthSpanner(currentYearData);
  redSundays();
  getLocalStorageData(currentYearStorage);
  outlineEventDates();
  highlightUserDate();
  updateReminder();
}

/**
 * Reset form fields
 */
function resetForm() {
  $("#categories").val("");
  $(".reminderName input").val("");
  $(".others input").val("");
  $(".others").hide();
  $("#repeatition input").prop("checked", false);
  $(".repeatition").css("opacity", "0.1");
}

/**
 * Validate form inputs
 */
function validateForm() {
  const categoryVal = $("#categories").val();
  const reminderVal = $(".reminderName input").val().trim();

  if (!categoryVal || categoryVal === "") {
    showMessage("Please select a category", "error");
    return false;
  }

  if (!reminderVal) {
    showMessage("Please enter an event name", "error");
    return false;
  }

  return true;
}

// Initialize jQuery UI components
$(".years").dialog({
  autoOpen: false,
  title: "Select Year",
  width: 350,
  height: 300,
  modal: true,
  resizable: false,
  dialogClass: "year-dialog",
});

$(".todoList").accordion({
  collapsible: true,
  active: false,
  heightStyle: "content",
  animate: 300,
});

$("#days").dialog({
  autoOpen: false,
  title: "Add New Event",
  width: 500,
  height: 450,
  modal: true,
  resizable: false,
  dialogClass: "event-dialog",
});

// Insert day names into calendar headers
months.forEach((day) => {
  $(".dates").append(`<div class="day-header">${day.slice(0, 3)}</div>`);
});

// Add maximize icons to month headers
$(".month-name").each(function () {
  if ($(this).find(".maximize").length === 0) {
    $(this).append('<div class="maximize"><i class="fas fa-expand"></i></div>');
  }
});

// Initialize calendar
initializeCalendar();

// Event Handlers

// Maximize/minimize month view
$(document).on("click", ".maximize", function (e) {
  e.stopPropagation();
  const parentElement = $(this).closest(".month");
  const icon = $(this).find("i");

  parentElement.toggleClass("bigShow");

  if (parentElement.hasClass("bigShow")) {
    icon.removeClass("fa-expand").addClass("fa-compress");
    $("body").addClass("modal-open");
  } else {
    icon.removeClass("fa-compress").addClass("fa-expand");
    $("body").removeClass("modal-open");
  }
});

// Close expanded month when clicking outside
$(document).on("click", ".bigShow", function (e) {
  if (e.target === this) {
    $(this).removeClass("bigShow");
    $(this)
      .find(".maximize i")
      .removeClass("fa-compress")
      .addClass("fa-expand");
    $("body").removeClass("modal-open");
  }
});

// Year selection
$(".yearName h1").click(function () {
  $(".years").dialog("open");
});

$(".years li").click(function () {
  const newYear = $(this).html();
  if (newYear !== currentYearName) {
    setLoadingState($(".container"), true);

    currentYearName = newYear;
    $("#currentYear").html(currentYearName);
    $(".years").dialog("close");

    setTimeout(() => {
      initializeCalendar();
      setLoadingState($(".container"), false);
      showMessage(`Calendar updated to ${currentYearName}`, "success");
    }, 300);
  } else {
    $(".years").dialog("close");
  }
});

// Date click handler (using event delegation for dynamic content)
$(document).on("click", ".date", function () {
  if ($(this).hasClass("day-header")) return;

  dateSelector = $(this);
  date = $(this).html();
  intDate = parseInt(date);

  if (isNaN(intDate)) return;

  monthName = $(this).closest(".month").attr("id");
  monthSpan = yearArray[currentYearName][monthName];
  dayIndex = (monthSpan + intDate - 1) % 7;
  dayName = months[dayIndex];

  $(".full-date").html(
    `${date}, ${dayName} ${
      monthName.charAt(0).toUpperCase() + monthName.slice(1)
    }`
  );

  getLocalStorageData(currentYearStorage);
  addNewEvent();
  resetForm();
  $("#days").dialog("open");
});

// Category selection
$("#categories").change(function () {
  if ($(this).val() === "Others") {
    $(".others").show();
    $(".others input").focus();
  } else {
    $(".others").hide();
  }
});

// Repeat option toggle
$("#repeatition input").change(function () {
  const isChecked = $(this).is(":checked");
  $(".repeatition").css("opacity", isChecked ? "1" : "0.1");

  if (isChecked) {
    showMessage("Event will be added to all years (2022-2028)", "success");
  }
});

// Form submission
$('input[type="submit"]').click(function (e) {
  e.preventDefault();

  if (!validateForm()) return false;

  // Get form values
  const newCategory = $(".others input").val().trim();
  if (newCategory) {
    const newOption = `<option value="${newCategory}">${newCategory}</option>`;
    $("#others").before(newOption);
    $("#categories").val(newCategory);
  }

  reminderName = $(".reminderName input").val().trim();
  category = $("#categories").val();
  reminderDate = $(".full-date").html();
  const repeat = $("#repeatition input").is(":checked");

  setLoadingState($(this), true);
  submitted = false;

  try {
    if (repeat) {
      // Save to all years
      let successCount = 0;
      Object.keys(yearArray).forEach((year) => {
        const yearSpan = yearArray[year][monthName];
        const yearDayName = months[(yearSpan + intDate - 1) % 7];
        const yearReminderDate = `${date}, ${yearDayName} ${monthName}`;

        // Temporarily update reminder date for this year
        const originalReminderDate = reminderDate;
        reminderDate = yearReminderDate;

        if (saveToStorage(getYearStorage(year))) {
          successCount++;
        }

        reminderDate = originalReminderDate;
      });

      if (successCount > 0) {
        submitted = true;
        showMessage(
          `Event added to ${successCount} years successfully!`,
          "success"
        );
      }
    } else {
      // Save to current year only
      if (saveToStorage(currentYearStorage)) {
        submitted = true;
        showMessage("Event saved successfully!", "success");
      }
    }

    if (submitted) {
      $("#days").dialog("close");
      updateReminder();
      outlineEventDates();
      resetForm();
    }
  } catch (error) {
    console.error("Error saving event:", error);
    showMessage("Error saving event. Please try again.", "error");
  } finally {
    setLoadingState($(this), false);
  }

  return false;
});

// Todo sidebar toggle
$(".todoIcon").click(function () {
  $(".todoContainer").toggleClass("right50");
  if ($(".todoContainer").hasClass("right50")) {
    updateReminder();
    $("body").addClass("sidebar-open");
  } else {
    $("body").removeClass("sidebar-open");
  }
});

// Delete event
$(document).on("click", "#delete", function (e) {
  e.stopPropagation();

  if (!confirm("Are you sure you want to delete this event?")) return;

  const parentId = parseInt($(this).closest(".eventContent").attr("id"));
  const eventElement = $(this).closest(".eventContent");

  try {
    const filteredEvents = alltodoList.filter((item) => item.id !== parentId);
    window.localStorage.setItem(
      currentYearStorage,
      JSON.stringify(filteredEvents)
    );

    // Animate removal
    eventElement.fadeOut(300, function () {
      updateReminder();
      outlineEventDates();
      showMessage("Event deleted successfully", "success");
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    showMessage("Error deleting event. Please try again.", "error");
  }
});

// Mark/unmark event as done
$(document).on("click", "#mark", function (e) {
  e.stopPropagation();

  const parentId = parseInt($(this).closest(".eventContent").attr("id"));
  const eventElement = $(this).closest(".eventContent");
  const icon = $(this);

  try {
    alltodoList.forEach((item) => {
      if (item.id === parentId) {
        item.done = !item.done;

        // Update UI immediately
        if (item.done) {
          eventElement.addClass("markAsDone");
          icon.removeClass("fa-circle").addClass("fa-check-circle");
          icon.attr("title", "Mark as undone");
        } else {
          eventElement.removeClass("markAsDone");
          icon.removeClass("fa-check-circle").addClass("fa-circle");
          icon.attr("title", "Mark as done");
        }
      }
    });

    window.localStorage.setItem(
      currentYearStorage,
      JSON.stringify(alltodoList)
    );

    const status = alltodoList.find((item) => item.id === parentId)?.done
      ? "completed"
      : "pending";
    showMessage(`Event marked as ${status}`, "success");
  } catch (error) {
    console.error("Error updating event status:", error);
    showMessage("Error updating event. Please try again.", "error");
  }
});

// Keyboard shortcuts
$(document).keydown(function (e) {
  // ESC key to close dialogs and expanded views
  if (e.keyCode === 27) {
    if ($(".bigShow").length > 0) {
      $(".bigShow").removeClass("bigShow");
      $(".maximize i").removeClass("fa-compress").addClass("fa-expand");
      $("body").removeClass("modal-open");
    }
    if ($(".todoContainer").hasClass("right50")) {
      $(".todoContainer").removeClass("right50");
      $("body").removeClass("sidebar-open");
    }
  }

  // Ctrl/Cmd + T to toggle todo sidebar
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 84) {
    e.preventDefault();
    $(".todoIcon").first().click();
  }
});

// Initialize tooltips for dynamic content
$(document).tooltip({
  selector: ".outline, .optionTodo, .yearName h1",
  show: { delay: 500 },
  hide: { delay: 100 },
});

// Auto-refresh current date highlight every minute
setInterval(highlightUserDate, 60000);

// Handle window resize for responsive behavior
$(window).resize(function () {
  if ($(window).width() < 768) {
    $(".todoContainer").removeClass("right50");
    $("body").removeClass("sidebar-open");
  }
});

// Prevent form submission on Enter key in input fields
$("#days input").keypress(function (e) {
  if (e.which === 13 && e.target.type !== "submit") {
    e.preventDefault();
    return false;
  }
});

// Auto-save form data to prevent loss
let formAutoSaveTimeout;
$("#days input, #days select").on("input change", function () {
  clearTimeout(formAutoSaveTimeout);
  formAutoSaveTimeout = setTimeout(() => {
    const formData = {
      category: $("#categories").val(),
      reminder: $(".reminderName input").val(),
      others: $(".others input").val(),
      repeat: $("#repeatition input").is(":checked"),
    };
    sessionStorage.setItem("tempFormData", JSON.stringify(formData));
  }, 1000);
});

// Restore form data when dialog opens
$("#days").on("dialogopen", function () {
  try {
    const savedData = sessionStorage.getItem("tempFormData");
    if (savedData) {
      const formData = JSON.parse(savedData);
      if (formData.category) $("#categories").val(formData.category);
      if (formData.reminder) $(".reminderName input").val(formData.reminder);
      if (formData.others) $(".others input").val(formData.others);
      $("#repeatition input").prop("checked", formData.repeat || false);

      // Trigger change events
      $("#categories").trigger("change");
      $("#repeatition input").trigger("change");
    }
  } catch (error) {
    console.error("Error restoring form data:", error);
  }
});

// Clear temp data when form is successfully submitted
$("#days").on("dialogclose", function () {
  if (submitted) {
    sessionStorage.removeItem("tempFormData");
  }
});

// Add loading animation to calendar initialization
$(document).ready(function () {
  $(".container").addClass("loading");
  setTimeout(() => {
    $(".container").removeClass("loading");
  }, 1000);
});

// Error handling for localStorage quota exceeded
window.addEventListener("storage", function (e) {
  if (e.key === currentYearStorage) {
    updateReminder();
    outlineEventDates();
  }
});

// Service Worker registration for offline functionality (if available)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js").then(
      function (registration) {
        console.log("ServiceWorker registration successful");
      },
      function (err) {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

// Export/Import functionality
function exportCalendarData() {
  try {
    const allData = {};
    Object.values(yearLocalStorage).forEach((storageKey) => {
      const data = localStorage.getItem(storageKey);
      if (data) {
        allData[storageKey] = JSON.parse(data);
      }
    });

    const dataStr = JSON.stringify(allData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `calendar-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showMessage("Calendar data exported successfully!", "success");
  } catch (error) {
    console.error("Error exporting data:", error);
    showMessage("Error exporting data. Please try again.", "error");
  }
}

function importCalendarData(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);
      let importCount = 0;

      Object.entries(importedData).forEach(([storageKey, data]) => {
        if (Object.values(yearLocalStorage).includes(storageKey)) {
          localStorage.setItem(storageKey, JSON.stringify(data));
          importCount++;
        }
      });

      if (importCount > 0) {
        initializeCalendar();
        showMessage(
          `Successfully imported data for ${importCount} years!`,
          "success"
        );
      } else {
        showMessage("No valid calendar data found in file.", "error");
      }
    } catch (error) {
      console.error("Error importing data:", error);
      showMessage(
        "Invalid file format. Please select a valid backup file.",
        "error"
      );
    }
  };
  reader.readAsText(file);
}

// Add export/import buttons to the UI (you can add these to your HTML)
function addExportImportButtons() {
  const buttonsHtml = `
        <div class="data-management" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
            <button id="exportBtn" class="btn-secondary" title="Export Calendar Data">
                <i class="fas fa-download"></i>
            </button>
            <button id="importBtn" class="btn-secondary" title="Import Calendar Data">
                <i class="fas fa-upload"></i>
            </button>
            <input type="file" id="importFile" accept=".json" style="display: none;">
        </div>
    `;

  $("body").append(buttonsHtml);

  $("#exportBtn").click(exportCalendarData);

  $("#importBtn").click(() => $("#importFile").click());

  $("#importFile").change(function () {
    const file = this.files[0];
    if (file) {
      importCalendarData(file);
      this.value = ""; // Reset file input
    }
  });
}

// Statistics and analytics
function getCalendarStats() {
  const stats = {
    totalEvents: 0,
    completedEvents: 0,
    upcomingEvents: 0,
    overdueEvents: 0,
    eventsByCategory: {},
    eventsByMonth: {},
  };

  Object.values(yearLocalStorage).forEach((storageKey) => {
    const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
    data.forEach((event) => {
      stats.totalEvents++;

      if (event.done) {
        stats.completedEvents++;
      }

      // Count by category
      const category = event.category || "Uncategorized";
      stats.eventsByCategory[category] =
        (stats.eventsByCategory[category] || 0) + 1;

      // Count by month
      const month = event.reminderDate?.split(" ")[2] || "Unknown";
      stats.eventsByMonth[month] = (stats.eventsByMonth[month] || 0) + 1;

      // Check if upcoming or overdue
      if (!event.done && event.reminderDate) {
        const eventDate = new Date(
          event.reminderDate.replace(",", "") + `, ${currentYearName}`
        );
        const today = new Date();
        const diffTime = eventDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
          stats.upcomingEvents++;
        } else if (diffDays < 0) {
          stats.overdueEvents++;
        }
      }
    });
  });

  return stats;
}

// Search functionality
function searchEvents(query) {
  if (!query || query.trim() === "") {
    $(".eventContent").show();
    return;
  }

  const searchTerm = query.toLowerCase().trim();
  $(".eventContent").each(function () {
    const eventText = $(this).text().toLowerCase();
    if (eventText.includes(searchTerm)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

// Add search functionality to todo sidebar
function addSearchToSidebar() {
  const searchHtml = `
        <div class="search-container" style="padding: 1rem; border-bottom: 1px solid #e2e8f0;">
            <div class="search-input-group">
                <i class="fas fa-search"></i>
                <input type="text" id="eventSearch" placeholder="Search events..." 
                       style="width: 100%; padding: 0.5rem 0.5rem 0.5rem 2rem; border: 1px solid #e2e8f0; border-radius: 8px;">
            </div>
        </div>
    `;

  $(".todoList").before(searchHtml);

  $("#eventSearch").on("input", function () {
    searchEvents($(this).val());
  });
}

// Theme management
function toggleTheme() {
  const currentTheme = localStorage.getItem("calendar-theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";

  $("body").removeClass("theme-light theme-dark").addClass(`theme-${newTheme}`);
  localStorage.setItem("calendar-theme", newTheme);

  showMessage(`Switched to ${newTheme} theme`, "success");
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("calendar-theme") || "light";
  $("body").addClass(`theme-${savedTheme}`);
}

// Notification system (if supported)
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        showMessage(
          "Notifications enabled! You'll be notified of upcoming events.",
          "success"
        );
      }
    });
  }
}

function checkUpcomingEvents() {
  if ("Notification" in window && Notification.permission === "granted") {
    getLocalStorageData(currentYearStorage);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    todoListDate.forEach((dateNum, index) => {
      if (!todoListDone[index]) {
        const eventMonth = todoListMonths[index];
        const eventDate = new Date(
          `${eventMonth} ${dateNum}, ${currentYearName}`
        );

        // Check if event is tomorrow
        if (eventDate.toDateString() === tomorrow.toDateString()) {
          new Notification("Upcoming Event Reminder", {
            body: `${todoListEvent[index]}: ${todoListReminder[index]} is tomorrow!`,
            icon: "/favicon.ico",
          });
        }
      }
    });
  }
}

// Performance optimization: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Optimized resize handler
const optimizedResize = debounce(() => {
  if ($(window).width() < 768) {
    $(".todoContainer").removeClass("right50");
    $("body").removeClass("sidebar-open");
  }
}, 250);

$(window).resize(optimizedResize);

// Initialize additional features
$(document).ready(function () {
  // Initialize theme
  initializeTheme();

  // Add export/import buttons
  addExportImportButtons();

  // Add search to sidebar
  addSearchToSidebar();

  // Request notification permission
  setTimeout(requestNotificationPermission, 2000);

  // Check for upcoming events daily
  checkUpcomingEvents();
  setInterval(checkUpcomingEvents, 24 * 60 * 60 * 1000); // Check daily

  // Add keyboard navigation
  $(document).on("keydown", function (e) {
    // Arrow key navigation for calendar dates
    if ($(".date:focus").length > 0) {
      const focused = $(".date:focus");
      let next;

      switch (e.keyCode) {
        case 37: // Left arrow
          next = focused.prev(".date");
          break;
        case 39: // Right arrow
          next = focused.next(".date");
          break;
        case 38: // Up arrow
          next = focused.prevAll(".date").eq(6);
          break;
        case 40: // Down arrow
          next = focused.nextAll(".date").eq(6);
          break;
        case 13: // Enter
          focused.click();
          return;
      }

      if (next && next.length > 0) {
        next.focus();
        e.preventDefault();
      }
    }
  });

  // Make dates focusable for keyboard navigation
  $(".date").attr("tabindex", "0");
});

// Error boundary for uncaught errors
window.addEventListener("error", function (e) {
  console.error("Uncaught error:", e.error);
  showMessage(
    "An unexpected error occurred. Please refresh the page.",
    "error"
  );
});

// Cleanup function for memory management
function cleanup() {
  // Clear intervals
  clearInterval(highlightUserDate);

  // Remove event listeners
  $(window).off("resize", optimizedResize);
  $(document).off("keydown");

  // Clear timeouts
  clearTimeout(formAutoSaveTimeout);
}

// Call cleanup on page unload
$(window).on("beforeunload", cleanup);

// PWA support - Add to home screen prompt
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show install button or banner
  const installBanner = `
        <div id="installBanner" class="install-banner">
            <span>Install Calendar App for quick access!</span>
            <button id="installBtn">Install</button>
            <button id="dismissBtn">×</button>
        </div>
    `;

  $("body").prepend(installBanner);

  $("#installBtn").click(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        showMessage("App installed successfully!", "success");
      }
      deferredPrompt = null;
      $("#installBanner").remove();
    }
  });

  $("#dismissBtn").click(() => {
    $("#installBanner").remove();
  });
});

// Final initialization call
console.log("Calendar application initialized successfully");
