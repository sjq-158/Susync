INSERT OR REPLACE INTO users (id, email, display_name, role, phone, address_line) VALUES
('user-buyer-1', 'juan@example.com', 'Juan dela Cruz', 'buyer', '+63 917 000 1111', 'Cebu City, Cebu'),
('user-seller-1', 'maria.santos@email.com', 'Maria Santos', 'seller', '+63 917 888 1234', 'Mandaue City, Cebu'),
('user-seller-2', 'carlos@example.com', 'Carlos Reyes', 'seller', '+63 917 222 3333', 'Cebu City, Cebu'),
('user-seller-3', 'ana.lim@example.com', 'Ana Lim', 'seller', '+63 917 555 4444', 'Consolacion, Cebu');

INSERT OR REPLACE INTO properties (
  id, seller_id, title, description, property_type, listing_kind, price,
  address_line, barangay, city, image_url, beds, baths, floor_area_sqm, verified, status, created_at
) VALUES
(
  'prop-1',
  'user-seller-1',
  'Modern 4BR House in Cebu City',
  'Spacious family home near schools and the Cebu IT corridor.',
  'house',
  'sale',
  8500000,
  'Archbishop Reyes Ave',
  'Lahug',
  'Cebu City',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  4,
  3,
  220,
  1,
  'active',
  datetime('now')
),
(
  'prop-2',
  'user-seller-2',
  'Stylish 2BR Condo in Cebu IT Park',
  'Corner unit with morning light and views toward Mactan.',
  'condo',
  'rent',
  35000,
  'Cardinal Rosales Ave',
  'Cebu IT Park',
  'Mandaue City',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
  2,
  2,
  75,
  1,
  'active',
  datetime('now')
),
(
  'prop-3',
  'user-seller-3',
  'Cozy Townhouse in Consolacion',
  'A charming 3-bedroom townhouse in a quiet, family-friendly subdivision in Consolacion, just 30 minutes north of Cebu City.',
  'townhouse',
  'sale',
  5200000,
  'Pitogo St',
  'Pitogo',
  'Consolacion',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  3,
  2,
  140,
  1,
  'active',
  datetime('now')
);

INSERT OR REPLACE INTO saved_properties (user_id, property_id) VALUES
('user-buyer-1', 'prop-1'),
('user-buyer-1', 'prop-2'),
('user-buyer-1', 'prop-3');

INSERT OR REPLACE INTO transactions (
  id, reference_code, buyer_id, seller_id, property_id, status,
  step_current, step_total, progress_percent, price_display, location_line, seller_display_name, created_at
) VALUES
(
  'tx-1',
  'SY-2025-04-0021',
  'user-buyer-1',
  'user-seller-1',
  'prop-1',
  'in_progress',
  3,
  5,
  60,
  '₱8,200,000',
  '📍 Lahug, Cebu City',
  'Maria Santos (Seller)',
  datetime('now')
),
(
  'tx-2',
  'SY-2025-03-0942',
  'user-buyer-1',
  'user-seller-2',
  'prop-2',
  'in_progress',
  2,
  5,
  40,
  '₱35,000/mo',
  '📍 Cebu IT Park',
  'Carlos Reyes (Seller)',
  datetime('now')
),
(
  'tx-3',
  'SY-2025-01-0210',
  'user-buyer-1',
  'user-seller-1',
  'prop-2',
  'completed',
  5,
  5,
  100,
  '₱18,000/mo',
  '📍 Cebu City',
  'Maria Santos (Seller)',
  datetime('now')
);

INSERT OR REPLACE INTO messages (id, thread_id, sender_id, body, created_at, read_flag) VALUES
(
  'msg-1',
  'thread-1',
  'user-seller-1',
  'Glad you liked it, Juan! Do you have any specific questions about the floor plan?',
  datetime('now'),
  1
);

INSERT OR REPLACE INTO contact_inquiries (id, first_name, last_name, email, inquiry_type, message, created_at) VALUES
(1, 'Demo', 'User', 'demo@susync.com', 'General Inquiry', 'Seed row for local database.', datetime('now'));
