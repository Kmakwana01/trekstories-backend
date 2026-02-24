const { MongoClient, ObjectId } = require('mongodb');

async function seed() {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('travel');
    const blogsCollection = db.collection('blogs');

    await blogsCollection.deleteMany({});

    // Fallback author if needed, though they will all use this static ID for the seed
    const authorId = new ObjectId('699c22234f4e0d79162ed447');
    const now = new Date();

    const blogsToInsert = [
      {
        title: '10 Undiscovered Beaches in Southeast Asia',
        slug: 'undiscovered-beaches-southeast-asia',
        excerpt:
          'Escape the crowds and discover the pristine waters of these secret Southeast Asian coastlines.',
        content: `<h2>The Hidden Gems of the Tropics</h2><p>While places like Phuket and Bali attract millions, Southeast Asia still harbors untouched stretches of white sand. We explored the coastlines of Vietnam, the Philippines, and remote Indonesian islands to find beaches where you might be the only person around.</p><h3>1. Koh Kood, Thailand</h3><p>Forget Phi Phi. Koh Kood near the Cambodian border offers emerald waters, slow-paced island life, and zero full-moon parties.</p><h3>2. Pink Beach, Komodo Island</h3><p>One of only seven pink beaches in the world, the sand gets its striking color from microscopic organisms called Foraminifera.</p><p>...and 8 more breathtaking destinations wait for your footsteps.</p>`,
        category: 'Destinations',
        tags: ['Beaches', 'Southeast Asia', 'Hidden Gems', 'Summer'],
        featuredImage:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop',
        author: authorId,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 10 * 86400000), // 10 days ago
        viewCount: 1240,
        createdAt: new Date(now.getTime() - 10 * 86400000),
        updatedAt: new Date(now.getTime() - 10 * 86400000),
        __v: 0,
      },
      {
        title: 'A Culinary Journey Through the Streets of Tokyo',
        slug: 'tokyo-street-food-guide',
        excerpt:
          'From sizzling yakitori to fluffy melon pan, Tokyo’s street food scene is a flavorful adventure you cannot miss.',
        content: `<h2>Eating Your Way Through Tokyo</h2><p>Tokyo is synonymous with Michelin stars, but its soul lies in the narrow alleyways (yokocho) where smoke and savory aromas fill the air.</p><h3>The Magic of Omoide Yokocho</h3><p>Known as 'Memory Lane', this tight, lantern-lit alley in Shinjuku is lined with tiny stalls serving the best yakitori (grilled chicken skewers) you will ever taste. Pair it with a cold draft beer.</p><h3>Sweet Treats in Asakusa</h3><p>Stroll down Nakamise Shopping Street for a sweet interlude. Try the Ningyoyaki (baked doll cakes filled with red bean paste) and the famous Matcha ice cream.</p>`,
        category: 'Food',
        tags: ['Tokyo', 'Street Food', 'Japan', 'Culinary'],
        featuredImage:
          'https://images.unsplash.com/photo-1522851458925-fb3cb2b7f0e9?w=1600&auto=format&fit=crop',
        author: authorId,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 8 * 86400000),
        viewCount: 3890,
        createdAt: new Date(now.getTime() - 8 * 86400000),
        updatedAt: new Date(now.getTime() - 8 * 86400000),
        __v: 0,
      },
      {
        title: 'How to Pack Light for a 2-Week European Adventure',
        slug: 'pack-light-europe-2-weeks',
        excerpt:
          'Master the art of minimal packing without sacrificing style or comfort during your European tour.',
        content: `<h2>The Carry-On Only Rule</h2><p>Navigating cobblestone streets in Rome or squeezing onto a crowded Metro in Paris with a 50lb suitcase is a nightmare. The secret to European travel is packing light: carry-on only.</p><h3>The 5-4-3-2-1 Method</h3><p>Pack 5 tops, 4 bottoms, 3 pairs of shoes, 2 layers, and 1 dress/suit. Stick to a neutral color palette so everything mixes and matches perfectly. Layers are essential as the weather can shift from a Mediterranean warmth to a crisp Alpine breeze.</p><h3>Don't Forget...</h3><ul><li>A universal travel adapter</li><li>A high-quality portable power bank</li><li>Comfortable walking shoes (you will walk 15,000+ steps a day)</li></ul>`,
        category: 'Travel Tips',
        tags: ['Packing', 'Europe', 'Minimalism', 'Guide'],
        featuredImage:
          'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop',
        author: authorId,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 7 * 86400000),
        viewCount: 4200,
        createdAt: new Date(now.getTime() - 7 * 86400000),
        updatedAt: new Date(now.getTime() - 7 * 86400000),
        __v: 0,
      },
      {
        title: 'Hiking the Inca Trail: Everything You Need to Know',
        slug: 'hiking-inca-trail-guide',
        excerpt:
          'Permits, altitude sickness, and ancient ruins. Navigate the legendary Inca Trail to Machu Picchu like a pro.',
        content: `<h2>The Path of the Incas</h2><p>The 4-day, 26-mile journey culminating at the Sun Gate of Machu Picchu is widely regarded as one of the best treks in the world. It’s also one of the most heavily regulated.</p><h3>Booking Your Permit</h3><p>Only 500 people are allowed on the trail each day (including guides and porters). You must book your permit 6-8 months in advance. February is entirely closed for maintenance and heavy rains.</p><h3>Handling the Altitude</h3><p>You will reach 'Dead Woman’s Pass' at 4,215m (13,828 ft). Spend at least two days in Cusco beforehand acclimatizing. Drink plenty of coca tea, stay hydrated, and take it slow. It's a marathon, not a sprint.</p>`,
        category: 'Adventure',
        tags: ['Peru', 'Inca Trail', 'Hiking', 'Machu Picchu'],
        featuredImage:
          'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format&fit=crop',
        author: authorId,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 6 * 86400000),
        viewCount: 5120,
        createdAt: new Date(now.getTime() - 6 * 86400000),
        updatedAt: new Date(now.getTime() - 6 * 86400000),
        __v: 0,
      },
      {
        title: 'Top 5 Off-The-Grid Destinations for Digital Nomads',
        slug: 'off-the-grid-digital-nomads',
        excerpt:
          'Escape the bustling nomad hubs of Bali and Chiang Mai for these hidden havens offering great WiFi and rich culture.',
        content: `<h2>Working from the Edge of the World</h2><p>When you're tired of running into the same coworking crowds, it's time to venture slightly off the beaten path. These destinations offer reliable infrastructure but retain their undiscovered charm.</p><h3>1. Bansko, Bulgaria</h3><p>A ski-resort town turned nomad haven in the summer. Incredible mountain views, low cost of living, and hyper-fast internet.</p><h3>2. Cuenca, Ecuador</h3><p>A colonial masterpiece high in the Andes. The expat community is growing, but it still feels deeply authentic with lush valleys and perpetual spring weather.</p><h3>3. Taghazout, Morocco</h3><p>Surf, sand, and tagine. A small fishing village that has become a refuge for remote workers who want to ride the waves before their morning meetings.</p>`,
        category: 'Travel Tips',
        tags: ['Digital Nomad', 'Remote Work', 'Culture', 'Bulgaria'],
        featuredImage:
          'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1600&auto=format&fit=crop',
        author: authorId,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 5 * 86400000),
        viewCount: 890,
        createdAt: new Date(now.getTime() - 5 * 86400000),
        updatedAt: new Date(now.getTime() - 5 * 86400000),
        __v: 0,
      },
      {
        title: 'The Ultimate Iceland Ring Road Itinerary',
        slug: 'iceland-ring-road-itinerary',
        excerpt:
          'A comprehensive 10-day guide to circumnavigating the Land of Fire and Ice.',
        content: `<h2>Driving Route 1</h2><p>The Ring Road (Route 1) circles the entire island of Iceland, covering 828 miles. It's the ultimate road trip taking you past glaciers, active volcanoes, and cascading waterfalls.</p><h3>Days 1-3: The Golden Circle & South Coast</h3><p>Start from Reykjavik. Don't miss Seljalandsfoss (the waterfall you can walk behind) and the black sands of Reynisfjara beach.</p><h3>Days 4-6: The East Fjords and Lake Myvatn</h3><p>Navigate the dramatic twisting coastal roads in the east before heading into the geothermal wonders of the north. Skip the Blue Lagoon and soak in the Myvatn Nature Baths instead.</p><h3>Days 7-10: The Snaefellsnes Peninsula</h3><p>Often called "Iceland in Miniature," this western peninsula has a bit of everything: a glacier volcano, lava fields, and iconic mountains like Kirkjufell.</p>`,
        category: 'Road Trips',
        tags: ['Iceland', 'Road Trip', 'Nature', 'Itinerary'],
        featuredImage:
          'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1600&auto=format&fit=crop',
        author: authorId,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 4 * 86400000),
        viewCount: 7430,
        createdAt: new Date(now.getTime() - 4 * 86400000),
        updatedAt: new Date(now.getTime() - 4 * 86400000),
        __v: 0,
      },
      {
        title: 'Safety Tips for First-Time Female Solo Travelers',
        slug: 'female-solo-travel-safety',
        excerpt:
          'Empowering advice for women ready to explore the globe independently, safely, and confidently.',
        content: `<h2>Taking the Leap</h2><p>Solo travel is deeply empowering but can be intimidating the first time. The good news? The world is generally much safer than the news makes it out to be. Here are some cardinal rules.</p><h3>Trust Your Intuition</h3><p>If a situation, a person, or a quiet street feels wrong, leave immediately. Don't worry about being 'polite.' Your safety overrides politeness every single time.</p><h3>Logistical Safeguards</h3><ul><li>Always arrive in a new city during daylight hours.</li><li>Download offline maps (Google Maps or Maps.me).</li><li>Share your live location and itinerary with a trusted friend or family member back home.</li><li>Carry a dummy wallet with a small amount of cash and old, expired cards just in case.</li></ul><p>Remember, thousands of women travel solo every day. With common sense, you're going to have an incredible journey.</p>`,
        category: 'Solo Travel',
        tags: ['Solo Travel', 'Safety', 'Women', 'Tips'],
        featuredImage:
          'https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1600&auto=format&fit=crop',
        author: authorId,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 3 * 86400000),
        viewCount: 11200,
        createdAt: new Date(now.getTime() - 3 * 86400000),
        updatedAt: new Date(now.getTime() - 3 * 86400000),
        __v: 0,
      },
      {
        title: 'Wildlife Photography in the Serengeti: A Beginner’s Guide',
        slug: 'serengeti-wildlife-photography',
        excerpt:
          'Capture the majesty of the Great Migration and the Big Five with these essential wildlife photography tips.',
        content: `<h2>Patience is Your Best Lens</h2><p>The Serengeti National Park in Tanzania is a photographer's paradise. Whether it's a leopard resting in an Acacia tree or millions of wildebeest crossing a river, the opportunities are boundless.</p><h3>Equipment Checklist</h3><p>You don't need a $10,000 rig, but you do need reach. A 70-200mm lens is an absolute minimum, though a 100-400mm or a 150-600mm is ideal. Bring a bean bag; tripods are useless inside a bouncing safari jeep, but resting a heavy lens on a bean bag draped over the window frame stabilizes your shots.</p><h3>Focus on the Eyes and the Golden Hour</h3><p>Always aim your single-point autofocus exactly on the animal's eye. And maximize the Golden Hour—the first hour of light after sunrise and the last before sunset. The softer, warm light eliminates harsh midday shadows and brings out the golden hues of the savannah.</p>`,
        category: 'Adventure',
        tags: ['Photography', 'Safari', 'Tanzania', 'Wildlife'],
        featuredImage:
          'https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1600&auto=format&fit=crop',
        author: authorId,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 2 * 86400000),
        viewCount: 2900,
        createdAt: new Date(now.getTime() - 2 * 86400000),
        updatedAt: new Date(now.getTime() - 2 * 86400000),
        __v: 0,
      },
      {
        title: 'Experiencing the Northern Lights: Best Spots in Norway',
        slug: 'northern-lights-norway-guide',
        excerpt:
          'Chase the Aurora Borealis in the Arctic Circle. Here’s where and when to see the greatest light show on Earth.',
        content: `<h2>The Magic of the Aurora Borealis</h2><p>Seeing the night sky erupt in ribbons of green, purple, and pink is a life-changing experience. Norway, with its dramatic fjords matching the dramatic skies, is the perfect backdrop.</p><h3>Tromsø: The Capital of the Arctic</h3><p>Located deep within the auroral oval, Tromsø offers excellent chances of sightings. It’s also a lively university town with great cafes and museums for when the sun (rarely) shines in winter.</p><h3>The Lofoten Islands</h3><p>If you want to photograph the aurora reflecting over jagged mountain peaks and dark ocean waters, there is no place better than the remote Lofoten Islands. The weather changes fast, but the gaps in the clouds offer unparalleled views.</p><p>Timing is everything: Visit between late September and late March, and try to avoid the full moon for the darkest skies possible.</p>`,
        category: 'Destinations',
        tags: ['Norway', 'Aurora', 'Winter', 'Arctic'],
        featuredImage:
          'https://images.unsplash.com/photo-1520769945061-0a448c463865?q=80&w=1600&auto=format&fit=crop',
        author: authorId,
        isPublished: true,
        publishedAt: new Date(now.getTime() - 1 * 86400000),
        viewCount: 6500,
        createdAt: new Date(now.getTime() - 1 * 86400000),
        updatedAt: new Date(now.getTime() - 1 * 86400000),
        __v: 0,
      },
      {
        title: 'The Best Vintage Shopping Streets in Paris',
        slug: 'vintage-shopping-paris',
        excerpt:
          'Skip the Champs-Élysées. Unearth timeless fashion treasures buried in the vintage boutiques of Le Marais.',
        content: `<h2>Chic on a Budget</h2><p>Parisians have perfected the effortless look, and sustainability is taking over the fashion capital. Vintage shopping (friperies) is where the real style icons find their staple pieces.</p><h3>Le Marais District</h3><p>Head straight to Rue de la Verrerie. This street is lined with massive vintage stores, including the famous Kilo Shop, where you pay for garments by weight. Hunt carefully, and you might find an authentic 1980s Yves Saint Laurent blazer for less than the cost of a nice dinner.</p><h3>Saint-Ouen Flea Market (Les Puces)</h3><p>Located on the northern edge of the city, this is the largest antique market in the world. While heavily focused on furniture, the Marché Dauphine section hides incredible vintage couture and accessories from the 1920s to the 1970s. Go early, bring cash, and practice your haggling skills!</p>`,
        category: 'Culture',
        tags: ['Paris', 'Shopping', 'Fashion', 'Vintage'],
        featuredImage:
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1600&auto=format&fit=crop',
        author: authorId,
        isPublished: true,
        publishedAt: new Date(),
        viewCount: 1850,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      },
    ];

    await blogsCollection.insertMany(blogsToInsert);

    console.log('10 Spectacular Blogs seeded successfully!');
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

seed().catch(console.error);
