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
    const eventTimeInput = document.getElementById("event-time");

    let selectedDate;
    let currentView = 'month';
    let currentDate = new Date(); // Use current date instead of hardcoded date

    // Initialize events with current year
    const currentYear = new Date().getFullYear();
    let events = {
        [`${currentYear}-02-16`]: [
            { 
                text: "MATH 381", 
                time: "20:00-21:00pm",
                location: "Davis Library",
                buddies: "Jane D., Angelina L., & Lauren L.",
                sessionType: "Practice Problems"
            },
            { 
                text: "COMP 126", 
                time: "15:00-17:30pm",
                location: "Student Union",
                buddies: "Jules K. & Lauren L.",
                sessionType: "Peer Teaching"
            },
            { 
                text: "COMP 590", 
                time: "21:00-22:00pm",
                location: "Davis Library",
                buddies: "Jacob F. & Kibby P.",
                sessionType: "Lecture Review"
            }
        ]
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
                
                if (currentDay.getMonth() === date.getMonth()) {
                    const dateDiv = document.createElement('div');
                    dateDiv.className = 'date-number';
                    dateDiv.textContent = currentDay.getDate();
                    cell.appendChild(dateDiv);
                    
                    const eventContainer = document.createElement('div');
                    eventContainer.className = 'event-container';
                    
                    if (events[dateString] && Array.isArray(events[dateString])) {
                        const sortedEvents = events[dateString].sort((a, b) => {
                            const timeA = a.time || '23:59'; // Default to end of day if no time
                            const timeB = b.time || '23:59';
                            return timeA.localeCompare(timeB);
                        });
                        
                        sortedEvents.forEach(event => {
                            const eventDiv = createEventElement(event, dateString);
                            eventContainer.appendChild(eventDiv);
                        });
                    }
                    
                    cell.appendChild(eventContainer);
                    
                    cell.addEventListener('click', () => {
                        console.log('Clicked date:', dateString);
                        openEventModal(dateString);
                    });
                    
                    if (isToday(currentDay)) {
                        cell.classList.add('today');
                    }
                } else {
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
                // Check if event text contains subject, case-insensitive
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
        selectedDateText.textContent = `Add study sesh for ${new Date(dateString).toLocaleDateString()}`;
        eventInput.value = '';
        eventTimeInput.value = '';
        eventTimeInput.placeholder = "e.g., 09:00-10:30 or 14:00";
        modal.style.display = 'block';
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
            const eventText = eventInput.value.trim();
            const eventTime = eventTimeInput.value;
            const eventLocation = document.getElementById('event-location').value.trim();
            const eventBuddies = document.getElementById('event-buddies').value.trim();
            const sessionType = document.getElementById('session-type').value;
            
            events[selectedDate].push({
                text: eventText,
                time: eventTime,
                location: eventLocation,
                buddies: eventBuddies,
                sessionType: sessionType
            });
            
            modal.style.display = 'none';
            if (currentView === 'week') {
                displayWeekView(currentDate);
            } else {
                displayMonthView(currentDate);
            }
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
        weekRow.style.height = '500px';
        
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
            
            // Add existing events sorted by time
            if (events[dateString] && Array.isArray(events[dateString])) {
                const sortedEvents = events[dateString].sort((a, b) => {
                    const timeA = a.time || '23:59'; // Default to end of day if no time
                    const timeB = b.time || '23:59';
                    return timeA.localeCompare(timeB);
                });
                
                sortedEvents.forEach(event => {
                    const eventDiv = createEventElement(event, dateString);
                    eventContainer.appendChild(eventDiv);
                });
            }
            
            cell.appendChild(eventContainer);
            
            // Add click event to cell
            cell.addEventListener('click', () => {
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

    function createEventElement(eventData, dateString) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';
        
        const eventContent = document.createElement('div');
        eventContent.className = 'event-content';
        
        const timeElement = document.createElement('div');
        timeElement.className = 'event-time';
        
        const textElement = document.createElement('div');
        textElement.className = 'event-text';
        
        if (typeof eventData === 'string') {
            textElement.textContent = eventData;
        } else {
            const timeStr = eventData.time ? formatTime(eventData.time) : '';
            timeElement.textContent = timeStr;
            textElement.textContent = eventData.text;
            if (eventData.location) {
                textElement.textContent += ` @ ${eventData.location}`;
            }
        }
        
        eventContent.appendChild(timeElement);
        eventContent.appendChild(textElement);
        eventDiv.appendChild(eventContent);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-event';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            events[dateString] = events[dateString].filter(e => 
                (typeof e === 'string' ? e !== eventData : e.text !== eventData.text)
            );
            eventDiv.remove();
        };
        eventDiv.appendChild(deleteBtn);
        
        eventDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            showEventDetails(eventData, dateString);
        });
        
        return eventDiv;
    }

    function formatTime(timeStr) {
        if (!timeStr) return '';
        
        // Check if it's a time range (contains a hyphen)
        if (timeStr.includes('-')) {
            const [start, end] = timeStr.split('-');
            return `${formatSingleTime(start)} - ${formatSingleTime(end)}`;
        }
        
        // Single time
        return formatSingleTime(timeStr);
    }

    function formatSingleTime(time) {
        if (!time) return '';
        time = time.replace(/[ap]m/i, '').trim();
        
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hours12 = hour % 12 || 12;
        return `${hours12}:${minutes || '00'} ${period}`;
    }

    function showEventDetails(eventData, dateString) {
        const detailsModal = document.getElementById('event-details-modal');
        const dateElement = document.getElementById('details-date');
        const timeElement = document.getElementById('details-time');
        const textElement = document.getElementById('details-text');
        const locationElement = document.getElementById('details-location');
        const buddiesElement = document.getElementById('details-buddies');
        const sessionElement = document.getElementById('details-session-type');
        
        // Format date
        const formattedDate = new Date(dateString).toLocaleDateString();
        dateElement.textContent = `Date: ${formattedDate}`;
        
        // Set time, text, location, buddies, and session type
        if (typeof eventData === 'string') {
            timeElement.textContent = 'Time: Not specified';
            textElement.textContent = `Event: ${eventData}`;
            locationElement.textContent = 'Location: Not specified';
            buddiesElement.textContent = 'Study Buddies: None';
            sessionElement.textContent = 'Session Type: Not specified';
        } else {
            timeElement.textContent = `Time: ${formatTime(eventData.time) || 'Not specified'}`;
            textElement.textContent = `Subject: ${eventData.text}`;
            locationElement.textContent = `Location: ${eventData.location || 'Not specified'}`;
            buddiesElement.textContent = `Study Buddies: ${eventData.buddies || 'None'}`;
            sessionElement.textContent = `Session Type: ${eventData.sessionType || 'Not specified'}`;
        }
        
        detailsModal.style.display = 'block';
    }

    // Add event details modal close button handler
    const closeDetailsBtn = document.querySelector('.close-details');
    const detailsModal = document.getElementById('event-details-modal');
    
    closeDetailsBtn.onclick = function() {
        detailsModal.style.display = 'none';
    }
    
    // Close details modal when clicking outside
    window.onclick = function(event) {
        if (event.target == detailsModal) {
            detailsModal.style.display = 'none';
        } else if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});
