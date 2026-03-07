const fs = require('fs');

let code = fs.readFileSync('src/seed.ts', 'utf8');

// Remove outdated fields
code = code.replace(/\s*maxGroupSize:\s*\d+,/g, '');
code = code.replace(/\s*difficultyLevel:\s*'[^']+',/g, '');

// Update field totalReviews -> reviewCount, add missing fields
code = code.replace(
  /totalReviews:\s*0,/g,
  'reviewCount: 0,\n            faqs: [],\n            isDeleted: false,\n            deletedAt: null,',
);

// Fix paymentType and paymentMethod
code = code.replace(
  /pendingAmount:\s*0,/g,
  "pendingAmount: 0,\n        paymentType: 'ONLINE',",
);
code = code.replace(
  /amount:\s*booking.totalAmount,\n\s*paymentType:\s*'online',/g,
  "amount: booking.totalAmount,\n        method: 'ONLINE',",
);

fs.writeFileSync('src/seed.ts', code);
console.log('Seed updated');
