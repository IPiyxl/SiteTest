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
                const listItem = $(
                    `<div class="anuntSpital flex flex-col min-w-[32.5%] max-w-[32.5%] min-h-[400px] bg-zinc-600 rounded-xl shadow-md overflow-hidden border border-zinc-600 dark:border-zinc-700">
                        <div class="pozaSpital w-full h-[200px] relative border-b border-zinc-600 dark:border-zinc-700">
                            <img src="./${item.imagine}.png" alt="Image" class="mt-0 w-full h-full rounded-md">
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
                                <h3 class="text-white text-xl font-bold">Relații Publice</h3>
                            </div>
                        </div>
                        <div class="p-6 border-b border-zinc-600 dark:border-zinc-700">
                            <h2 class="text-2xl font-semibold text-white-800 dark:text-zinc-100">${item.title}</h2>
                            <p class="mt-2 text-white-600 dark:text-zinc-300">${item.text}</p>
                            <div class="mt-4 flex gap-2">
                            </div>
                        </div>
                        <div class="flex justify-between items-center px-6 py-4 bg-zinc-800 dark:bg-zinc-800 border-t border-zinc-600 dark:border-zinc-700">
                        </div>
                    </div>`
                );
                $("#data-list").css("display", "flex")
                dataList.append(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

fetchData();

// Rezolvă problema cu bara de scroll orizontală
const style = document.createElement('style');
style.textContent = `
    body {
        overflow-x: hidden;
    }
`;
document.head.appendChild(style);

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
        let offset = section.offsetTop;  // Fix: use 'section' here
        let height = section.offsetHeight;  // Fix: use 'section' here
        let id = section.getAttribute('id');  // Fix: use 'section' here

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

        // Preluăm datele din formular
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
