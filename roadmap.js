/**
 * NEXTMILE EMPIRE - Roadmap Engine
 * Logic: Save progress, animate rocket, handle module completion.
 */

document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    
    // Слухаємо кожен клік по чекбоксу
    document.querySelectorAll('input[type="checkbox"]').forEach(box => {
        box.addEventListener('change', () => {
            saveProgress();
            updateUI();
        });
    });
});

function updateUI() {
    const totalBoxes = document.querySelectorAll('input[type="checkbox"]').length;
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked').length;
    
    // 1. Оновлюємо Ракету (Прогрес)
    const percent = Math.round((checkedBoxes / totalBoxes) * 100);
    const rocketBar = document.getElementById('rocketBar');
    const rocketText = document.getElementById('progressText');
    
    rocketBar.style.width = `${percent}%`;
    rocketText.innerText = `${percent}%`;

    // Ефект "руху" ракети (додаємо клас, потім прибираємо)
    rocketBar.classList.add('moving');
    setTimeout(() => rocketBar.classList.remove('moving'), 500);

    // 2. Перевіряємо кожен модуль
    document.querySelectorAll('.module-card').forEach(card => {
        const boxesInCard = card.querySelectorAll('input[type="checkbox"]');
        const checkedInCard = card.querySelectorAll('input[type="checkbox"]:checked');
        
        const statusIcon = card.querySelector('.mod-status i');
        
        // Якщо ВСІ пункти в картці виконані
        if (boxesInCard.length > 0 && boxesInCard.length === checkedInCard.length) {
            card.classList.add('completed');
            statusIcon.className = 'fa-solid fa-circle-check'; // Міняємо іконку на галочку
        } else {
            card.classList.remove('completed');
            statusIcon.className = 'fa-regular fa-circle'; // Повертаємо пустий круг
        }
    });
}

function saveProgress() {
    // Збираємо стан всіх галочок (true/false)
    const state = {};
    document.querySelectorAll('input[type="checkbox"]').forEach((box, index) => {
        state[`box_${index}`] = box.checked;
    });
    localStorage.setItem('nextmile_roadmap_v1', JSON.stringify(state));
}

function loadProgress() {
    const saved = localStorage.getItem('nextmile_roadmap_v1');
    if (saved) {
        const state = JSON.parse(saved);
        document.querySelectorAll('input[type="checkbox"]').forEach((box, index) => {
            if (state[`box_${index}`]) {
                box.checked = true;
            }
        });
    }
    // Одразу оновлюємо вигляд після завантаження
    updateUI();
}
