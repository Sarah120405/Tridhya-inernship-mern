import {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
} from "./event.service.js";

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
    res.status(200).json(events);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function updateEventController(req, res) {
  try {
    const event = await updateEvent(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body,
    );
    res.status(200).json(event);
  } catch (error) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function deleteEventController(req, res) {
  try {
    const event = await deleteEvent(req.params.id, req.user.id, req.user.role);
    res.status(200).json(event);
  } catch (error) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
