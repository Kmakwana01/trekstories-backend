const fs = require('fs');
const path = './postman_collection.json';

if (!fs.existsSync(path)) {
  console.error('File not found:', path);
  process.exit(1);
}

const collection = JSON.parse(fs.readFileSync(path, 'utf8'));

// Recursive function to find and modify items
function processItem(item) {
  if (item.item) {
    // It's a folder, filter out deleted APIs
    item.item = item.item.filter((subItem) => {
      // Remove POST /admin/tours/:id/images
      if (subItem.request && subItem.request.method === 'POST') {
        const url =
          subItem.request.url.raw ||
          (subItem.request.url.path ? subItem.request.url.path.join('/') : '');
        if (url.includes('/admin/tours') && url.includes('/images')) {
          console.log('Removed deprecated API:', url);
          return false;
        }
      }
      return true;
    });

    item.item.forEach(processItem);
  } else if (item.request) {
    const method = item.request.method;
    const urlRaw = item.request.url.raw || '';
    const pathArray = item.request.url.path || [];
    const urlStr = pathArray.join('/');

    // 1. UPDATE POST /admin/blogs
    if (method === 'POST' && urlStr.endsWith('admin/blogs')) {
      console.log('Updated POST /admin/blogs');
      item.request.body = {
        mode: 'formdata',
        formdata: [
          { key: 'title', value: 'New Blog Post', type: 'text' },
          { key: 'content', value: '<p>Some content</p>', type: 'text' },
          { key: 'excerpt', value: 'Short excerpt', type: 'text' },
          { key: 'category', value: 'Travel Trips', type: 'text' },
          { key: 'tags', value: '["summer", "europe"]', type: 'text' },
          { key: 'featuredImage', type: 'file', src: [] },
        ],
      };
      item.request.header = item.request.header.filter(
        (h) => h.key !== 'Content-Type',
      );
    }

    // 2. UPDATE PATCH /admin/blogs/:id
    if (
      method === 'PATCH' &&
      urlStr.includes('admin/blogs/') &&
      !urlStr.includes('/publish') &&
      !urlStr.includes('/unpublish')
    ) {
      console.log('Updated PATCH /admin/blogs/:id');
      item.request.body = {
        mode: 'formdata',
        formdata: [
          { key: 'title', value: 'Updated Blog Post', type: 'text' },
          { key: 'content', value: '<p>Updated content</p>', type: 'text' },
          { key: 'featuredImage', type: 'file', src: [] },
        ],
      };
      item.request.header = item.request.header.filter(
        (h) => h.key !== 'Content-Type',
      );
    }

    // 3. UPDATE POST /admin/tours
    if (method === 'POST' && urlStr.endsWith('admin/tours')) {
      console.log('Updated POST /admin/tours');
      item.request.body = {
        mode: 'formdata',
        formdata: [
          { key: 'title', value: 'New Amazing Tour', type: 'text' },
          {
            key: 'description',
            value: 'This is a description of the amazing tour.',
            type: 'text',
          },
          { key: 'basePrice', value: '1000', type: 'text' },
          { key: 'images', type: 'file', src: [] },
          { key: 'thumbnailImage', type: 'file', src: [] },
          { key: 'category', value: 'Adventure', type: 'text' },
          { key: 'location', value: 'Mountains', type: 'text' },
          { key: 'state', value: 'Colorado', type: 'text' },
          { key: 'country', value: 'USA', type: 'text' },
          { key: 'highlights', value: '["Hiking", "Camping"]', type: 'text' },
          {
            key: 'itinerary',
            value:
              '[{"dayNumber": 1, "title": "Arrival", "points": [{"text": "Arrive at basecamp"}]}]',
            type: 'text',
          },
          { key: 'inclusions', value: '["Meals", "Guide"]', type: 'text' },
          { key: 'exclusions', value: '["Flights"]', type: 'text' },
        ],
      };
      item.request.header = item.request.header.filter(
        (h) => h.key !== 'Content-Type',
      );
    }

    // 4. UPDATE PATCH /admin/tours/:id
    if (
      method === 'PATCH' &&
      urlStr.includes('admin/tours/') &&
      !urlStr.includes('/status') &&
      !urlStr.includes('/featured')
    ) {
      console.log('Updated PATCH /admin/tours/:id');
      item.request.body = {
        mode: 'formdata',
        formdata: [
          { key: 'title', value: 'Updated Amazing Tour', type: 'text' },
          { key: 'basePrice', value: '1200', type: 'text' },
          { key: 'images', type: 'file', src: [] },
          { key: 'thumbnailImage', type: 'file', src: [] },
        ],
      };
      item.request.header = item.request.header.filter(
        (h) => h.key !== 'Content-Type',
      );
    }
  }
}

collection.item.forEach(processItem);

fs.writeFileSync(path, JSON.stringify(collection, null, 2), 'utf8');
console.log('Collection updated successfully.');
