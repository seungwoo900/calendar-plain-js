let clicked = null;
let nav = 0;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openNewEventModal(date) {
    clicked = date;
    newEventModal.style.display = 'block';
    backDrop.style.display = 'block';
}

function openDeleteEventModal(date) {
    clicked = date;

    const eventForDay = events.find(e => e.date === clicked);
    document.getElementById('eventText').innerText = eventForDay.title;

    deleteEventModal.style.display = 'block';
    backDrop.style.display = 'block';
}

function load() {
    const dt = new Date();

    if(nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayInMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month+1, 0).getDate();
    const dateString = firstDayInMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = week.indexOf(dateString.split(',')[0]);

    document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us',{month:'long'})} ${year}`;

    calendar.innerHTML = '';

    for(let i=1; i<=paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month+1}/${i-paddingDays}/${year}`;

        if(i > paddingDays) {
            daySquare.innerText = i - paddingDays;

            const eventForDay = events.filter(e => e.date === dayString);
            
            if(i - paddingDays === day && nav === 0) {
                daySquare.id = "currentDay";
            }

            eventForDay.forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = event.title;
                eventDiv.addEventListener('click', (event) => {
                    event.stopPropagation();  // Prevent the click from bubbling up to the daySquare
                    openDeleteEventModal(dayString);
                });

                daySquare.appendChild(eventDiv);
            });

            daySquare.addEventListener('click', () => openNewEventModal(dayString));
        } else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }
}

function saveEvent() {
    if(eventTitleInput.value) {
        eventTitleInput.classList.remove('error');

        events.push({
            date: clicked,
            title: eventTitleInput.value,
        });

        localStorage.setItem('events', JSON.stringify(events));
        closeModal();
    } else {
        eventTitleInput.classList.add('error');
    }
}

function closeModal() {
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    deleteEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    eventTitleInput.value = '';
    clicked = null;
    load();
}

function deleteEvent() {
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
}

function goToday() {
    nav = 0;
    load();
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('saveButton').addEventListener('click', saveEvent);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('closeButton').addEventListener('click', closeModal);
    document.getElementById('deleteButton').addEventListener('click', deleteEvent);
    document.getElementById('today').addEventListener('click', goToday);
}

initButtons();
load();