const mongoose = require('mongoose');
require('dotenv').config();

async function audit() {
  await mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/travel-app',
  );

  // Find the tour date for 25 March 2026
  const tourDates = await mongoose.connection.db
    .collection('tourdates')
    .find({})
    .toArray();

  for (const td of tourDates) {
    const bookings = await mongoose.connection.db
      .collection('bookings')
      .find({ tourDate: td._id })
      .toArray();

    const confirmedTravelers = bookings
      .filter((b) => b.status === 'CONFIRMED')
      .reduce((sum, b) => sum + (b.totalTravelers || b.travelers.length), 0);

    const pendingTravelers = bookings
      .filter((b) => b.status === 'PENDING')
      .reduce((sum, b) => sum + (b.totalTravelers || b.travelers.length), 0);

    const cancelledTravelers = bookings
      .filter((b) => b.status === 'CANCELLED')
      .reduce((sum, b) => sum + (b.totalTravelers || b.travelers.length), 0);

    console.log(`\nTour Date: ${td.startDate} (ID: ${td._id})`);
    console.log(`Stored bookedSeats: ${td.bookedSeats}`);
    console.log(`Actual Confirmed seats: ${confirmedTravelers}`);
    console.log(`Actual Pending seats: ${pendingTravelers}`);
    console.log(`Actual Cancelled (should be 0): ${cancelledTravelers}`);
    console.log(
      `Sum of Confirmed + Pending: ${confirmedTravelers + pendingTravelers}`,
    );

    if (td.bookedSeats !== confirmedTravelers + pendingTravelers) {
      console.log(
        `!!! DISCREPANCY DETECTED !!! Diff: ${td.bookedSeats - (confirmedTravelers + pendingTravelers)}`,
      );
    }
  }

  await mongoose.disconnect();
}

audit();
