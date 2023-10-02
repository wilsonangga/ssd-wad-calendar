"use client"
import React, { useState, useEffect, useRef } from 'react';

function App() {
  const [clicked, setClicked] = useState(null);
  const [events, setEvents] = useState(
    localStorage.getItem('events')
      ? JSON.parse(localStorage.getItem('events'))
      : []
  );
  const [eventText, setEventText] = useState('');
  const [eventTitleInput, setEventTitleInput] = useState('');
  const [eventInviteesInput, setEventInviteesInput] = useState('');
  const [eventTimeInput, setEventTimeInput] = useState('');
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const calendarRef = useRef(null);
  const newEventModalRef = useRef(null);
  const modalBackDropRef = useRef(null);
  const deleteEventModalRef = useRef(null)

  const openModal = (date) => {
    setClicked(date);
    const eventForDay = events.find((e) => e.date === date);
    if (eventForDay) {
      setEventText(eventForDay.title);
      deleteEventModalRef.current.style.display = 'block'
    } else {
      newEventModalRef.current.style.display = 'block';
    }
    modalBackDropRef.current.style.display = 'block'
  };

  const closeModal = () => {
    newEventModalRef.current.style.display = 'none';
    deleteEventModalRef.current.style.display = 'none'
    modalBackDropRef.current.style.display = 'none'
    setEventTitleInput('');
    setClicked(null);
  };

  const saveEvent = () => {
    if (eventTitleInput) {
      const updatedEvents = [...events];
      updatedEvents.push({
        date: clicked,
        title: eventTitleInput,
        invitees: eventInviteesInput,
        time: eventTimeInput
      });
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      newEventModalRef.current.style.display = 'none';
      setEventTitleInput('');
      modalBackDropRef.current.style.display = 'none'
      window.location.reload();
    }
  };

  const deleteEvent = () => {
    const updatedEvents = events.filter((e) => e.date !== clicked);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    deleteEventModalRef.current.style.display = 'none'
    modalBackDropRef.current.style.display = 'none'
    setClicked(null);
    window.location.reload();
  };

  const loadCalendar = () => {
    const dt = new Date();

    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    const calendar = calendarRef.current;

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = document.createElement('div');
      daySquare.classList.add('day');

      const dayString = `${month + 1}/${i - paddingDays}/${year}`;

      if (i > paddingDays) {
        daySquare.innerText = i - paddingDays;
        const eventForDay = events.find((e) => e.date === dayString);

        if (i - paddingDays === day) {
          daySquare.id = 'currentDay';
        }

        if (eventForDay) {
          const eventDiv = document.createElement('div');
          eventDiv.classList.add('event');
          eventDiv.innerHTML = eventForDay.title + "<br />" + eventForDay.invitees + "<br />" + eventForDay.time;
          daySquare.appendChild(eventDiv);
        }

        daySquare.addEventListener('click', () => openModal(dayString));
        // daySquare.addEventListener('click', () => console.log("click"));
      } else {
        daySquare.classList.add('padding');
      }

      calendar.appendChild(daySquare);
    }
  }

  useEffect(() => {
    if (calendarRef.current.children.length === 0) {
      loadCalendar()
    }
  }, []);

  return (
    <div className="App">
      <div id="container">

        <div id="weekdays">
          <div>Sunday</div>
          <div>Monday</div>
          <div>Tuesday</div>
          <div>Wednesday</div>
          <div>Thursday</div>
          <div>Friday</div>
          <div>Saturday</div>
        </div>

        <div id="calendar" ref={calendarRef}></div>
      </div>

      <div id="newEventModal" ref={newEventModalRef}>
        <h2>New Event</h2>
        <input
          id="eventTitleInput"
          placeholder="Event Title"
          value={eventTitleInput}
          onChange={(e) => setEventTitleInput(e.target.value)}
        />
        <input
          id="eventInviteesInput"
          placeholder="Event Invitess"
          value={eventInviteesInput}
          onChange={(e) => setEventInviteesInput(e.target.value)}
        />
        <input
          type="time"
          id="eventTimeInput"
          placeholder="Event Time"
          value={eventTimeInput}
          onChange={(e) => setEventTimeInput(e.target.value)}
        />
        <button id="saveButton" onClick={saveEvent}>Save</button>
        <button id="cancelButton" onClick={closeModal}>Cancel</button>
      </div>

      <div id="deleteEventModal" ref={deleteEventModalRef}>
        <h2>Event</h2>
        <p id="eventText">{eventText}</p>
        <button id="deleteButton" onClick={deleteEvent}>Delete</button>
        <button id="closeButton" onClick={closeModal}>Close</button>
      </div>

      <div id="modalBackDrop" ref={modalBackDropRef}></div>
    </div>
  );
}

export default App;
