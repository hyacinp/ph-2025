document.addEventListener("DOMContentLoaded", function() {
    const calendarBody = document.getElementById("calendar-body");
    const calendarTitle = document.getElementById("calendar-title");
    const modal = document.getElementById("event-modal");
    const closeModal = document.querySelector(".close");
    const eventInput = document.getElementById("event-input");
    const saveEventButton = document.getElementById("save-event");
    const selectedDateText = document.getElementById("selected-date");

    let selectedDate;
    let events = {}; // Stores events in memory

    function generateCalendar(year, month) {
        calendarBody.innerHTML = ""; // Clear previous calendar
        let firstDay = new Date(year, month, 1).getDay();
        let daysInMonth = new Date(year, month + 1, 0).getDate();
        let date = 1;

        calendarTitle.textContent = new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" });

        for (let i = 0; i < 6; i++) {
            let row = document.createElement("tr");

            for (let j = 0; j < 7; j++) {
                let cell = document.createElement("td");

                if (i === 0 && j < firstDay) {
                    cell.textContent = "";
                } else if (date > daysInMonth) {
                    break;
                } else {
                    cell.textContent = date;
                    cell.dataset.date = `${year}-${month + 1}-${date}`;
                    cell.addEventListener("click", openEventModal);
                    
                    if (events[cell.dataset.date]) {
                        let eventTag = document.createElement("span");
                        eventTag.classList.add("event");
                        eventTag.textContent = events[cell.dataset.date];
                        cell.appendChild(eventTag);
                    }

                    date++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }
    }

    function openEventModal(event) {
        selectedDate = event.target.dataset.date;
        selectedDateText.textContent = `Add event for ${selectedDate}`;
        eventInput.value = events[selectedDate] || "";
        modal.style.display = "block";
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    saveEventButton.onclick = function() {
        if (eventInput.value.trim() !== "") {
            events[selectedDate] = eventInput.value;
        } else {
            delete events[selectedDate]; // Remove event if input is cleared
        }
        modal.style.display = "none";
        generateCalendar(currentYear, currentMonth);
    }

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    generateCalendar(currentYear, currentMonth);
});
