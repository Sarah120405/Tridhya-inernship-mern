import {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getMyRecentEvents,
} from "./event.service.js";

export async function createEventController(req, res) {
  const { title, description, date, location, capacity, price, category } =
    req.body;
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Event banner is required",
      });
    }
    const eventBanner = `/uploads/${req.file.filename}`;
    const event = await createEvent(
      {
        title,
        description,
        date,
        location,
        capacity,
        price,
        category,
        eventBanner,
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
    const { search, category } = req.query;
    const events = await getAllEvents({ search, category });
    res.status(200).json(events);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function updateEventController(req, res) {
  try {
    const newBannerPath = req.file ? `/uploads/${req.file.filename}` : null;
    const event = await updateEvent(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body,
      newBannerPath,
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

export async function getMyRecentEventsController(req, res) {
  try {
    const events = await getMyRecentEvents(req.user.id);
    res.status(200).json(events);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
