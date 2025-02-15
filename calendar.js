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
    let currentView = 'month';
    let currentDate = new Date();

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

    // Initial calendar render
    displayMonthView(currentDate);

    // Add view selector event listener
    document.getElementById('view-selector').addEventListener('change', function(e) {
        currentView = e.target.value;
        if (currentView === 'week') {
            displayWeekView(currentDate);
        } else {
            displayMonthView(currentDate);
        }
    });

    function displayWeekView(date) {
        const calendarWrapper = document.querySelector('.calendar-wrapper');
        calendarWrapper.classList.add('week-view');
        const tbody = document.getElementById('calendar-body');
        tbody.innerHTML = '';
        
        // Update month header
        const monthName = date.toLocaleString('default', { month: 'long' });
        document.querySelector('.month-header h2').textContent = 
            `${monthName}`;
        
        // Get the first day of the week (Sunday)
        const firstDayOfWeek = new Date(date);
        firstDayOfWeek.setDate(date.getDate() - date.getDay());
        
        // Create week row
        const weekRow = document.createElement('tr');
        weekRow.style.height = '500px'; // Make row taller for weekly view
        
        // Create 7 cells for each day of the week
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(firstDayOfWeek);
            currentDate.setDate(firstDayOfWeek.getDate() + i);
            
            const cell = document.createElement('td');
            cell.textContent = currentDate.getDate();
            
            if (isToday(currentDate)) {
                cell.classList.add('today');
            }
            
            weekRow.appendChild(cell);
        }
        
        tbody.appendChild(weekRow);
    }

    function displayMonthView(date) {
        const calendarWrapper = document.querySelector('.calendar-wrapper');
        calendarWrapper.classList.remove('week-view');
        const tbody = document.getElementById('calendar-body');
        tbody.innerHTML = '';
        
        // Update month header
        const monthName = date.toLocaleString('default', { month: 'long' });
        document.querySelector('.month-header h2').textContent = monthName;
        
        // Get first day of the month
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        let currentDay = new Date(firstDay);
        currentDay.setDate(currentDay.getDate() - currentDay.getDay()); // Start from Sunday
        
        while (currentDay <= lastDay || currentDay.getDay() !== 0) {
            const week = document.createElement('tr');
            
            // Create 7 cells for each day of the week
            for (let i = 0; i < 7; i++) {
                const cell = document.createElement('td');
                
                if (currentDay.getMonth() === date.getMonth()) {
                    cell.textContent = currentDay.getDate();
                    
                    if (isToday(currentDay)) {
                        cell.classList.add('today');
                    }
                }
                
                week.appendChild(cell);
                currentDay.setDate(currentDay.getDate() + 1);
            }
            
            tbody.appendChild(week);
        }
    }

    function getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000));
        return Math.ceil((days + firstDayOfYear.getDay() + 1) / 7);
    }

    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }
});
