

const EMAIL = 'shei4u.sasi@gmail.com';

document.getElementById('year').textContent = new Date().getFullYear();

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.textContent = open ? 'Tutup' : 'Menu';
}

menuBtn.addEventListener('click', () => {
  setMenu(!navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

const fanBtn = document.getElementById('fanBtn');
const fanHint = fanBtn.querySelector('.fan-hint');

fanBtn.addEventListener('click', () => {
  const isOpen = fanBtn.classList.toggle('open');

  fanBtn.setAttribute('aria-expanded', String(isOpen));
  fanBtn.setAttribute('aria-label', isOpen ? 'Tutup foto profil Sasi' : 'Buka foto profil Sasi');
  fanHint.textContent = isOpen ? 'Klik foto untuk menutup' : 'Klik kipas untuk melihat foto';
});

const backLayer = document.querySelector('.petals-back');
const frontLayer = document.querySelector('.petals-front');
const rand = (min, max) => min + Math.random() * (max - min);

function createPetal() {
  // depth: 0 = jauh (kecil, pelan, buram), 1 = dekat (besar, cepat, terang)
  const depth = Math.random();
  const isNear = depth > 0.75;
  const isFar = depth < 0.3;

  const size = 12 + depth * 26;                 // 12px - 38px
  const fall = 24 - depth * 12 + rand(0, 4);    // jauh lebih lambat dari dekat
  const sway = rand(25, 70) * (0.5 + depth);    // jarak goyangan kiri kanan
  const swayTime = rand(3, 6);
  const spin = rand(4, 9);
  const alpha = isNear ? rand(0.55, 0.75) : rand(0.6, 0.95);

  const petal = document.createElement('span');
  petal.className = 'petal' + (isNear ? ' near' : '') + (isFar ? ' far' : '');

  petal.style.left = rand(-5, 100) + 'vw';
  petal.style.setProperty('--size', size + 'px');
  petal.style.setProperty('--fall', fall + 's');
  petal.style.setProperty('--fall-delay', -rand(0, fall) + 's'); // sudah jatuh sejak awal
  petal.style.setProperty('--drift', rand(-12, 25) + 'vw');      // angin mendorong ke kanan
  petal.style.setProperty('--sway', sway + 'px');
  petal.style.setProperty('--sway-time', swayTime + 's');
  petal.style.setProperty('--sway-delay', -rand(0, swayTime) + 's');
  petal.style.setProperty('--spin', spin + 's');
  petal.style.setProperty('--alpha', alpha);

  // 30% bunga utuh, 70% kelopak tunggal
  const shape = Math.random() < 0.3 ? 'blossom' : 'petal';

  petal.innerHTML =
    '<span class="petal-sway">' +
      '<svg class="petal-shape"><use href="#' + shape + '"></use></svg>' +
    '</span>';

  // Kelopak dekat tampil di depan konten, sisanya di belakang
  (isNear ? frontLayer : backLayer).appendChild(petal);
}

const petalCount = window.innerWidth < 640 ? 18 : 32;
for (let i = 0; i < petalCount; i++) createPetal();

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

function showStatus(type, text) {
  status.className = 'form-status ' + type; 
  status.textContent = text;
  status.hidden = false;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  const email = String(data.get('email')).trim();
  const message = String(data.get('message')).trim();

  submitBtn.disabled = true;
  submitBtn.textContent = 'Mengirim...';
  showStatus('info', 'Sedang mengirim pesan...');

  try {
    const response = await fetch('https://formsubmit.co/ajax/' + EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        name,
        email,
        message,
        _subject: 'Pesan dari Portofolio SHEI4U',
        _template: 'table',
        _captcha: 'false'
      })
    });

    if (!response.ok) throw new Error('Pengiriman gagal');

    showStatus('success', 'Pesan berhasil dikirim. Terima kasih, ' + name + '.');
    form.reset();
  } catch (error) {
    const subject = encodeURIComponent('Pesan dari Portofolio SHEI4U');
    const body = encodeURIComponent('Nama: ' + name + '\nEmail: ' + email + '\n\nPesan:\n' + message);

    window.location.href = 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + body;
    showStatus('warning', 'Membuka aplikasi email Anda. Jika tidak terbuka, kirim pesan secara manual ke ' + EMAIL + '.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Kirim Pesan';
  }
});
