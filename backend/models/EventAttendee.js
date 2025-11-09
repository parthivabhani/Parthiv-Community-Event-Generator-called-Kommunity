const mongoose = require('mongoose');

const eventAttendeeSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure a user can only register once per event
eventAttendeeSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('EventAttendee', eventAttendeeSchema);
