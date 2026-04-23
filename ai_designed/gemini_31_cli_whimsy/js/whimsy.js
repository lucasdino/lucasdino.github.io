document.addEventListener('DOMContentLoaded', () => {
    // Add Whimsy button
    const btn = document.createElement('button');
    btn.className = 'whimsy-btn';
    btn.innerHTML = '☄️ Unleash Whimsy 🦖';
    document.body.appendChild(btn);

    const emojis = ['🦖', '🦕', '☄️', '🌋', '🌴', '🥩', '✨', '💻', '🎨', '🚀'];

    btn.addEventListener('click', () => {
        // Explode emojis
        for(let i=0; i<30; i++) {
            setTimeout(() => {
                const el = document.createElement('div');
                el.className = 'floating-whimsy-icon';
                el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
                el.style.left = Math.random() * 100 + 'vw';
                document.body.appendChild(el);
                setTimeout(() => el.remove(), 3000);
            }, i * 50);
        }
        
        // Randomize Theme Colors
        const colors = ['#FFD166', '#A0E8AF', '#FF9CEE', '#8C52FF', '#FF9F1C', '#06D6A0', '#EF476F', '#118AB2', '#073B4C', '#F7D002', '#F9C22E', '#F15946'];
        
        document.documentElement.style.setProperty('--pink', colors[Math.floor(Math.random() * colors.length)]);
        document.documentElement.style.setProperty('--mint', colors[Math.floor(Math.random() * colors.length)]);
        document.documentElement.style.setProperty('--yellow', colors[Math.floor(Math.random() * colors.length)]);
        document.documentElement.style.setProperty('--orange', colors[Math.floor(Math.random() * colors.length)]);
        document.documentElement.style.setProperty('--blue', colors[Math.floor(Math.random() * colors.length)]);
        document.documentElement.style.setProperty('--bg-color', '#FFF');

        // Playful sounds or title change
        document.title = "🦖 RAWWRR! " + Math.random().toString(36).substring(7);
    });

    // Make all images draggable
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
        img.setAttribute('draggable', 'false'); // Prevent default drag
        img.style.cursor = 'grab';
        
        let isDragging = false;
        let startX, startY, initialX, initialY;

        img.addEventListener('mousedown', (e) => {
            isDragging = true;
            img.style.cursor = 'grabbing';
            img.style.position = 'relative';
            img.style.zIndex = '10000';
            img.style.transition = 'none'; // Disable transition during drag
            startX = e.clientX;
            startY = e.clientY;
            initialX = parseFloat(img.style.left || 0);
            initialY = parseFloat(img.style.top || 0);
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            img.style.left = (initialX + dx) + 'px';
            img.style.top = (initialY + dy) + 'px';
            img.style.transform = `rotate(${dx * 0.05}deg) scale(1.1)`;
        });

        document.addEventListener('mouseup', () => {
            if(isDragging) {
                isDragging = false;
                img.style.cursor = 'grab';
                img.style.zIndex = '';
                img.style.transition = 'transform 0.3s, box-shadow 0.3s'; // Re-enable
                img.style.transform = ''; // Snap back rotation but keep position
            }
        });
    });

    // Add Marquee
    const marqueeContainer = document.createElement('div');
    marqueeContainer.className = 'marquee-container';
    const marqueeText = document.createElement('div');
    marqueeText.className = 'marquee-text';
    marqueeText.innerText = '⚠️ ALERT: GEMINI CLI HAS HIJACKED THIS BORING WEBSITE. NEO-BRUTALISM PROTOCOLS ENGAGED. ENJOY THE WHIMSY. ⚠️';
    marqueeContainer.appendChild(marqueeText);
    document.body.prepend(marqueeContainer);
});