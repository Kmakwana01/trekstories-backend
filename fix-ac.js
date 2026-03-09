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

  const tours = await db.collection('tours').find({}).toArray();
  for (const tour of tours) {
    let changed = false;
    const opts = tour.departureOptions || [];
    opts.forEach((opt) => {
      if (mapType[opt.type]) {
        opt.type = mapType[opt.type];
        changed = true;
      }
    });

    if (changed) {
      await db
        .collection('tours')
        .updateOne({ _id: tour._id }, { $set: { departureOptions: opts } });
      console.log(`Updated tour: ${tour._id}`);
    }
  }

  console.log('Done');
  process.exit(0);
}

run();
