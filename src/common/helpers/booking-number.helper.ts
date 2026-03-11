import { Model } from 'mongoose';
import { DateUtil } from '../../utils/date.util';

export async function generateBookingNumber(
  model: Model<any>,
  field: string = 'bookingNumber',
): Promise<string> {
  const dateStr = DateUtil.nowIST().format('YYYYMMDD'); // YYYYMMDD in IST
  const prefix = `TRV-${dateStr}-`;

  // Find the last booking number for today
  const lastBooking = await model
    .findOne({ [field]: { $regex: (key) => `^${prefix}` } }) // Regex via JS logic or query
    .sort({ [field]: -1 })
    .exec();

  // Mongoose Regex Query: { bookingNumber: { $regex: new RegExp(`^${prefix}`) } }
  // Correct implementation below:

  const lastBookingCorrect = await model
    .findOne({ [field]: new RegExp(`^${prefix}`) })
    .sort({ [field]: -1 })
    .exec();

  let nextSequence = 1;
  if (lastBookingCorrect) {
    const lastSequenceStr = lastBookingCorrect[field].split('-').pop();
    nextSequence = parseInt(lastSequenceStr, 10) + 1;
  }

  // Pad with zeros to 4 digits
  const sequenceStr = nextSequence.toString().padStart(4, '0');

  return `${prefix}${sequenceStr}`;
}
