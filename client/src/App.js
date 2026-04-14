import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

import VIBHA_PHOTO from './photos/WhatsApp Image 2025-09-09 at 21.14.16_71fcf7cc.jpg';
const API = process.env.REACT_APP_API_URL || "http://localhost:5001";
function App() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });
  const [activeNav, setActiveNav] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
  axios.get(`${API}/api/services`)
  .then(res => {
    if (Array.isArray(res.data)) {
      setServices(res.data);
    } else {
      console.log("Invalid API response:", res.data);
      setServices([]);
    }
  })
  .catch((err) => {
    console.log("API failed:", err);
    setServices([]);
  });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'services', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) { setActiveNav(id); break; }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    try {
      await axios.post(`${API}/api/contact`, form);
      setStatus({ loading: false, success: true, error: '' });
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.response?.data?.error || 'Something went wrong.' });
    }
  };

  return (
    <div className="app">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => scrollTo('home')}>
          <span className="brand-icon">✦</span>
          <span className="brand-name">Golden Hands</span>
        </div>
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {['home', 'about', 'services', 'contact'].map(link => (
            <li key={link}>
              <button className={activeNav === link ? 'active' : ''} onClick={() => scrollTo(link)}>
                {link.charAt(0).toUpperCase() + link.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Hero ── */}
      <section id="home" className="hero">
        <div className="hero-bg">
          <div className="mandala mandala-1" />
          <div className="mandala mandala-2" />
          <div className="mandala mandala-3" />
          <div className="particles">
            {[...Array(18)].map((_, i) => <span key={i} className="particle" style={{ '--i': i }} />)}
          </div>
        </div>
        <div className="hero-content">
          <p className="hero-tagline">Heal · Restore · Flourish</p>
          <h1 className="hero-title">
            <span>Golden</span>
            <span>Hands</span>
          </h1>
          <p className="hero-subtitle">Reiki Healing & Energy Wellness by Vibha</p>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => scrollTo('contact')}>Book a Session</button>
            <button className="btn-ghost" onClick={() => scrollTo('about')}>Meet Vibha Shukla</button>
          </div>
        </div>
        <div className="scroll-indicator" onClick={() => scrollTo('about')}>
          <span>↓</span>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="about">
        <div className="about-inner">
          <div className="about-photo-wrap">
            <div className="photo-ring" />
            <img src={VIBHA_PHOTO} alt="Vibha – Reiki Healer" className="about-photo" />
            <div className="photo-badge">✦ Certified Reiki Master</div>
          </div>
          <div className="about-text">
            <p className="section-label">About</p>
            <h2 className="section-title">Vibha Shukla</h2>
            <div className="golden-rule" />
            <p>
              With over a decade of experience in energy healing, I am a certified Reiki Master dedicated to helping you rediscover balance, peace, and vitality. My journey began with a personal healing experience that transformed my life — and I have since devoted myself to sharing that gift with others.
            </p>
            <p>
              My practice, <strong>Golden Hands</strong>, is a sacred space where science and spirituality meet. I believe every person carries an innate capacity to heal, and Reiki is simply the channel through which we awaken it.
            </p>
            <div className="about-badges">
              <span>🌸 Reiki Healing</span>
              <span>💎 Crystal Healing</span>
              <span>🌀 Chakra Healing</span>
              {/* <span>✨ 500+ Sessions</span> */}
            </div>
            <button className="btn-primary" onClick={() => scrollTo('contact')}>Connect with Me</button>
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="services">
        <div className="section-header">
          <p className="section-label">Offerings</p>
          <h2 className="section-title">Healing Services</h2>
          <div className="golden-rule center" />
          <p className="section-desc">Each session is lovingly tailored to your unique energy and intentions.</p>
        </div>
       <div className="services-grid">
  {Array.isArray(services) && services.length > 0 ? (
    services.map(s => (
      <div className="service-card" key={s.id}>
        <div className="service-icon">{s.icon}</div>
        <h3>{s.title}</h3>
        <p>{s.description}</p>
        <div className="service-meta">
          <span>⏱ {s.duration}</span>
          <span className="service-price">₹{s.price}</span>
        </div>
        <button className="btn-outline" onClick={() => {
          setForm(f => ({ ...f, service: s.title }));
          scrollTo('contact');
        }}>Book This</button>
      </div>
    ))
  ) : (
            // Fallback static cards if API unavailable
            [
              { icon: '✦', title: 'Traditional Reiki', desc: 'Deep energy balancing for mind, body & soul.', dur: '60 min', price: '₹800' },
              { icon: '◈', title: 'Distance Reiki', desc: 'Healing without boundaries, wherever you are.', dur: '45 min', price: '₹500' },
              { icon: '◉', title: 'Chakra Balancing', desc: 'Restore natural energy flow through all seven centers.', dur: '75 min', price: '₹800' },
              { icon: '❋', title: 'Stress & Anxiety Relief', desc: 'Calm the nervous system, release held tension.', dur: '60 min', price: '₹800' },
              { icon: '◆', title: 'Crystal Reiki', desc: 'Amplified healing with carefully chosen crystals.', dur: '90 min', price: '₹800' },
              { icon: '✿', title: 'Aura Cleansing', desc: 'Clear negative energies, strengthen your field.', dur: '45 min', price: '₹800' },
            ].map((s, i) => (
              <div className="service-card" key={i}>
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="service-meta">
                  <span>⏱ {s.dur}</span>
                  <span className="service-price">₹{s.price}</span>
                </div>
                <button className="btn-outline" onClick={() => scrollTo('contact')}>Book This</button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="testimonials">
        <div className="section-header">
          <p className="section-label">Experiences</p>
          <h2 className="section-title">Words of Healing</h2>
          <div className="golden-rule center" />
        </div>
        <div className="testimonials-grid">
          {[
            { name: 'Priya S.', text: 'My first Reiki session with Vibha left me feeling lighter than I have in years. Her presence is incredibly calming and her hands radiate warmth.', stars: 5 },
            { name: 'Rohan M.', text: 'I was skeptical at first but after three sessions my chronic shoulder pain has reduced dramatically. Truly magical experience.', stars: 5 },
            { name: 'Ananya K.', text: 'Distance Reiki was surprisingly powerful. I felt deep relaxation within minutes and slept better than ever after the session.', stars: 5 },
          ].map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="stars">{'★'.repeat(t.stars)}</div>
              <p>"{t.text}"</p>
              <span className="testimonial-name">— {t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="contact">
        <div className="contact-inner">
          <div className="contact-info">
            <p className="section-label">Connect</p>
            <h2 className="section-title">Begin Your Journey</h2>
            <div className="golden-rule" />
            <p>Reach out and take the first step toward healing. Every journey begins with a single intention.</p>
            <div className="contact-details">
              <div className="contact-item"><span>📧</span> healervibha@gmail.com</div>
              <div className="contact-item"><span>📱</span> +91 7521941996</div>
              <div className="contact-item"><span>📍</span> Varanasi, India</div>
              <div className="contact-item"><span>🕐</span> Mon – Sat, 9 AM – 7 PM</div>
            </div>
          </div>
          <div className="contact-form-wrap">
            {status.success ? (
              <div className="success-state">
                <div className="success-icon">✦</div>
                <h3>Message Received</h3>
                <p>Thank you for reaching out. Vibha will respond within 24 hours with love and light.</p>
                <button className="btn-primary" onClick={() => setStatus({ loading: false, success: false, error: '' })}>Send Another</button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your Name" />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 99999 99999" />
                  </div>
                  <div className="form-group">
                    <label>Interested In</label>
                    <select name="service" value={form.service} onChange={handleChange}>
                      <option value="">Select a service</option>
                      {(services.length > 0 ? services : [
                        { title: 'Traditional Reiki Healing' }, { title: 'Distance Reiki' },
                        { title: 'Chakra Balancing' }, { title: 'Reiki for Stress & Anxiety' },
                        { title: 'Crystal Reiki' }, { title: 'Aura Cleansing' },
                      ]).map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group full">
                  <label>Your Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Share what you're seeking to heal or any questions you have..." />
                </div>
                {status.error && <p className="error-msg">⚠ {status.error}</p>}
                <button type="submit" className="btn-primary submit-btn" disabled={status.loading}>
                  {status.loading ? <span className="spinner" /> : '✦ Send Message to Vibha'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="brand-icon">✦</span>
            <span className="brand-name">Golden Hands</span>
          </div>
          <p className="footer-tagline">Healing through the power of energy & intention</p>
          <p className="footer-copy">© {new Date().getFullYear()} Golden Hands Reiki by Vibha. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
