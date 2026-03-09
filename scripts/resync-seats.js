const mongoose = require('mongoose');
require('dotenv').config();

async function resync() {
  await mongoose.connect(
    process.env.MONGO_URI || 'mongodb://localhost:27017/travel-app',
  );

  // Find all tour dates
  const tourDates = await mongoose.connection.db
    .collection('tourdates')
    .find({})
    .toArray();

  console.log(`Auditing and Resyncing ${tourDates.length} tour dates...`);

  for (const td of tourDates) {
    // Find all active bookings (CONFIRMED or PENDING)
    // Note: We include PENDING because seats are reserved at creation.
    const bookings = await mongoose.connection.db
      .collection('bookings')
      .find({
        tourDate: td._id,
        status: { $in: ['CONFIRMED', 'PENDING'] },
      })
      .toArray();

    const actualBooked = bookings.reduce((sum, b) => {
      const count = b.totalTravelers || (b.travelers ? b.travelers.length : 0);
      return sum + count;
    }, 0);

    if (td.bookedSeats !== actualBooked) {
      console.log(`\nTour Date: ${td.startDate} (${td._id})`);
      console.log(`  Current: ${td.bookedSeats}`);
      console.log(`  Actual:  ${actualBooked}`);
      console.log(`  Fixing...`);

      await mongoose.connection.db
        .collection('tourdates')
        .updateOne({ _id: td._id }, { $set: { bookedSeats: actualBooked } });

      // Also check if we should revert from FULL to UPCOMING
      if (actualBooked < td.totalSeats && td.status === 'FULL') {
        console.log(`  Reverting status to UPCOMING...`);
        await mongoose.connection.db
          .collection('tourdates')
          .updateOne({ _id: td._id }, { $set: { status: 'UPCOMING' } });
      }
    }
  }

  console.log('\nResync complete.');
  await mongoose.disconnect();
}

resync();
