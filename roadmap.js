/**
 * NEXTMILE EMPIRE - Command Center Logic v2.0
 * * ІНСТРУКЦІЯ:
 * 1. Відміть виконані пункти в браузері.
 * 2. Натисни кнопку "ЗБЕРЕГТИ ПРОГРЕС".
 * 3. Скопіюй отриманий код і заміни ним блок CURRENT_PROGRESS нижче.
 */

// 👇 ВСТАВЛЯЙ СЮДИ КОД ВІД КНОПКИ 👇
const CURRENT_PROGRESS = {
    // Наприклад: "m1_1_1": true, "m1_1_2": true
};
// 👆 ---------------------------- 👆


document.addEventListener('DOMContentLoaded', () => {
    // 1. Завантажуємо "фундаментальний" прогрес із файлу
    applyProgress(CURRENT_PROGRESS);

    // 2. Накладаємо зверху свіжі зміни з пам'яті браузера
    loadLocalChanges();
    
    // 3. Запускаємо прослуховування всіх галочок
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(box => {
        box.addEventListener('change', () => {
            saveLocalChanges(); // Запам'ятовуємо в браузері
            updateUI();         // Оновлюємо графіку
            triggerRocketEffect(); // Пшик-пшик (вогонь з ракети)
        });
    });

    // 4. Кнопка генерації коду
    const saveBtn = document.getElementById('btnGetCode');
    if(saveBtn) saveBtn.addEventListener('click', generateCode);

    // Первинне оновлення інтерфейсу
    updateUI();
});

// --- UI UPDATE ENGINE ---
function updateUI() {
    const allBoxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    // 1. Рахуємо відсотки
    const total = allBoxes.length;
    const checked = checkedBoxes.length;
    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    // 2. Рухаємо Ракету
    const rocketBar = document.getElementById('rocketBar');
    const progressText = document.getElementById('progressText');
    
    if (rocketBar) rocketBar.style.width = `${percent}%`;
    if (progressText) progressText.innerText = `${percent}%`;

    // 3. Перевіряємо кожен модуль на завершення (100% Done)
    document.querySelectorAll('.module-block').forEach(module => {
        const boxesInModule = module.querySelectorAll('input[type="checkbox"]');
        const checkedInModule = module.querySelectorAll('input[type="checkbox"]:checked');
        const statusIcon = module.querySelector('.m-status i');
        
        // Якщо в модулі є пункти і вони ВСІ відмічені
        if (boxesInModule.length > 0 && boxesInModule.length === checkedInModule.length) {
            module.classList.add('completed');
            if(statusIcon) statusIcon.className = 'fa-solid fa-circle-check'; 
        } else {
            module.classList.remove('completed');
            if(statusIcon) statusIcon.className = 'fa-regular fa-circle';
        }
    });
}

// Ефект "прискорення" ракети при кліку
function triggerRocketEffect() {
    const rocketBar = document.getElementById('rocketBar');
    if (rocketBar) {
        rocketBar.classList.add('moving');
        setTimeout(() => rocketBar.classList.remove('moving'), 600);
    }
}

// --- DATA MANAGEMENT ---

function applyProgress(data) {
    if (!data) return;
    for (const [id, isChecked] of Object.entries(data)) {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.checked = isChecked;
        }
    }
}

function saveLocalChanges() {
    const state = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(box => {
        if (box.checked) {
            state[box.id] = true;
        }
    });
    localStorage.setItem('nextmile_empire_v2', JSON.stringify(state));
}

function loadLocalChanges() {
    const saved = localStorage.getItem('nextmile_empire_v2');
    if (saved) {
        try {
            const state = JSON.parse(saved);
            for (const [id, isChecked] of Object.entries(state)) {
                const checkbox = document.getElementById(id);
                // Ми не стираємо галочки з CURRENT_PROGRESS, а лише додаємо нові
                if (checkbox && isChecked) {
                    checkbox.checked = true;
                }
            }
        } catch (e) {
            console.error("Помилка читання localStorage", e);
        }
    }
}

// --- CODE GENERATOR ---

function generateCode() {
    const state = {};
    document.querySelectorAll('input[type="checkbox"]').forEach(box => {
        if (box.checked) {
            state[box.id] = true;
        }
    });

    const jsonString = JSON.stringify(state, null, 4);
    const codeToCopy = `const CURRENT_PROGRESS = ${jsonString};`;

    navigator.clipboard.writeText(codeToCopy).then(() => {
        const btn = document.getElementById('btnGetCode');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-check"></i> КОД СКОПІЙОВАНО!';
        btn.style.background = '#e50914';
        btn.style.color = '#fff';
        btn.style.borderColor = '#e50914';
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        }, 2000);
        
        alert("✅ Код успішно скопійовано!\n\n1. Відкрий файл roadmap.js\n2. Заміни верхній блок 'const CURRENT_PROGRESS = ...' на те, що в буфері обміну.\n3. Залий на GitHub.");
    }).catch(err => {
        console.error('Copy failed:', err);
        alert('Не вдалося скопіювати автоматично. Відкрий консоль (F12).');
    });
}
