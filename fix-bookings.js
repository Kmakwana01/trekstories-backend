const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(
    'mongodb+srv://shivanshholidays27_db_user:b4ItaFgjx3CV6vON@cluster0.kp2yu75.mongodb.net/travel?retryWrites=true&w=majority&appName=Cluster0',
  );
  console.log('Connected to DB');

  const db = mongoose.connection.db;

  const mapType = {
    AC: '3TIER_AC_TRAIN',
    NON_AC: 'NON_AC_TRAIN',
    FLIGHT: 'BOTH_SIDE_FLIGHT',
    TRAIN: 'NON_AC_TRAIN',
  };

  const bookings = await db.collection('bookings').find({}).toArray();
  for (const booking of bookings) {
    let changed = false;
    const pOpt = booking.pickupOption;
    if (pOpt && pOpt.type && mapType[pOpt.type]) {
      pOpt.type = mapType[pOpt.type];
      changed = true;
    }

    if (changed) {
      await db
        .collection('bookings')
        .updateOne({ _id: booking._id }, { $set: { pickupOption: pOpt } });
      console.log(`Updated booking: ${booking._id}`);
    }
  }

  console.log('Bookings Done');
  process.exit(0);
}

run();
