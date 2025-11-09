const express = require('express');
const {
  getEvents,
  getEventById,
  createEvent,
  registerForEvent,
  unregisterFromEvent,
  checkRegistration,
  getMyCreatedEvents,
  getMyAttendingEvents
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Protected routes
router.post('/', protect, createEvent);
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, unregisterFromEvent);
router.get('/:id/check-registration', protect, checkRegistration);
router.get('/my/created', protect, getMyCreatedEvents);
router.get('/my/attending', protect, getMyAttendingEvents);

module.exports = router;
