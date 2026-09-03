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
        () => {
          // Do NOT cache the fallback — retry real GPS again next time the app loads
          resolve(this.DEFAULT_COORDS);
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
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

  getReciter() {
    return localStorage.getItem('islamapp_reciter') || 'ar.alafasy';
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

  HADITH_POOL: [
    { arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ', bangla: 'সমস্ত কাজ নিয়তের উপর নির্ভরশীল, এবং প্রত্যেক ব্যক্তি তা-ই পাবে যা সে নিয়ত করেছে।', ref: 'সহীহ বুখারী' },
    { arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', bangla: 'তোমাদের কেউ ততক্ষণ পূর্ণ মুমিন হবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তা-ই পছন্দ করে, যা সে নিজের জন্য পছন্দ করে।', ref: 'সহীহ মুসলিম' },
    { arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', bangla: 'প্রকৃত মুসলিম সে, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।', ref: 'সহীহ বুখারী' },
    { arabic: 'الطُّهُورُ شَطْرُ الإِيمَانِ', bangla: 'পবিত্রতা ঈমানের অর্ধেক অংশ।', ref: 'সহীহ মুসলিম' },
    { arabic: 'مَنْ لاَ يَرْحَمُ لاَ يُرْحَمُ', bangla: 'যে দয়া করে না, তার প্রতি দয়া করা হয় না।', ref: 'সহীহ মুসলিম' },
    { arabic: 'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ', bangla: 'শক্তিশালী মুমিন দুর্বল মুমিনের চেয়ে আল্লাহর কাছে উত্তম ও অধিক প্রিয়।', ref: 'সুনানে আবু দাউদ' },
    { arabic: 'مَنْ سَلَكَ طَرِيقًا يَطْلُبُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ', bangla: 'যে ব্যক্তি জ্ঞান অন্বেষণের পথে চলে, আল্লাহ তার জন্য জান্নাতের পথ সহজ করে দেন।', ref: 'জামে তিরমিযী' },
    { arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', bangla: 'জ্ঞান অর্জন করা প্রত্যেক মুসলিমের উপর ফরজ।', ref: 'সুনানে ইবনে মাজাহ' },
    { arabic: 'الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَٰنُ', bangla: 'যারা দয়াশীল, দয়াময় আল্লাহ তাদের প্রতি দয়া করেন।', ref: 'সুনানে ইবনে মাজাহ' },
    { arabic: 'إِذَا مَاتَ ابْنُ آدَمَ انْقَطَعَ عَمَلُهُ إِلاَّ مِنْ ثَلاَثَةٍ', bangla: 'মানুষ মৃত্যুবরণ করলে তার আমল বন্ধ হয়ে যায়, তবে তিনটি বিষয় ব্যতীত: সদকায়ে জারিয়া, উপকারী জ্ঞান ও নেক সন্তানের দোয়া।', ref: 'সহীহ মুসলিম' },
  ],

  async getDailyReminder() {
    const todayKey = new Date().toISOString().slice(0, 10);
    let stored = null;
    try { stored = JSON.parse(localStorage.getItem('islamapp_daily_reminder') || 'null'); } catch (e) {}
    if (stored && stored.date === todayKey) return stored;

    let reminder;
    const wantQuran = Math.random() < 0.5;
    if (wantQuran) {
      try {
        const ayahNum = Math.floor(Math.random() * 6236) + 1;
        const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNum}/editions/quran-uthmani,bn.bengali`);
        const json = await res.json();
        const [arabicEd, banglaEd] = json.data;
        reminder = {
          date: todayKey, type: 'quran',
          arabic: arabicEd.text, bangla: banglaEd.text,
          ref: `সূরা ${arabicEd.surah.englishName} (${arabicEd.surah.number}:${arabicEd.numberInSurah})`
        };
      } catch (e) { reminder = null; }
    }
    if (!reminder) {
      const item = this.HADITH_POOL[Math.floor(Math.random() * this.HADITH_POOL.length)];
      reminder = { date: todayKey, type: 'hadith', ...item };
    }
    localStorage.setItem('islamapp_daily_reminder', JSON.stringify(reminder));
    return reminder;
  },

  maybeNotifyDailyReminder(reminder) {
    if (!reminder || !('Notification' in window) || Notification.permission !== 'granted') return;
    if (localStorage.getItem('islamapp_notif_off') === '1') return;
    if (localStorage.getItem('islamapp_last_notified_date') === reminder.date) return;
    const title = reminder.type === 'quran' ? '📖 আজকের কুরআনের আয়াত' : '📿 আজকের হাদিস';
    const body = (reminder.bangla || '').slice(0, 130);
    try { new Notification(title, { body, icon: '../assets/logo.svg' }); } catch (e) {}
    localStorage.setItem('islamapp_last_notified_date', reminder.date);
  },

  // ---- Theme (dark/light/system) — actually recolors the whole app ----
  applyTheme(theme) {
    const t = theme || localStorage.getItem('islamapp_theme') || 'dark';
    document.documentElement.classList.remove('dark', 'light');
    if (t === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(t);
    }
  },

  injectThemeStyles() {
    if (document.getElementById('islamapp-theme-style')) return;
    const style = document.createElement('style');
    style.id = 'islamapp-theme-style';
    style.textContent = `
      html.light body,
      html.light .bg-surface,
      html.light .bg-surface\\/80 { background-color: #f4f9f6 !important; }
      html.light body { color: #0d1f16 !important; }
      html.light .bg-surface-container,
      html.light .bg-surface-container-low,
      html.light .bg-surface-container-lowest,
      html.light .bg-surface-container-lowest\\/50 { background-color: #eef6f1 !important; }
      html.light .bg-surface-container-high { background-color: #dfeae4 !important; }
      html.light .bg-surface-container-highest { background-color: #cfe0d6 !important; }
      html.light .bg-surface-variant { background-color: #d7e5dd !important; }
      html.light .text-on-surface { color: #0d1f16 !important; }
      html.light .text-on-surface-variant,
      html.light .placeholder\\:text-on-surface-variant::placeholder { color: #46564d !important; }
      html.light .text-primary { color: #0e8a5c !important; }
      html.light .bg-primary { background-color: #0e8a5c !important; }
      html.light .border-primary { border-color: #0e8a5c !important; }
      html.light .text-secondary { color: #9c7a0a !important; }
      html.light .bg-secondary { background-color: #9c7a0a !important; }
      html.light .bg-on-primary,
      html.light .text-on-primary { color: #ffffff !important; }
      html.light .shadow-\\[0_1px_8px_rgba\\(0\\,0\\,0\\,0\\.04\\)\\] { box-shadow: 0 1px 8px rgba(0,0,0,0.08) !important; }
      html.light ::-webkit-scrollbar-thumb { background: #cfe0d6 !important; }
      html.light .name-card, html.light .bg-surface-container-high.border-2 { background-color: #eef6f1 !important; }
    `;
    document.head.appendChild(style);
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
    const fajr = todays[0];
    fajr.time.setDate(fajr.time.getDate() + 1);
    return fajr;
  },

  getLanguage() {
    return localStorage.getItem('islamapp_lang') || 'bn';
  },

  // ---- i18n ----
  I18N: {
    en: {
      home: 'Home', quran: 'Quran', duas: 'Duas', prayer: 'Prayer', more: 'More',
      next_prayer: 'Next Prayer', prayer_times: 'Prayer Times', continue_reading: 'Continue reading',
      mosques: 'Mosques', names_99: '99 Names', islamic_calendar: 'Islamic Calendar', settings: 'Settings',
      search: 'Search', today: 'Today', loading: 'Loading…', explore: 'Explore', appearance: 'Appearance',
      app_theme: 'App Theme', location: 'Location', calc_method: 'Calculation Method',
      language: 'Language', audio_reciter: 'Audio Reciter', notifications: 'Notifications',
      general: 'General', hadith_collection: 'Hadith Collection', developed_by: 'Developed by AHR',
    },
    bn: {
      home: 'হোম', quran: 'কুরআন', duas: 'দোয়া', prayer: 'নামাজ', more: 'আরও',
      next_prayer: 'পরবর্তী নামাজ', prayer_times: 'নামাজের সময়সূচী', continue_reading: 'পড়া চালিয়ে যান',
      mosques: 'মসজিদ', names_99: '৯৯ নাম', islamic_calendar: 'ইসলামিক ক্যালেন্ডার', settings: 'সেটিংস',
      search: 'খুঁজুন', today: 'আজ', loading: 'লোড হচ্ছে…', explore: 'অন্বেষণ', appearance: 'থিম',
      app_theme: 'অ্যাপ থিম', location: 'অবস্থান', calc_method: 'হিসাব পদ্ধতি',
      language: 'ভাষা', audio_reciter: 'অডিও ক্বারী', notifications: 'নোটিফিকেশন',
      general: 'সাধারণ', hadith_collection: 'হাদিস সংকলন', developed_by: 'ডেভেলপার: AHR',
    }
  },

  t(key) {
    const lang = this.getLanguage();
    return (this.I18N[lang] && this.I18N[lang][key]) || this.I18N.en[key] || key;
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.getAttribute('data-i18n'));
    });
  },

  // ---- Global tap animation + page fade-in (injected once per page) ----
  injectGlobalUX() {
    if (document.getElementById('islamapp-global-style')) return;
    const style = document.createElement('style');
    style.id = 'islamapp-global-style';
    style.textContent = `
      button, a, [role="button"], .cursor-pointer { transition: transform .15s ease, opacity .15s ease, box-shadow .2s ease; }
      button:active, a:active, [role="button"]:active, .cursor-pointer:active { transform: scale(0.95); opacity: 0.85; }
      @keyframes islamapp-fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      main { animation: islamapp-fadein .35s ease both; }
      .islamapp-pop { animation: islamapp-pop-kf .25s cubic-bezier(.34,1.56,.64,1) both; }
      @keyframes islamapp-pop-kf { from { opacity: 0; transform: scale(.9); } to { opacity: 1; transform: scale(1); } }
      .islamapp-modal-backdrop { animation: islamapp-fadein .2s ease both; }
    `;
    document.head.appendChild(style);
  },

  devCredit() {
    return this.t('developed_by');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ISLAM_APP.injectGlobalUX();
  ISLAM_APP.injectThemeStyles();
  ISLAM_APP.applyTheme();
  ISLAM_APP.applyTranslations();

  // Check the daily reminder now, and again periodically while the tab stays open
  ISLAM_APP.getDailyReminder().then(r => ISLAM_APP.maybeNotifyDailyReminder(r));
  setInterval(() => {
    ISLAM_APP.getDailyReminder().then(r => ISLAM_APP.maybeNotifyDailyReminder(r));
  }, 30 * 60 * 1000);
});

