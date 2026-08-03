import { createEvent, getEventById, getAllEvents } from "./event.service.js";

export async function createEventController(req, res) {
  const { title, description, date, location, capacity } = req.body;
  try {
    const event = await createEvent(
      {
        title,
        description,
        date,
        location,
        capacity,
      },
      req.user.id,
    );
    console.log("Event created:", event);
    res.status(201).json(event);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getEventByIdController(req, res) {
  try {
    const event = await getEventById(req.params.id);
    res.status(200).json(event);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getAllEventsController(req, res) {
  try {
    const events = await getAllEvents();
    console.log("Fetched events:", events);
    res.status(200).json(events);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
