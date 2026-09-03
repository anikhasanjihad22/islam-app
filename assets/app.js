// Shared utilities for Islam App - real API wiring (no keys required)
const ISLAM_APP = {
  DEFAULT_COORDS: { lat: 21.4225, lon: 39.8262, city: 'Mecca, Saudi Arabia' },

  async getCoords() {
    const cached = localStorage.getItem('islamapp_coords');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) {}
    }
    return new Promise((resolve) => {
      if (!navigator.geolocation) return resolve(this.DEFAULT_COORDS);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude, city: 'Your Location' };
          localStorage.setItem('islamapp_coords', JSON.stringify(coords));
          resolve(coords);
        },
        () => resolve(this.DEFAULT_COORDS),
        { timeout: 5000 }
      );
    });
  },

  formatDate(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  },

  getMethod() {
    return localStorage.getItem('islamapp_method') || '2'; // 2 = Muslim World League
  },

  async fetchPrayerTimes(lat, lon, date = new Date()) {
    const dateStr = this.formatDate(date);
    const method = this.getMethod();
    const url = `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${lat}&longitude=${lon}&method=${method}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
  },

  async fetchHijriDate(date = new Date()) {
    const dateStr = this.formatDate(date);
    const res = await fetch(`https://api.aladhan.com/v1/gToH/${dateStr}`);
    const data = await res.json();
    return data.data.hijri;
  },

  async fetchHijriCalendar(month, year, lat, lon) {
    const url = `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}?latitude=${lat}&longitude=${lon}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.data;
  },

  async fetch99Names() {
    const res = await fetch('https://api.aladhan.com/v1/asmaAlHusna');
    const data = await res.json();
    return data.data;
  },

  async fetchSurahList() {
    const res = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await res.json();
    return data.data;
  },

  async fetchSurah(number) {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${number}/editions/quran-uthmani,en.asad`);
    const data = await res.json();
    return data.data; // [arabicEdition, englishEdition]
  },

  to12h(t) {
    if (!t) return '--:--';
    const clean = t.split(' ')[0];
    const [h, m] = clean.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  },

  countdownStr(targetDate) {
    const diff = targetDate - new Date();
    if (diff <= 0) return '00:00:00';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  },

  // Given today's timings object from Aladhan, find next prayer {name, time: Date}
  getNextPrayer(timings) {
    const order = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const now = new Date();
    const todays = order.map((name) => {
      const clean = (timings[name] || '00:00').split(' ')[0];
      const [h, m] = clean.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return { name, time: d };
    });
    for (const p of todays) {
      if (p.time > now) return p;
    }
    // all passed -> next is tomorrow's Fajr
    const fajr = todays[0];
    fajr.time.setDate(fajr.time.getDate() + 1);
    return fajr;
  }
};
