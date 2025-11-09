const Event = require('../models/Event');
const EventAttendee = require('../models/EventAttendee');

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { search } = req.query;
    const currentDate = new Date();

    let query = { date: { $gte: currentDate } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query).sort({ date: 1 });

    // Get attendee counts for each event
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const attendeeCount = await EventAttendee.countDocuments({ eventId: event._id });
        return {
          ...event.toObject(),
          attendeeCount
        };
      })
    );

    res.json(eventsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creatorId', 'fullName email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const attendeeCount = await EventAttendee.countDocuments({ eventId: event._id });

    res.json({
      ...event.toObject(),
      attendeeCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, imageUrl, maxAttendees } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      imageUrl,
      maxAttendees,
      creatorId: req.user._id
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await EventAttendee.findOne({
      eventId: req.params.id,
      userId: req.user._id
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Check max attendees
    if (event.maxAttendees) {
      const currentAttendees = await EventAttendee.countDocuments({ eventId: event._id });
      if (currentAttendees >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event is full' });
      }
    }

    const registration = await EventAttendee.create({
      eventId: req.params.id,
      userId: req.user._id
    });

    res.status(201).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unregister from event
// @route   DELETE /api/events/:id/register
// @access  Private
const unregisterFromEvent = async (req, res) => {
  try {
    const registration = await EventAttendee.findOneAndDelete({
      eventId: req.params.id,
      userId: req.user._id
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.json({ message: 'Unregistered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check if user is registered
// @route   GET /api/events/:id/check-registration
// @access  Private
const checkRegistration = async (req, res) => {
  try {
    const registration = await EventAttendee.findOne({
      eventId: req.params.id,
      userId: req.user._id
    });

    res.json({ isRegistered: !!registration });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get events created by user
// @route   GET /api/events/my/created
// @access  Private
const getMyCreatedEvents = async (req, res) => {
  try {
    const events = await Event.find({ creatorId: req.user._id }).sort({ date: 1 });

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const attendeeCount = await EventAttendee.countDocuments({ eventId: event._id });
        return {
          ...event.toObject(),
          attendeeCount
        };
      })
    );

    res.json(eventsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get events user is attending
// @route   GET /api/events/my/attending
// @access  Private
const getMyAttendingEvents = async (req, res) => {
  try {
    const registrations = await EventAttendee.find({ userId: req.user._id }).populate('eventId');

    const events = registrations
      .map(reg => reg.eventId)
      .filter(event => event && event.creatorId.toString() !== req.user._id.toString());

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const attendeeCount = await EventAttendee.countDocuments({ eventId: event._id });
        return {
          ...event.toObject(),
          attendeeCount
        };
      })
    );

    res.json(eventsWithCounts.sort((a, b) => new Date(a.date) - new Date(b.date)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  registerForEvent,
  unregisterFromEvent,
  checkRegistration,
  getMyCreatedEvents,
  getMyAttendingEvents
};
