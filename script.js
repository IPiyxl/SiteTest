const navLinks = document.querySelectorAll('.nav-menu a');
const currentHash = window.location.hash;

function fetchData() {
    fetch('./posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const dataList = $('#data-list');
            dataList.empty();

            data.forEach(item => {
                const listItem = $(`
                    <div class="anuntSpital flex flex-col min-w-[32.5%] max-w-[32.5%] bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-700 hover:shadow-2xl transition-shadow duration-300">
                        <div class="pozaSpital w-full h-50 relative">
                            <img src="./${item.imagine}.png" alt="Image" class="w-full h-full object-cover rounded-md">
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
                                <h3 class="text-white text-lg font-semibold drop-shadow-sm">Relații Publice</h3>
                            </div>
                        </div>
                        <div class="p-6 space-y-3">
                            <h2 class="text-2xl font-bold text-white">${item.title}</h2>
                            <p class="text-sm text-zinc-300 leading-relaxed">${item.text}</p>
                            <div class="flex flex-wrap gap-2 pt-2">
                                ${item.hashtags
                                    .split(',')
                                    .map(tag => `<span class="bg-rose-200 text-rose-800 px-3 py-1 rounded-full text-xs font-semibold">#${tag.trim()}</span>`)
                                    .join('')}
                            </div>
                        </div>
                        <div class="flex justify-between items-center px-6 py-4 bg-zinc-800 border-t border-zinc-700">
                            <button class="text-sm text-zinc-300 hover:text-white transition">Detalii</button>
                        </div>
                    </div>
                `);
                dataList.append(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

fetchData();

navLinks.forEach(link => {
    if (link.getAttribute('href') === currentHash) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

window.addEventListener('hashchange', () => {
    const newHash = window.location.hash;

    navLinks.forEach(link => {
        if (link.getAttribute('href') === newHash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

document.querySelector('.hamburger').addEventListener('click', function () {
    this.classList.toggle('active');
    document.querySelector('.nav-menu').classList.toggle('active');
});

let sec = document.querySelectorAll('section');
let links = document.querySelectorAll('nav a');

window.onscroll = () => {
    sec.forEach(section => {
        let top = window.scrollY;
        let offset = section.offsetTop;
        let height = section.offsetHeight;
        let id = section.getAttribute('id');

        if (top >= offset && top < offset + height) {
            links.forEach(link => {
                link.classList.remove('active');
                document.querySelector('nav a[href*=' + id + ']').classList.add('active');
            });
        }
    });
};

function formatPhoneNumber(inputId) {
    const phoneInput = document.getElementById(inputId);
    phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, ''); // Elimină caracterele non-numerice
        if (value.length > 3) {
            value = value.slice(0, 3) + '-' + value.slice(3, 7); // Adaugă cratima
        }
        e.target.value = value;
    });
}

window.addEventListener("load", (event) => {
    formatPhoneNumber('NUMAR_DE_TEL');
});

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('NUME').value.trim();
    const cnp = document.getElementById('ID').value.trim();
    const medicReclamat = document.getElementById('NUME_RECLAMAT').value.trim();
    const callSign = document.getElementById('CALL_SIGN').value.trim();
    const phone = document.getElementById('NUMAR_DE_TEL').value.trim();
    const incidentDate = document.getElementById('DATA').value.trim();
    const discordName = document.getElementById('EMAIL').value.trim();
    const proof = document.getElementById('DETALII').value.trim();

    const webhookUrl = "https://discord.com/api/webhooks/1357771363221504040/RNs_MoICw-hD62s_Xpp4xN71QQctJeGE8_r5YBeVoK4VrKWn49svO-L621b7H3xoHuQN";

    const payload = {
        content: `:warning: **Cerere Audiență** :warning:\n**1) Nume:** ${name}\n**2) CNP:** ${cnp}\n**3) Numele medicului reclamat:** ${medicReclamat}\n**4) Call Sign Medic:** ${callSign}\n**5) Număr de telefon:** ${phone}\n**6) Discord:** ${discordName}\n**7) Data incidentului:** ${incidentDate}\n**8) Dovada:** ${proof}`
    };

    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('responseMessage').innerText = `Mulțumim, ${name}! Cererea Dvs a fost inregistrata, un membru al Conducerii se v-a ocupa.`;
            document.getElementById('contactForm').reset();
        } else {
            document.getElementById('responseMessage').innerText = "Eroare la trimiterea mesajului. Te rugăm să încerci din nou.";
        }
    })
    .catch(error => {
        console.error("Eroare la trimiterea datelor către Discord:", error);
        document.getElementById('responseMessage').innerText = "Eroare la trimiterea mesajului. Te rugăm să încerci din nou.";
    });
});

class MediumImage extends HTMLElement {
    constructor() {
        super();

        const shadow = this.attachShadow({ mode: 'open' });

        const container = document.createElement('div');
        const image = document.createElement('div');

        const style = document.createElement('style');
        style.textContent = `
            div {
                width: 300px;
                height: 200px;
                background-size: cover;
                background-position: center;
                border-radius: 8px;
                box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
            }
        `;

        const src = this.getAttribute('src');
        image.style.backgroundImage = `url(${src})`;

        shadow.appendChild(style);
        shadow.appendChild(container);
        container.appendChild(image);
    }
}

customElements.define('medium-image', MediumImage);
