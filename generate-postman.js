// generate-postman.js
// Run with: node generate-postman.js
// Outputs: postman_collection.json

const fs = require('fs');

const BASE_URL = '{{baseUrl}}';

// ─── helpers ─────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10) + '-' + Date.now();

const bearer = (token = '{{accessToken}}') => ({
  type: 'bearer',
  bearer: [{ key: 'token', value: token, type: 'string' }],
});

const adminBearer = () => bearer('{{adminAccessToken}}');

const jsonBody = (raw) => ({
  mode: 'raw',
  raw: JSON.stringify(raw, null, 2),
  options: { raw: { language: 'json' } },
});

const formDataBody = (fields) => ({
  mode: 'formdata',
  formdata: fields,
});

/** Build a request item */
const req = (
  name,
  method,
  urlPath,
  { body, auth, description, params, headers } = {},
) => {
  const url = {
    raw: `${BASE_URL}${urlPath}`,
    host: [BASE_URL],
    path: urlPath.replace(/^\//, '').split('/'),
  };
  if (params && params.length) {
    url.query = params.map(({ key, value, description: d }) => ({
      key,
      value: value || '',
      description: d || '',
      disabled: false,
    }));
  }
  return {
    name,
    request: {
      method,
      header: headers || [{ key: 'Content-Type', value: 'application/json' }],
      ...(body ? { body } : {}),
      ...(auth ? { auth } : {}),
      url,
      description: description || '',
    },
    response: [],
    event: [],
    _postman_id: uid(),
  };
};

/** Build a folder */
const folder = (name, items, description = '') => ({
  name,
  description,
  item: items,
  _postman_id: uid(),
});

// ─── Pre-request: save tokens ─────────────────────────────────────────────────
const saveUserTokensScript = {
  listen: 'test',
  script: {
    exec: [
      'const res = pm.response.json();',
      'if (res.accessToken) {',
      '  pm.collectionVariables.set("accessToken", res.accessToken);',
      '  pm.environment.set("accessToken", res.accessToken);',
      '}',
      'if (res.refreshToken) {',
      '  pm.collectionVariables.set("refreshToken", res.refreshToken);',
      '  pm.environment.set("refreshToken", res.refreshToken);',
      '}',
      'if (res.user && res.user._id) {',
      '  pm.collectionVariables.set("userId", res.user._id);',
      '  pm.environment.set("userId", res.user._id);',
      '}',
      'pm.test("Status 200 or 201", () => {',
      '  pm.expect(pm.response.code).to.be.oneOf([200, 201]);',
      '});',
    ],
    type: 'text/javascript',
  },
};

const saveAdminTokensScript = {
  listen: 'test',
  script: {
    exec: [
      'const res = pm.response.json();',
      'if (res.accessToken) {',
      '  pm.collectionVariables.set("adminAccessToken", res.accessToken);',
      '  pm.environment.set("adminAccessToken", res.accessToken);',
      '}',
      'if (res.refreshToken) {',
      '  pm.collectionVariables.set("adminRefreshToken", res.refreshToken);',
      '  pm.environment.set("adminRefreshToken", res.refreshToken);',
      '}',
      'if (res.user && res.user._id) {',
      '  pm.collectionVariables.set("adminUserId", res.user._id);',
      '  pm.environment.set("adminUserId", res.user._id);',
      '}',
      'pm.test("Status 200 or 201", () => {',
      '  pm.expect(pm.response.code).to.be.oneOf([200, 201]);',
      '});',
    ],
    type: 'text/javascript',
  },
};

const saveIdScript = (varName) => ({
  listen: 'test',
  script: {
    exec: [
      'const res = pm.response.json();',
      `const id = res._id || res.id || (res.data && (res.data._id || res.data.id));`,
      `if (id) {`,
      `  pm.collectionVariables.set("${varName}", id);`,
      `  pm.environment.set("${varName}", id);`,
      `}`,
      'pm.test("Status 200 or 201", () => {',
      '  pm.expect(pm.response.code).to.be.oneOf([200, 201]);',
      '});',
    ],
    type: 'text/javascript',
  },
});

const basicTest = {
  listen: 'test',
  script: {
    exec: [
      'pm.test("Response OK", () => {',
      '  pm.expect(pm.response.code).to.be.oneOf([200, 201, 204]);',
      '});',
    ],
    type: 'text/javascript',
  },
};

const withEvent = (item, ...events) => ({ ...item, event: events });

// ─── Random email pre-request script ─────────────────────────────────────────
const randomEmailPreRequest = {
  listen: 'prerequest',
  script: {
    exec: [
      'const ts = Date.now();',
      'const randomEmail = `testuser_${ts}@mailinator.com`;',
      'pm.collectionVariables.set("randomEmail", randomEmail);',
      'pm.environment.set("randomEmail", randomEmail);',
    ],
    type: 'text/javascript',
  },
};

// ════════════════════════════════════════════════════════════════════════════════
//  USER SECTION
// ════════════════════════════════════════════════════════════════════════════════

// ─── Auth ────────────────────────────────────────────────────────────────────
const authFolder = folder(
  '🔐 Auth',
  [
    withEvent(
      req('Register User', 'POST', '/api/auth/register', {
        body: jsonBody({
          name: 'Test User',
          email: '{{randomEmail}}',
          phone: '+919876543210',
          password: 'Password@123',
          gender: 'male',
          dateOfBirth: '1995-06-15',
        }),
      }),
      randomEmailPreRequest,
      {
        listen: 'test',
        script: {
          exec: [
            'const res = pm.response.json();',
            'if (res.accessToken) { pm.collectionVariables.set("accessToken", res.accessToken); pm.environment.set("accessToken", res.accessToken); }',
            'if (res.refreshToken) { pm.collectionVariables.set("refreshToken", res.refreshToken); pm.environment.set("refreshToken", res.refreshToken); }',
            'pm.test("Register success", () => pm.expect(pm.response.code).to.be.oneOf([200, 201]));',
          ],
          type: 'text/javascript',
        },
      },
    ),
    withEvent(
      req('Login User', 'POST', '/api/auth/login', {
        body: jsonBody({
          identifier: 'user@example.com',
          password: 'Password@123',
        }),
      }),
      saveUserTokensScript,
    ),
    withEvent(
      req('Refresh Token', 'POST', '/api/auth/refresh', {
        auth: {
          type: 'bearer',
          bearer: [{ key: 'token', value: '{{refreshToken}}', type: 'string' }],
        },
      }),
      {
        listen: 'test',
        script: {
          exec: [
            'const res = pm.response.json();',
            'if (res.accessToken) { pm.collectionVariables.set("accessToken", res.accessToken); pm.environment.set("accessToken", res.accessToken); }',
            'pm.test("Tokens refreshed", () => pm.expect(pm.response.code).to.equal(200));',
          ],
          type: 'text/javascript',
        },
      },
    ),
    withEvent(
      req('Forgot Password', 'POST', '/api/auth/forgot-password', {
        body: jsonBody({ email: 'user@example.com' }),
      }),
      basicTest,
    ),
    withEvent(
      req('Reset Password', 'POST', '/api/auth/reset-password', {
        body: jsonBody({
          token: '{{resetToken}}',
          password: 'NewPassword@123',
        }),
      }),
      basicTest,
    ),
    withEvent(
      req('Get Me (Profile)', 'GET', '/api/auth/me', { auth: bearer() }),
      basicTest,
    ),
    withEvent(req('Logout', 'POST', '/api/auth/logout', { auth: bearer() }), {
      listen: 'test',
      script: {
        exec: [
          'pm.collectionVariables.set("accessToken", "");',
          'pm.collectionVariables.set("refreshToken", "");',
          'pm.test("Logged out", () => pm.expect(pm.response.code).to.be.oneOf([200, 201]));',
        ],
        type: 'text/javascript',
      },
    }),
    withEvent(
      req('Google OAuth (Browser Only)', 'GET', '/api/auth/google', {}),
      basicTest,
    ),
  ],
  'User authentication – register, login, token refresh, password reset',
);

// ─── Home ────────────────────────────────────────────────────────────────────
const homeFolder = folder(
  '🏠 Home',
  [
    withEvent(
      req('Featured Tours', 'GET', '/api/home/featured-tours'),
      basicTest,
    ),
    withEvent(
      req('Upcoming Departures', 'GET', '/api/home/upcoming-departures'),
      basicTest,
    ),
    withEvent(req('Active Offers', 'GET', '/api/home/offers'), basicTest),
    withEvent(req('Latest Blogs', 'GET', '/api/home/blogs'), basicTest),
    withEvent(
      req('Tours By State (All)', 'GET', '/api/home/tours-by-state'),
      basicTest,
    ),
    withEvent(
      req('Tours By State Name', 'GET', '/api/home/tours-by-state/Rajasthan', {
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '10' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Recently Viewed (auth)', 'GET', '/api/home/recently-viewed', {
        auth: bearer(),
      }),
      basicTest,
    ),
  ],
  'Home page endpoints',
);

// ─── Tours (Public) ───────────────────────────────────────────────────────────
const toursFolder = folder(
  '🗺️ Tours (Public)',
  [
    withEvent(
      req('Get All Tours', 'GET', '/api/tours', {
        params: [
          { key: 'page', value: '1', description: 'Page number' },
          { key: 'limit', value: '10', description: 'Items per page' },
          { key: 'location', value: '', description: 'Filter by location' },
          { key: 'state', value: '', description: 'Filter by state' },
          { key: 'category', value: '', description: 'Filter by category' },
          { key: 'priceMin', value: '', description: 'Minimum price' },
          { key: 'priceMax', value: '', description: 'Maximum price' },
          { key: 'durationDays', value: '', description: 'Duration in days' },
          { key: 'departureCity', value: '', description: 'Departure city' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Filter Options', 'GET', '/api/tours/filter-options'),
      basicTest,
    ),
    withEvent(
      req('Tours By State', 'GET', '/api/tours/state/Rajasthan', {
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '10' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Get Tour By Slug', 'GET', '/api/tours/{{tourSlug}}'),
      basicTest,
    ),
    withEvent(
      req('Get Tour Dates', 'GET', '/api/tours/{{tourId}}/dates'),
      basicTest,
    ),
  ],
  'Public tour browsing',
);

// ─── Bookings (User) ──────────────────────────────────────────────────────────
const bookingsFolder = folder(
  '📋 Bookings (User)',
  [
    withEvent(
      req('Preview Booking', 'POST', '/api/bookings/preview', {
        auth: bearer(),
        body: jsonBody({
          tourDateId: '{{tourDateId}}',
          pickupOptionIndex: 0,
          travelerCount: 2,
          couponCode: '',
        }),
      }),
      basicTest,
    ),
    withEvent(
      req('Create Booking', 'POST', '/api/bookings/create', {
        auth: bearer(),
        body: jsonBody({
          tourDateId: '{{tourDateId}}',
          pickupOptionIndex: 0,
          travelers: [
            {
              fullName: 'John Doe',
              age: 30,
              gender: 'male',
              phone: '+919876543210',
              idNumber: 'ABCD1234',
            },
            {
              fullName: 'Jane Doe',
              age: 28,
              gender: 'female',
              phone: '+919876543211',
              idNumber: 'EFGH5678',
            },
          ],
          couponCode: '',
          additionalRequests: 'Vegetarian meals preferred',
        }),
      }),
      saveIdScript('bookingId'),
    ),
    withEvent(
      req('My Bookings', 'GET', '/api/bookings/my-bookings', {
        auth: bearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Get Booking By ID', 'GET', '/api/bookings/{{bookingId}}', {
        auth: bearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Cancel Booking', 'DELETE', '/api/bookings/{{bookingId}}/cancel', {
        auth: bearer(),
      }),
      basicTest,
    ),
  ],
  'User booking lifecycle',
);

// ─── Payments (User) ─────────────────────────────────────────────────────────
const paymentsFolder = folder(
  '💳 Payments (User)',
  [
    withEvent(
      req('Submit Payment Proof', 'POST', '/api/payments/submit-proof', {
        auth: bearer(),
        body: formDataBody([
          { key: 'bookingId', value: '{{bookingId}}', type: 'text' },
          { key: 'amount', value: '5000', type: 'text' },
          { key: 'paymentMode', value: 'upi', type: 'text' },
          { key: 'transactionId', value: 'TXN123456', type: 'text' },
          { key: 'notes', value: 'Paid via PhonePe', type: 'text' },
          {
            key: 'receiptImage',
            src: '',
            type: 'file',
            description: 'Upload receipt image (jpg/png/webp, max 5MB)',
          },
        ]),
        headers: [],
      }),
      saveIdScript('paymentId'),
    ),
    withEvent(
      req('My Payments', 'GET', '/api/payments/my', { auth: bearer() }),
      basicTest,
    ),
    withEvent(
      req('Get Payment By ID', 'GET', '/api/payments/{{paymentId}}', {
        auth: bearer(),
      }),
      basicTest,
    ),
  ],
  'User payment submission and status',
);

// ─── Reviews (User) ──────────────────────────────────────────────────────────
const reviewsFolder = folder(
  '⭐ Reviews (User)',
  [
    withEvent(
      req('Create Review', 'POST', '/api/reviews', {
        auth: bearer(),
        body: jsonBody({
          bookingId: '{{bookingId}}',
          rating: 5,
          comment: 'Amazing tour experience! Highly recommend.',
        }),
      }),
      saveIdScript('reviewId'),
    ),
    withEvent(
      req('Get Tour Reviews', 'GET', '/api/tours/{{tourId}}/reviews', {
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '10' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('My Reviews', 'GET', '/api/users/my-reviews', { auth: bearer() }),
      basicTest,
    ),
  ],
  'User review management',
);

// ─── Users (User Profile) ────────────────────────────────────────────────────
const usersFolder = folder(
  '👤 Users (Profile)',
  [
    withEvent(
      req('Get Profile', 'GET', '/api/users/profile', { auth: bearer() }),
      basicTest,
    ),
    withEvent(
      req('Update Profile', 'PATCH', '/api/users/profile', {
        auth: bearer(),
        body: jsonBody({
          name: 'Updated Name',
          phone: '+919876543210',
          gender: 'male',
          dateOfBirth: '1995-06-15',
          country: 'India',
          contactAddress: '123 Main Street, Mumbai, MH 400001',
        }),
      }),
      basicTest,
    ),
    withEvent(
      req('Change Password', 'PATCH', '/api/users/change-password', {
        auth: bearer(),
        body: jsonBody({
          currentPassword: 'Password@123',
          newPassword: 'NewPassword@123',
        }),
      }),
      basicTest,
    ),
    withEvent(
      req('Get Saved Travelers', 'GET', '/api/users/travelers', {
        auth: bearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Add Saved Traveler', 'POST', '/api/users/travelers', {
        auth: bearer(),
        body: jsonBody({
          fullName: 'Family Member',
          age: 35,
          gender: 'female',
          phone: '+919876543211',
          idNumber: 'WXYZ9012',
        }),
      }),
      saveIdScript('savedTravelerId'),
    ),
    withEvent(
      req(
        'Remove Saved Traveler',
        'DELETE',
        '/api/users/travelers/{{savedTravelerId}}',
        { auth: bearer() },
      ),
      basicTest,
    ),
    withEvent(
      req('My Bookings (via Users)', 'GET', '/api/users/my-bookings', {
        auth: bearer(),
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '10' },
        ],
      }),
      basicTest,
    ),
  ],
  'User profile and saved traveler management',
);

// ─── Wishlist ─────────────────────────────────────────────────────────────────
const wishlistFolder = folder(
  '❤️ Wishlist',
  [
    withEvent(
      req('Get Wishlist', 'GET', '/api/wishlist', { auth: bearer() }),
      basicTest,
    ),
    withEvent(
      req('Add to Wishlist', 'POST', '/api/wishlist/{{tourId}}', {
        auth: bearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Remove from Wishlist', 'DELETE', '/api/wishlist/{{tourId}}', {
        auth: bearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Toggle Wishlist', 'POST', '/api/wishlist/{{tourId}}/toggle', {
        auth: bearer(),
      }),
      basicTest,
    ),
  ],
  'User wishlist management',
);

// ─── Notifications (User) ────────────────────────────────────────────────────
const notificationsUserFolder = folder(
  '🔔 Notifications (User)',
  [
    withEvent(
      req('Get My Notifications', 'GET', '/api/notifications', {
        auth: bearer(),
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
          { key: 'isRead', value: '', description: 'Filter: true/false' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req(
        'Mark All Notifications Read',
        'PATCH',
        '/api/notifications/read-all',
        { auth: bearer() },
      ),
      basicTest,
    ),
    withEvent(
      req(
        'Mark Notification Read',
        'PATCH',
        '/api/notifications/{{notificationId}}/read',
        { auth: bearer() },
      ),
      basicTest,
    ),
  ],
  'User notification management',
);

// ─── Blogs (Public) ──────────────────────────────────────────────────────────
const blogsPublicFolder = folder(
  '📰 Blogs (Public)',
  [
    withEvent(
      req('Get All Published Blogs', 'GET', '/api/blogs', {
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '10' },
          { key: 'category', value: '', description: 'Filter by category' },
          { key: 'search', value: '', description: 'Search blogs' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Get Blog By Slug', 'GET', '/api/blogs/{{blogSlug}}'),
      basicTest,
    ),
  ],
  'Public blog access',
);

// ─── Coupons (User) ──────────────────────────────────────────────────────────
const couponsUserFolder = folder(
  '🎟️ Coupons (User)',
  [
    withEvent(
      req('Validate Coupon', 'POST', '/api/coupons/validate', {
        auth: bearer(),
        body: jsonBody({
          code: 'SUMMER20',
          tourId: '{{tourId}}',
          orderAmount: 10000,
        }),
      }),
      basicTest,
    ),
  ],
  'User coupon validation',
);

// ─── Tour Dates (Public) ─────────────────────────────────────────────────────
const tourDatesPublicFolder = folder(
  '📅 Tour Dates (Public)',
  [
    withEvent(
      req('Get Upcoming Tour Dates', 'GET', '/api/tour-dates/{{tourId}}'),
      basicTest,
    ),
  ],
  'Public tour date browsing',
);

// ════════════════════════════════════════════════════════════════════════════════
//  ADMIN SECTION
// ════════════════════════════════════════════════════════════════════════════════

// ─── Admin Auth ───────────────────────────────────────────────────────────────
const adminAuthFolder = folder(
  '🔐 Admin Auth',
  [
    withEvent(
      req('Admin Login', 'POST', '/api/admin/auth/login', {
        body: jsonBody({
          identifier: 'admin@tourapp.com',
          password: 'Admin@123456',
        }),
      }),
      saveAdminTokensScript,
    ),
    withEvent(
      req('Admin Get Me', 'GET', '/api/admin/auth/me', { auth: adminBearer() }),
      basicTest,
    ),
  ],
  'Admin authentication',
);

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
const adminDashboardFolder = folder(
  '📊 Admin Dashboard',
  [
    withEvent(
      req('Dashboard Summary', 'GET', '/api/admin/dashboard/summary', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req(
        'Revenue Chart (Daily)',
        'GET',
        '/api/admin/dashboard/revenue-chart',
        {
          auth: adminBearer(),
          params: [
            {
              key: 'period',
              value: 'daily',
              description: 'daily | monthly | yearly',
            },
          ],
        },
      ),
      basicTest,
    ),
    withEvent(
      req(
        'Revenue Chart (Monthly)',
        'GET',
        '/api/admin/dashboard/revenue-chart',
        {
          auth: adminBearer(),
          params: [{ key: 'period', value: 'monthly' }],
        },
      ),
      basicTest,
    ),
    withEvent(
      req('Top Tours', 'GET', '/api/admin/dashboard/top-tours', {
        auth: adminBearer(),
        params: [{ key: 'limit', value: '5' }],
      }),
      basicTest,
    ),
  ],
  'Admin analytics dashboard',
);

// ─── Admin Tours ──────────────────────────────────────────────────────────────
const adminToursFolder = folder(
  '🗺️ Admin Tours',
  [
    withEvent(
      req('Get All Tours (Admin)', 'GET', '/api/admin/tours', {
        auth: adminBearer(),
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '10' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Create Tour', 'POST', '/api/admin/tours', {
        auth: adminBearer(),
        body: jsonBody({
          title: 'Rajasthan Royal Adventure – 7 Days',
          description:
            'Explore the vibrant culture and majestic forts of Rajasthan on this 7-day tour.',
          basePrice: 25000,
          minAge: 5,
          maxAge: 75,
          category: 'Cultural',
          location: 'Jaipur, Jodhpur, Udaipur',
          state: 'Rajasthan',
          country: 'India',
          highlights: ['Pink City Jaipur', 'Mehrangarh Fort', 'Lake Pichola'],
          departureOptions: [
            {
              fromCity: 'Delhi',
              toCity: 'Jaipur',
              type: 'AC',
              departureTimeAndPlace: '6:00 AM – Delhi ISBT',
              totalDays: 7,
              totalNights: 6,
              priceAdjustment: 0,
            },
            {
              fromCity: 'Mumbai',
              toCity: 'Jaipur',
              type: 'FLIGHT',
              departureTimeAndPlace: '8:00 AM – Mumbai Airport',
              totalDays: 7,
              totalNights: 6,
              priceAdjustment: 3000,
            },
          ],
          itinerary: [
            {
              dayNumber: 1,
              title: 'Arrival in Jaipur',
              points: [
                {
                  text: 'Check-in at hotel',
                  subPoints: ['Welcome dinner', 'Orientation briefing'],
                },
              ],
            },
            {
              dayNumber: 2,
              title: 'City Palace & Amber Fort',
              points: [
                {
                  text: 'Visit Amber Fort',
                  subPoints: ['Elephant ride', 'Light show'],
                },
                { text: 'City Palace tour' },
              ],
            },
          ],
          inclusions: [
            'Accommodation (6 nights)',
            'Daily breakfast',
            'AC transport',
            'Tour guide',
            'Entry fees',
          ],
          exclusions: [
            'Flights to/from Jaipur',
            'Personal expenses',
            'Lunch & dinner',
            'Travel insurance',
          ],
          faqs: [
            {
              question: 'Is this tour child-friendly?',
              answer:
                'Yes, the tour is suitable for children aged 5 and above.',
            },
            {
              question: 'What is the cancellation policy?',
              answer: 'Free cancellation up to 15 days before departure.',
            },
          ],
          isActive: true,
          isFeatured: false,
        }),
      }),
      saveIdScript('tourId'),
    ),
    withEvent(
      req('Get Tour By ID (Admin)', 'GET', '/api/admin/tours/{{tourId}}', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Update Tour', 'PATCH', '/api/admin/tours/{{tourId}}', {
        auth: adminBearer(),
        body: jsonBody({
          title: 'Rajasthan Royal Adventure – 7 Days (Updated)',
          basePrice: 27000,
          isFeatured: true,
        }),
      }),
      basicTest,
    ),
    withEvent(
      req('Toggle Tour Status', 'PATCH', '/api/admin/tours/{{tourId}}/status', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req(
        'Toggle Tour Featured',
        'PATCH',
        '/api/admin/tours/{{tourId}}/featured',
        { auth: adminBearer() },
      ),
      basicTest,
    ),
    withEvent(
      req('Upload Tour Images', 'POST', '/api/admin/tours/{{tourId}}/images', {
        auth: adminBearer(),
        body: formDataBody([
          {
            key: 'images',
            src: '',
            type: 'file',
            description: 'Select up to 10 images (jpg/jpeg/png/gif)',
          },
        ]),
        headers: [],
      }),
      basicTest,
    ),
    withEvent(
      req('Delete Tour Image', 'DELETE', '/api/admin/tours/{{tourId}}/images', {
        auth: adminBearer(),
        body: jsonBody({ imageUrl: '/uploads/tours/sample.jpg' }),
      }),
      basicTest,
    ),
    withEvent(
      req('Delete Tour (Soft)', 'DELETE', '/api/admin/tours/{{tourId}}', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
  ],
  'Admin tour CRUD and media management',
);

// ─── Admin Tour Dates ─────────────────────────────────────────────────────────
const adminTourDatesFolder = folder(
  '📅 Admin Tour Dates',
  [
    withEvent(
      req('Get Tour Dates (Admin)', 'GET', '/api/admin/tour-dates/{{tourId}}', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Create Tour Date', 'POST', '/api/admin/tour-dates', {
        auth: adminBearer(),
        body: jsonBody({
          tour: '{{tourId}}',
          startDate: '2025-04-10',
          endDate: '2025-04-17',
          totalSeats: 30,
          priceOverride: 26000,
          departureNote: 'Early bird discount applied',
        }),
      }),
      saveIdScript('tourDateId'),
    ),
    withEvent(
      req('Update Tour Date', 'PATCH', '/api/admin/tour-dates/{{tourDateId}}', {
        auth: adminBearer(),
        body: jsonBody({
          totalSeats: 25,
          priceOverride: 24500,
          status: 'upcoming',
        }),
      }),
      basicTest,
    ),
    withEvent(
      req(
        'Update Tour Date Status',
        'PATCH',
        '/api/admin/tour-dates/{{tourDateId}}/status',
        {
          auth: adminBearer(),
          body: jsonBody({ status: 'upcoming' }),
        },
      ),
      basicTest,
    ),
    withEvent(
      req(
        'Delete Tour Date',
        'DELETE',
        '/api/admin/tour-dates/{{tourDateId}}',
        { auth: adminBearer() },
      ),
      basicTest,
    ),
    withEvent(
      req(
        'Auto Update Statuses',
        'POST',
        '/api/admin/tour-dates/auto-update-status',
        { auth: adminBearer() },
      ),
      basicTest,
    ),
  ],
  'Admin tour date management',
);

// ─── Admin Bookings ───────────────────────────────────────────────────────────
const adminBookingsFolder = folder(
  '📋 Admin Bookings',
  [
    withEvent(
      req('Get All Bookings', 'GET', '/api/admin/bookings', {
        auth: adminBearer(),
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
          {
            key: 'status',
            value: '',
            description: 'pending | confirmed | cancelled | completed',
          },
          { key: 'tourId', value: '' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req(
        'Get Booking By ID (Admin)',
        'GET',
        '/api/admin/bookings/{{bookingId}}',
        { auth: adminBearer() },
      ),
      basicTest,
    ),
    withEvent(
      req(
        'Update Booking Status',
        'PATCH',
        '/api/admin/bookings/{{bookingId}}/status',
        {
          auth: adminBearer(),
          body: jsonBody({
            status: 'confirmed',
            internalNotes: 'Verified via bank transfer',
          }),
        },
      ),
      basicTest,
    ),
    withEvent(
      req(
        'Confirm Booking',
        'PATCH',
        '/api/admin/bookings/{{bookingId}}/confirm',
        { auth: adminBearer() },
      ),
      basicTest,
    ),
    withEvent(
      req(
        'Add Payment to Booking',
        'PATCH',
        '/api/admin/bookings/{{bookingId}}/add-payment',
        {
          auth: adminBearer(),
          body: jsonBody({ amount: 5000 }),
        },
      ),
      basicTest,
    ),
  ],
  'Admin booking management',
);

// ─── Admin Payments ───────────────────────────────────────────────────────────
const adminPaymentsFolder = folder(
  '💳 Admin Payments',
  [
    withEvent(
      req('Get Pending Payments', 'GET', '/api/admin/payments/pending-review', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req(
        'Approve Payment',
        'PATCH',
        '/api/admin/payments/{{paymentId}}/approve',
        { auth: adminBearer() },
      ),
      basicTest,
    ),
    withEvent(
      req(
        'Reject Payment',
        'PATCH',
        '/api/admin/payments/{{paymentId}}/reject',
        {
          auth: adminBearer(),
          body: jsonBody({ reason: 'Receipt image unclear. Please resubmit.' }),
        },
      ),
      basicTest,
    ),
    withEvent(
      req('Record Offline Payment', 'POST', '/api/admin/payments/offline', {
        auth: adminBearer(),
        body: jsonBody({
          bookingId: '{{bookingId}}',
          amount: 10000,
          paymentMode: 'cash',
          transactionId: 'CASH-001',
          notes: 'Cash collected at office',
        }),
      }),
      basicTest,
    ),
  ],
  'Admin payment review and offline recording',
);

// ─── Admin Reviews ────────────────────────────────────────────────────────────
const adminReviewsFolder = folder(
  '⭐ Admin Reviews',
  [
    withEvent(
      req('Get All Reviews (Admin)', 'GET', '/api/admin/reviews', {
        auth: adminBearer(),
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
          {
            key: 'status',
            value: '',
            description: 'pending | approved | rejected',
          },
          { key: 'tourId', value: '' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req(
        'Approve Review',
        'PATCH',
        '/api/admin/reviews/{{reviewId}}/approve',
        { auth: adminBearer() },
      ),
      basicTest,
    ),
    withEvent(
      req('Reject Review', 'PATCH', '/api/admin/reviews/{{reviewId}}/reject', {
        auth: adminBearer(),
        body: jsonBody({ reason: 'Contains inappropriate language.' }),
      }),
      basicTest,
    ),
    withEvent(
      req('Delete Review', 'DELETE', '/api/admin/reviews/{{reviewId}}', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
  ],
  'Admin review moderation',
);

// ─── Admin Blogs ──────────────────────────────────────────────────────────────
const adminBlogsFolder = folder(
  '📰 Admin Blogs',
  [
    withEvent(
      req('Create Blog', 'POST', '/api/admin/blogs', {
        auth: adminBearer(),
        body: jsonBody({
          title: 'Top 10 Destinations in India for 2025',
          content:
            '<p>India offers breathtaking destinations ranging from the Himalayas to the backwaters of Kerala...</p>',
          excerpt:
            'Discover the most stunning travel destinations across India in 2025.',
          category: 'Travel Tips',
          tags: ['india', 'travel', '2025', 'destinations'],
          featuredImage: 'https://example.com/images/top-destinations.jpg',
        }),
      }),
      saveIdScript('blogId'),
    ),
    withEvent(
      req('Get All Blogs (Admin)', 'GET', '/api/admin/blogs', {
        auth: adminBearer(),
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '10' },
          { key: 'category', value: '' },
          { key: 'status', value: '' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Get Blog By ID (Admin)', 'GET', '/api/admin/blogs/{{blogId}}', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Update Blog', 'PATCH', '/api/admin/blogs/{{blogId}}', {
        auth: adminBearer(),
        body: jsonBody({
          title: 'Top 10 Destinations in India for 2025 (Updated)',
          tags: ['india', 'travel', 'updated'],
        }),
      }),
      basicTest,
    ),
    withEvent(
      req('Publish Blog', 'PATCH', '/api/admin/blogs/{{blogId}}/publish', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Unpublish Blog', 'PATCH', '/api/admin/blogs/{{blogId}}/unpublish', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Delete Blog', 'DELETE', '/api/admin/blogs/{{blogId}}', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
  ],
  'Admin blog CMS',
);

// ─── Admin Coupons ────────────────────────────────────────────────────────────
const adminCouponsFolder = folder(
  '🎟️ Admin Coupons',
  [
    withEvent(
      req('Create Coupon', 'POST', '/api/admin/coupons', {
        auth: adminBearer(),
        body: jsonBody({
          code: 'SUMMER25',
          description: '25% off for summer bookings',
          discountType: 'percent',
          discountValue: 25,
          maxDiscountAmount: 5000,
          expiryDate: '2025-08-31',
          maxUsage: 100,
          maxUsagePerUser: 1,
          minOrderAmount: 5000,
          applicableTours: [],
          isActive: true,
        }),
      }),
      saveIdScript('couponId'),
    ),
    withEvent(
      req('Get All Coupons', 'GET', '/api/admin/coupons', {
        auth: adminBearer(),
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
          { key: 'isActive', value: '' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Get Coupon By ID', 'GET', '/api/admin/coupons/{{couponId}}', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Update Coupon', 'PATCH', '/api/admin/coupons/{{couponId}}', {
        auth: adminBearer(),
        body: jsonBody({ discountValue: 30, maxUsage: 50 }),
      }),
      basicTest,
    ),
    withEvent(
      req('Get Coupon Usage', 'GET', '/api/admin/coupons/{{couponId}}/usage', {
        auth: adminBearer(),
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Delete Coupon', 'DELETE', '/api/admin/coupons/{{couponId}}', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
  ],
  'Admin coupon management',
);

// ─── Admin Users (CRM) ────────────────────────────────────────────────────────
const adminUsersFolder = folder(
  '👥 Admin Users (CRM)',
  [
    withEvent(
      req('Get All Users', 'GET', '/api/admin/users', {
        auth: adminBearer(),
        params: [
          { key: 'page', value: '1' },
          { key: 'limit', value: '20' },
          { key: 'search', value: '', description: 'Search by name or email' },
          { key: 'isVerified', value: '', description: 'true | false' },
          { key: 'isBlocked', value: '', description: 'true | false' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Get User By ID', 'GET', '/api/admin/users/{{userId}}', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Block User', 'PATCH', '/api/admin/users/{{userId}}/block', {
        auth: adminBearer(),
        body: jsonBody({ reason: 'Fraudulent activity detected' }),
      }),
      basicTest,
    ),
    withEvent(
      req('Unblock User', 'PATCH', '/api/admin/users/{{userId}}/unblock', {
        auth: adminBearer(),
      }),
      basicTest,
    ),
    withEvent(
      req('Add User Note', 'POST', '/api/admin/users/{{userId}}/notes', {
        auth: adminBearer(),
        body: jsonBody({
          note: 'Customer called regarding refund on booking #12345',
        }),
      }),
      basicTest,
    ),
  ],
  'Admin CRM – user management and notes',
);

// ─── Admin Notifications ──────────────────────────────────────────────────────
const adminNotificationsFolder = folder(
  '📢 Admin Notifications',
  [
    withEvent(
      req('Send Bulk Email', 'POST', '/api/admin/notifications/email', {
        auth: adminBearer(),
        body: jsonBody({
          emails: ['user1@example.com', 'user2@example.com'],
          subject: 'Exciting New Tours for Summer 2025!',
          message:
            'Check out our latest summer tour packages with up to 25% discount.',
          templateName: 'general',
          templateData: { promoCode: 'SUMMER25', expiryDate: '2025-08-31' },
        }),
      }),
      basicTest,
    ),
    withEvent(
      req('Send Bulk WhatsApp', 'POST', '/api/admin/notifications/whatsapp', {
        auth: adminBearer(),
        body: jsonBody({
          phones: ['+919876543210', '+919876543211'],
          message: 'Your booking is confirmed! Check your email for details.',
          templateName: 'booking_confirmation',
          templateData: {
            bookingId: '{{bookingId}}',
            tourName: 'Rajasthan Royal Adventure',
          },
        }),
      }),
      basicTest,
    ),
  ],
  'Admin bulk notifications – email and WhatsApp',
);

// ─── Admin Reports ────────────────────────────────────────────────────────────
const adminReportsFolder = folder(
  '📈 Admin Reports',
  [
    withEvent(
      req('Revenue Report CSV', 'GET', '/api/admin/reports/revenue/csv', {
        auth: adminBearer(),
        params: [
          {
            key: 'startDate',
            value: '2025-01-01',
            description: 'ISO date string',
          },
          {
            key: 'endDate',
            value: '2025-12-31',
            description: 'ISO date string',
          },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Revenue Report PDF', 'GET', '/api/admin/reports/revenue/pdf', {
        auth: adminBearer(),
        params: [
          { key: 'startDate', value: '2025-01-01' },
          { key: 'endDate', value: '2025-12-31' },
        ],
      }),
      basicTest,
    ),
    withEvent(
      req('Bookings Report CSV', 'GET', '/api/admin/reports/bookings/csv', {
        auth: adminBearer(),
        params: [
          { key: 'startDate', value: '2025-01-01' },
          { key: 'endDate', value: '2025-12-31' },
        ],
      }),
      basicTest,
    ),
  ],
  'Admin report exports',
);

// ════════════════════════════════════════════════════════════════════════════════
//  COLLECTION ASSEMBLY
// ════════════════════════════════════════════════════════════════════════════════

const collection = {
  info: {
    _postman_id: uid(),
    name: '🌍 Tours & Travels API – Production Collection',
    description: [
      '## Tours & Travels App – Full API Collection\n\n',
      '### 🚀 Quick Start\n',
      '1. **Import** this collection + the **environment file** into Postman.\n',
      '2. Set the environment **active**.\n',
      '3. Run **Admin Login** → tokens saved automatically.\n',
      '4. Run **Register User** (uses random email) → tokens saved automatically.\n',
      '5. Run **Create Tour** → tourId saved. Then **Create Tour Date** → tourDateId saved.\n',
      '6. Now run booking, payment, review flows.\n\n',
      '### 🔐 Auth Flow\n',
      '- User tokens stored in `accessToken`, `refreshToken`\n',
      '- Admin tokens stored in `adminAccessToken`, `adminRefreshToken`\n',
      '- All test scripts auto-save IDs (tourId, bookingId, paymentId, etc.)\n\n',
      '### 📁 Folder Structure\n',
      '**USER:** Auth → Home → Tours → Bookings → Payments → Reviews → Users → Wishlist → Notifications → Blogs → Coupons\n',
      '**ADMIN:** Auth → Dashboard → Tours → Tour Dates → Bookings → Payments → Reviews → Blogs → Coupons → Users → Notifications → Reports',
    ].join(''),
    schema:
      'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },

  // Collection-level variables
  variable: [
    {
      key: 'baseUrl',
      value: 'http://localhost:3000',
      type: 'string',
      description: 'API base URL',
    },
    {
      key: 'accessToken',
      value: '',
      type: 'string',
      description: 'User JWT access token (auto-set on login)',
    },
    {
      key: 'refreshToken',
      value: '',
      type: 'string',
      description: 'User JWT refresh token (auto-set on login)',
    },
    {
      key: 'adminAccessToken',
      value: '',
      type: 'string',
      description: 'Admin JWT access token (auto-set on admin login)',
    },
    {
      key: 'adminRefreshToken',
      value: '',
      type: 'string',
      description: 'Admin JWT refresh token (auto-set on admin login)',
    },
    {
      key: 'userId',
      value: '',
      type: 'string',
      description: 'Current user ID (auto-set on login)',
    },
    {
      key: 'adminUserId',
      value: '',
      type: 'string',
      description: 'Admin user ID (auto-set on admin login)',
    },
    {
      key: 'randomEmail',
      value: '',
      type: 'string',
      description: 'Random email (auto-generated on register)',
    },
    {
      key: 'tourId',
      value: '',
      type: 'string',
      description: 'Tour MongoDB ID (auto-set on create tour)',
    },
    {
      key: 'tourSlug',
      value: 'rajasthan-royal-adventure-7-days',
      type: 'string',
      description: 'Tour slug for public API',
    },
    {
      key: 'tourDateId',
      value: '',
      type: 'string',
      description: 'Tour date MongoDB ID (auto-set on create tour date)',
    },
    {
      key: 'bookingId',
      value: '',
      type: 'string',
      description: 'Booking MongoDB ID (auto-set on create booking)',
    },
    {
      key: 'paymentId',
      value: '',
      type: 'string',
      description: 'Payment MongoDB ID (auto-set on submit proof)',
    },
    {
      key: 'reviewId',
      value: '',
      type: 'string',
      description: 'Review MongoDB ID (auto-set on create review)',
    },
    {
      key: 'blogId',
      value: '',
      type: 'string',
      description: 'Blog MongoDB ID (auto-set on create blog)',
    },
    {
      key: 'blogSlug',
      value: 'top-10-destinations-in-india-for-2025',
      type: 'string',
      description: 'Blog slug',
    },
    {
      key: 'couponId',
      value: '',
      type: 'string',
      description: 'Coupon MongoDB ID (auto-set on create coupon)',
    },
    {
      key: 'savedTravelerId',
      value: '',
      type: 'string',
      description: 'Saved traveler ID',
    },
    {
      key: 'notificationId',
      value: '',
      type: 'string',
      description: 'Notification MongoDB ID',
    },
    {
      key: 'resetToken',
      value: '',
      type: 'string',
      description: 'Password reset token (from email)',
    },
  ],

  // Auth at collection level (uses {{accessToken}})
  auth: bearer(),

  item: [
    folder(
      '👤 User APIs',
      [
        authFolder,
        homeFolder,
        toursFolder,
        tourDatesPublicFolder,
        bookingsFolder,
        paymentsFolder,
        reviewsFolder,
        usersFolder,
        wishlistFolder,
        notificationsUserFolder,
        blogsPublicFolder,
        couponsUserFolder,
      ],
      'All user-facing APIs',
    ),

    folder(
      '🔧 Admin APIs',
      [
        adminAuthFolder,
        adminDashboardFolder,
        adminToursFolder,
        adminTourDatesFolder,
        adminBookingsFolder,
        adminPaymentsFolder,
        adminReviewsFolder,
        adminBlogsFolder,
        adminCouponsFolder,
        adminUsersFolder,
        adminNotificationsFolder,
        adminReportsFolder,
      ],
      'All admin APIs (requires admin JWT)',
    ),
  ],
};

// ─── Write output ─────────────────────────────────────────────────────────────
const outPath = './postman_collection.json';
fs.writeFileSync(outPath, JSON.stringify(collection, null, 2), 'utf8');
console.log(`✅  Postman collection written to ${outPath}`);
console.log(`📦  Total top-level folders: ${collection.item.length}`);
