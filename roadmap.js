/**
 * NEXTMILE EMPIRE - Roadmap Engine
 * * ІНСТРУКЦІЯ ДЛЯ ОНОВЛЕННЯ ПРОГРЕСУ НА GITHUB:
 * 1. Відкрий roadmap.html у браузері.
 * 2. Відміть галочками виконані пункти.
 * 3. Натисніть кнопку "Отримати код" (зверху справа).
 * 4. Скопіюй текст і ЗАМІНИ ним блок "CURRENT_PROGRESS" нижче.
 */

// 👇 --- ПОЧАТОК БЛОКУ ДЛЯ ЗАМІНИ --- 👇
const CURRENT_PROGRESS = {
    // Цей список буде оновлюватися, коли ти вставиш сюди новий код
    // Наприклад: "c1_1": true, "c1_2": true...
};
// 👆 --- КІНЕЦЬ БЛОКУ ДЛЯ ЗАМІНИ --- 👆


document.addEventListener('DOMContentLoaded', () => {
    // 1. Завантажуємо прогрес із коду (те, що ти зберіг)
    applyProgress(CURRENT_PROGRESS);
    
    // 2. Слухаємо зміни (щоб рухати ракету в реальному часі)
    document.querySelectorAll('input[type="checkbox"]').forEach(box => {
        box.addEventListener('change', () => {
            updateUI();
        });
    });

    // 3. Кнопка "Отримати код"
    document.getElementById('btnGetCode').addEventListener('click', generateCode);
});

function updateUI() {
    const totalBoxes = document.querySelectorAll('input[type="checkbox"]').length;
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked').length;
    
    // Рухаємо ракету
    const percent = totalBoxes > 0 ? Math.round((checkedBoxes / totalBoxes) * 100) : 0;
    const rocketBar = document.getElementById('rocketBar');
    const rocketText = document.getElementById('progressText');
    
    rocketBar.style.width = `${percent}%`;
    rocketText.innerText = `${percent}%`;

    if (checkedBoxes > 0) {
        rocketBar.classList.add('moving');
        setTimeout(() => rocketBar.classList.remove('moving'), 500);
    }

    // Підсвічуємо модулі
    document.querySelectorAll('.module-card').forEach(card => {
        const boxesInCard = card.querySelectorAll('input[type="checkbox"]');
        const checkedInCard = card.querySelectorAll('input[type="checkbox"]:checked');
        const statusIcon = card.querySelector('.mod-status i');
        
        if (boxesInCard.length > 0 && boxesInCard.length === checkedInCard.length) {
            card.classList.add('completed');
            statusIcon.className = 'fa-solid fa-circle-check'; 
        } else {
            card.classList.remove('completed');
            statusIcon.className = 'fa-regular fa-circle';
        }
    });
}

function applyProgress(data) {
    if (!data) return;
    for (const [id, isChecked] of Object.entries(data)) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = isChecked;
        }
    }
    updateUI(); // Оновити графіку після проставлення галочок
}

function generateCode() {
    const state = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(box => {
        if (box.checked) {
            state[box.id] = true;
        }
    });

    // Формуємо красивий рядок коду
    const jsonString = JSON.stringify(state, null, 4);
    const codeToCopy = `const CURRENT_PROGRESS = ${jsonString};`;

    // Копіюємо в буфер обміну
    navigator.clipboard.writeText(codeToCopy).then(() => {
        // Анімація успіху на кнопці
        const btn = document.getElementById('btnGetCode');
        const originalContent = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Скопійовано!</span>';
        btn.style.background = '#00ff88';
        btn.style.color = '#000';
        
        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.style.color = '';
        }, 2000);
        
        alert("✅ Код скопійовано!\n\nТепер відкрий файл roadmap.js і заміни блок 'const CURRENT_PROGRESS = { ... }' на те, що ти скопіював.");
    }).catch(err => {
        console.error('Помилка копіювання:', err);
        alert('Не вдалося скопіювати код автоматично. Відкрий консоль (F12) щоб побачити його.');
    });
}
