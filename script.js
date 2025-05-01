// ---------------- NAVIGATION LOGIC ----------------
const navLinks = document.querySelectorAll('.nav-menu a');
const currentHash = window.location.hash;

navLinks.forEach(link => {
  link.classList.toggle('active', link.getAttribute('href') === currentHash);
});

window.addEventListener('hashchange', () => {
  const newHash = window.location.hash;
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === newHash);
  });
});

// ---------------- FETCH & DISPLAY ANNOUNCEMENTS ----------------
function fetchData() {
  fetch('./posts.json')
    .then(response => {
      if (!response.ok) throw new Error('Eroare la încărcarea datelor!');
      return response.json();
    })
    .then(data => {
      const dataList = document.getElementById('data-list');
      if (!dataList) return;

      dataList.innerHTML = ''; // Golește conținutul anterior
      dataList.style.display = 'flex';
      dataList.style.flexWrap = 'wrap';
      dataList.style.gap = '24px';
      dataList.style.justifyContent = 'center';

      data.forEach(item => {
        const card = document.createElement('div');
        card.className = `
          anuntSpital flex flex-col bg-zinc-800/70 text-white rounded-2xl shadow-xl 
          overflow-hidden max-w-[360px] transition-transform duration-300 hover:scale-[1.03]
        `;
        card.innerHTML = `
          <div class="relative h-48 overflow-hidden">
            <img src="./${item.imagine}.png" alt="Imagine" class="w-full h-full object-cover">
            <div class="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-3">
              <h3 class="text-lg font-bold drop-shadow">Relații Publice</h3>
            </div>
          </div>
          <div class="p-5">
            <h2 class="text-xl font-semibold flex items-center gap-2">
              ${getEmoji(item.title)} ${item.title}
            </h2>
            <p class="text-sm mt-2 text-zinc-300">${item.text}</p>
            <div class="mt-4">
              <span class="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                #${item.hashtags}
              </span>
            </div>
          </div>
        `;
        dataList.appendChild(card);
      });
    })
    .catch(err => console.error('Eroare la preluarea anunțurilor:', err));
}

function getEmoji(title) {
  const lower = title.toLowerCase();
  if (lower.includes('adeverin')) return '📝';
  if (lower.includes('chirurgie')) return '🏥';
  if (lower.includes('tatuaj')) return '💉';
  if (lower.includes('consulta')) return '🩺';
  if (lower.includes('urgent')) return '🚑';
  return '📢';
}

// ---------------- HAMBURGER MENU ----------------
const hamburger = document.querySelector('.hamburger');
if (hamburger) {
  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    document.querySelector('.nav-menu')?.classList.toggle('active');
  });
}

// ---------------- SCROLL-BASED NAV HIGHLIGHT ----------------
window.onscroll = () => {
  const sections = document.querySelectorAll('section');
  const links = document.querySelectorAll('nav a');

  sections.forEach(section => {
    const top = window.scrollY;
    const offset = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (top >= offset && top < offset + height) {
      links.forEach(link => link.classList.remove('active'));
      document.querySelector(`nav a[href*="${id}"]`)?.classList.add('active');
    }
  });
};

// ---------------- FORMAT PHONE NUMBER ----------------
function formatPhoneNumber(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', e => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) {
      value = value.slice(0, 3) + '-' + value.slice(3, 7);
    }
    e.target.value = value;
  });
}

// ---------------- DISCORD WEBHOOK FORM ----------------
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const getValue = id => document.getElementById(id)?.value.trim() || '';
    const payload = {
      content: `:warning: **Cerere Audiență** :warning:\n` +
        `**1) Nume:** ${getValue('NUME')}\n` +
        `**2) CNP:** ${getValue('ID')}\n` +
        `**3) Numele medicului reclamat:** ${getValue('NUME_RECLAMAT')}\n` +
        `**4) Call Sign Medic:** ${getValue('CALL_SIGN')}\n` +
        `**5) Număr de telefon:** ${getValue('NUMAR_DE_TEL')}\n` +
        `**6) Discord:** ${getValue('EMAIL')}\n` +
        `**7) Data incidentului:** ${getValue('DATA')}\n` +
        `**8) Dovada:** ${getValue('DETALII')}`
    };

    fetch("https://discord.com/api/webhooks/1357771363221504040/RNs_MoICw-hD62s_Xpp4xN71QQctJeGE8_r5YBeVoK4VrKWn49svO-L621b7H3xoHuQN", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(response => {
        const msg = document.getElementById('responseMessage');
        if (response.ok) {
          msg.innerText = `Mulțumim, ${getValue('NUME')}! Cererea ta a fost trimisă.`;
          contactForm.reset();
        } else {
          msg.innerText = "Eroare la trimitere. Încearcă din nou.";
        }
      })
      .catch(error => {
        console.error("Eroare Discord:", error);
        document.getElementById('responseMessage').innerText = "Eroare la conexiune.";
      });
  });
}

// ---------------- INITIALIZE ----------------
window.addEventListener("load", () => {
  fetchData();
  formatPhoneNumber('NUMAR_DE_TEL');
});
