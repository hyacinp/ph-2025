document.addEventListener("DOMContentLoaded", function() {
    const calendarBody = document.getElementById("calendar-body");
    const calendarTitle = document.getElementById("calendar-title");
    const modal = document.getElementById("event-modal");
    const closeModal = document.querySelector(".close");
    const eventInput = document.getElementById("event-input");
    const saveEventButton = document.getElementById("save-event");
    const selectedDateText = document.getElementById("selected-date");
    const eventFilter = document.getElementById("subject-filter");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    let selectedDate;
    let currentView = 'month';
    let currentDate = new Date(); // Use current date instead of hardcoded date

    // Initialize events with current year
    const currentYear = new Date().getFullYear();
    let events = {
        [`${currentYear}-02-14`]: ["Study Group: Math", "Team Meeting"],
        [`${currentYear}-02-15`]: ["Physics Lab", "Coffee with Friends"],
        [`${currentYear}-02-16`]: ["Study Group: Chemistry", "Project Meeting"],
        [`${currentYear}-02-17`]: ["Biology Study Session", "Group Project"],
        [`${currentYear}-02-18`]: ["Coffee Break", "Team Standup"]
    };

    function displayMonthView(date) {
        const calendarWrapper = document.querySelector('.calendar-wrapper');
        calendarWrapper.classList.remove('week-view');
        const tbody = document.getElementById('calendar-body');
        tbody.innerHTML = '';
        
        const monthName = date.toLocaleString('default', { month: 'long' });
        document.querySelector('.month-header h2').textContent = 
            `${monthName} ${date.getFullYear()}`;
        
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        let currentDay = new Date(firstDay);
        currentDay.setDate(currentDay.getDate() - currentDay.getDay());
        
        while (currentDay <= lastDay || currentDay.getDay() !== 0) {
            const week = document.createElement('tr');
            
            for (let i = 0; i < 7; i++) {
                const cell = document.createElement('td');
                const dateString = formatDate(currentDay);
                
                // Only display content if date is in current month
                if (currentDay.getMonth() === date.getMonth()) {
                    // Create date number div
                    const dateDiv = document.createElement('div');
                    dateDiv.className = 'date-number';
                    dateDiv.textContent = currentDay.getDate();
                    cell.appendChild(dateDiv);
                    
                    // Create container for events
                    const eventContainer = document.createElement('div');
                    eventContainer.className = 'event-container';
                    
                    // Add existing events if any
                    if (events[dateString] && Array.isArray(events[dateString])) {
                        events[dateString].forEach(event => {
                            const eventDiv = createEventElement(event, dateString);
                            eventContainer.appendChild(eventDiv);
                        });
                    }
                    
                    cell.appendChild(eventContainer);
                    
                    // Add click event to cell
                    cell.addEventListener('click', () => {
                        console.log('Clicked date:', dateString);
                        openEventModal(dateString);
                    });
                    
                    if (isToday(currentDay)) {
                        cell.classList.add('today');
                    }
                } else {
                    // Empty cell for dates not in current month
                    cell.classList.add('other-month');
                }
                
                week.appendChild(cell);
                currentDay.setDate(currentDay.getDate() + 1);
            }
            
            tbody.appendChild(week);
        }
    }

    function filterEvents(subject) {
        const eventElements = document.querySelectorAll('.event');
        eventElements.forEach(el => {
            if (subject === 'all') {
                el.style.display = 'block';  // Show all events
            } else {
                // Check if event text contains the subject, case-insensitive
                el.style.display = el.textContent.toLowerCase().includes(subject.toLowerCase()) 
                    ? 'block' 
                    : 'none';
            }
        });
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    function openEventModal(dateString) {
        selectedDate = dateString;
        selectedDateText.textContent = `Add event for ${new Date(dateString).toLocaleDateString()}`;
        eventInput.value = '';
        modal.style.display = 'block';
        console.log('Opening modal for date:', dateString); // Debug log
    }

    // Event Listeners
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    saveEventButton.onclick = function() {
        if (eventInput.value.trim() !== '') {
            if (!events[selectedDate]) {
                events[selectedDate] = [];
            }
            events[selectedDate].push(eventInput.value.trim());
            console.log('Updated events:', events); // Debug log
            modal.style.display = 'none';
            displayMonthView(currentDate);
        }
    }

    eventFilter.addEventListener('change', function(e) {
        filterEvents(e.target.value);
    });

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
            const dateString = formatDate(currentDate);
            
            const cell = document.createElement('td');
            
            // Create date number div
            const dateDiv = document.createElement('div');
            dateDiv.className = 'date-number';
            dateDiv.textContent = currentDate.getDate();
            cell.appendChild(dateDiv);
            
            // Create container for events
            const eventContainer = document.createElement('div');
            eventContainer.className = 'event-container';
            
            // Add existing events if any
            if (events[dateString] && Array.isArray(events[dateString])) {
                events[dateString].forEach(event => {
                    const eventDiv = createEventElement(event, dateString);
                    eventContainer.appendChild(eventDiv);
                });
            }
            
            cell.appendChild(eventContainer);
            
            // Add click event to cell
            cell.addEventListener('click', () => {
                console.log('Clicked date:', dateString);
                openEventModal(dateString);
            });
            
            if (isToday(currentDate)) {
                cell.classList.add('today');
            }
            
            weekRow.appendChild(cell);
        }
        
        tbody.appendChild(weekRow);
    }

    // Add click handlers for navigation buttons
    prevBtn.addEventListener('click', () => {
        if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
            displayWeekView(currentDate);
        } else {
            currentDate.setMonth(currentDate.getMonth() - 1);
            displayMonthView(currentDate);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
            displayWeekView(currentDate);
        } else {
            currentDate.setMonth(currentDate.getMonth() + 1);
            displayMonthView(currentDate);
        }
    });

    function createEventElement(event, dateString) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        
        // Create event text
        const eventText = document.createElement('span');
        eventText.textContent = event;
        eventDiv.appendChild(eventText);
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-event';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent cell click event
            // Remove event from events object
            events[dateString] = events[dateString].filter(e => e !== event);
            // Remove from display
            eventDiv.remove();
        };
        eventDiv.appendChild(deleteBtn);
        
        return eventDiv;
    }
});
