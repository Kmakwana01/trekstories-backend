const mongoose = require('mongoose');
const { Schema } = mongoose;

async function run() {
  await mongoose.connect(
    'mongodb+srv://shivanshholidays27_db_user:b4ItaFgjx3CV6vON@cluster0.kp2yu75.mongodb.net/travel?retryWrites=true&w=majority&appName=Cluster0',
  );
  console.log('connected');

  const tourSchema = new Schema({}, { strict: false });
  const Tour = mongoose.model('Tour', tourSchema, 'tours');

  const bookingSchema = new Schema({}, { strict: false });
  const Booking = mongoose.model('Booking', bookingSchema, 'bookings');

  const mapType = {
    AC: '3TIER_AC_TRAIN',
    NON_AC: 'NON_AC_TRAIN',
    FLIGHT: 'BOTH_SIDE_FLIGHT',
    TRAIN: 'NON_AC_TRAIN',
  };

  const tours = await Tour.find({});
  for (let tour of tours) {
    let changed = false;

    let arr = tour.get('departureOptions');
    if (arr && Array.isArray(arr)) {
      arr.forEach((opt) => {
        if (mapType[opt.type]) {
          opt.type = mapType[opt.type];
          changed = true;
        }
      });
    }
    if (changed) {
      await Tour.updateOne(
        { _id: tour._id },
        { $set: { departureOptions: arr } },
      );
      console.log(`Updated tour ${tour._id}`);
    }
  }

  const bookings = await Booking.find({});
  for (let booking of bookings) {
    let changed = false;
    let pOpt = booking.get('pickupOption');
    if (pOpt && pOpt.type) {
      if (mapType[pOpt.type]) {
        pOpt.type = mapType[pOpt.type];
        changed = true;
      }
    }
    if (changed) {
      await Booking.updateOne(
        { _id: booking._id },
        { $set: { pickupOption: pOpt } },
      );
      console.log(`Updated booking ${booking._id}`);
    }
  }
  console.log('done');
  process.exit(0);
}
run();
