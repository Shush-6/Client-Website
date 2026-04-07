DROP DATABASE IF EXISTS golden_hands;
CREATE DATABASE golden_hands;
\c golden_hands

CREATE TABLE IF NOT EXISTS contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(20),
  service VARCHAR(100),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  duration VARCHAR(50),
  price VARCHAR(50),
  icon VARCHAR(50)
);

INSERT INTO services (title, description, duration, price, icon) VALUES
('Traditional Reiki Healing', 'Experience deep relaxation and energy balancing through Reiki.', '60 min', '1500 INR', '*'),
('Distance Reiki', 'Receive Reiki from anywhere.', '45 min', '1200 INR', '*'),
('Chakra Balancing', 'Balance your energy centers.', '75 min', '1800 INR', '*'),
('Reiki for Stress & Anxiety', 'Relax and release tension.', '60 min', '1500 INR', '*'),
('Crystal Reiki', 'Healing with crystals.', '90 min', '2200 INR', '*'),
('Aura Cleansing', 'Remove negative energy.', '45 min', '1000 INR', '*');