// Глобальные переменные из data.js доступны: weaponsData, abilitiesData, aspectsData

// Элементы DOM
const playersInput = document.getElementById('players');
const weaponListDiv = document.getElementById('weapon-list');
const abilityListDiv = document.getElementById('ability-list');
const aspectListDiv = document.getElementById('aspect-list');
const generateBtn = document.getElementById('generateBtn');
const errorDiv = document.getElementById('errorMessage');
const cardsContainer = document.getElementById('cardsContainer');

// Массивы чекбоксов
let weaponCheckboxes = [];
let abilityCheckboxes = [];
let aspectCheckboxes = [];

// ---------- ИНИЦИАЛИЗАЦИЯ ЧЕКБОКСОВ ----------
function initCheckboxes() {
    // Оружие
    weaponsData.forEach(w => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        const id = `weapon_${w.name.replace(/\s/g, '_')}`;
        div.innerHTML = `
            <input type="checkbox" id="${id}" value="${w.name}" checked>
            <label for="${id}">${w.name}</label>
        `;
        weaponListDiv.appendChild(div);
    });
    weaponCheckboxes = Array.from(document.querySelectorAll('#weapon-list input[type="checkbox"]'));

    // Способности
    abilitiesData.forEach(ability => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        const id = `ability_${ability.replace(/\s/g, '_')}`;
        div.innerHTML = `
            <input type="checkbox" id="${id}" value="${ability}" checked>
            <label for="${id}">${ability}</label>
        `;
        abilityListDiv.appendChild(div);
    });
    abilityCheckboxes = Array.from(document.querySelectorAll('#ability-list input[type="checkbox"]'));

    // Аспекты
    aspectsData.forEach(aspect => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        const id = `aspect_${aspect}`;
        div.innerHTML = `
            <input type="checkbox" id="${id}" value="${aspect}" checked>
            <label for="${id}">${aspect}</label>
        `;
        aspectListDiv.appendChild(div);
    });
    aspectCheckboxes = Array.from(document.querySelectorAll('#aspect-list input[type="checkbox"]'));
}

// ---------- ВЫБРАТЬ ВСЁ ----------
function handleSelectAll(category) {
    let checkboxes;
    if (category === 'weapon') checkboxes = weaponCheckboxes;
    else if (category === 'ability') checkboxes = abilityCheckboxes;
    else if (category === 'aspect') checkboxes = aspectCheckboxes;
    else return;

    const allChecked = checkboxes.every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = !allChecked);
}

// Привязываем обработчики к кнопкам "Выбрать всё"
document.querySelectorAll('.select-all-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        handleSelectAll(category);
    });
});

// ---------- ПОЛУЧИТЬ ВЫБРАННЫЕ ЭЛЕМЕНТЫ ----------
function getSelectedWeapons() {
    return weaponCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
}

function getSelectedAbilities() {
    return abilityCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
}

function getSelectedAspects() {
    return aspectCheckboxes.filter(cb => cb.checked).map(cb => cb.value);
}

// ---------- ПРОВЕРКА ----------
function validateSelections() {
    const weapons = getSelectedWeapons();
    const abilities = getSelectedAbilities();
    const aspects = getSelectedAspects();

    if (weapons.length === 0) return "❌ Выберите хотя бы одно оружие.";
    if (abilities.length === 0) return "❌ Выберите хотя бы одну способность.";
    if (aspects.length < 3) return "❌ Для генерации нужно минимум 3 аспекта (чтобы они не повторялись у игрока).";
    return null;
}

// ---------- ПЕРЕМЕШИВАНИЕ ----------
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ---------- ГЕНЕРАЦИЯ ОДНОГО ИГРОКА ----------
function generatePlayer(selectedWeaponNames, selectedAbilityNames, selectedAspects) {
    const randomWeaponName = selectedWeaponNames[Math.floor(Math.random() * selectedWeaponNames.length)];
    const weapon = weaponsData.find(w => w.name === randomWeaponName);

    const primaryFire = weapon.primary[Math.floor(Math.random() * weapon.primary.length)];
    const secondaryFire = weapon.secondary[Math.floor(Math.random() * weapon.secondary.length)];

    const ability = selectedAbilityNames[Math.floor(Math.random() * selectedAbilityNames.length)];

    const shuffledAspects = shuffleArray(selectedAspects);
    const [aspect1, aspect2, aspect3] = shuffledAspects.slice(0, 3);

    return {
        weapon: randomWeaponName,
        primaryFire,
        secondaryFire,
        ability,
        aspects: {
            primary: aspect1,
            secondary: aspect2,
            ability: aspect3
        }
    };
}

// ---------- ОТРИСОВКА ----------
function renderCards(playersArray) {
    cardsContainer.innerHTML = '';
    playersArray.forEach((player, index) => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div class="player-header">
                <span>${index + 1}</span> Игрок ${index + 1}
            </div>
            <div class="slot">
                <div class="slot-title">🔫 Оружие</div>
                <div class="slot-main">${player.weapon}</div>
                <div class="aspects-row">
                    <span class="aspect-badge">⚡ осн.: ${player.primaryFire}</span>
                    <span class="aspect-badge">🌀 аспект: ${player.aspects.primary}</span>
                </div>
                <div class="aspects-row" style="margin-top: 4px;">
                    <span class="aspect-badge">🔁 втop.: ${player.secondaryFire}</span>
                    <span class="aspect-badge">🌀 аспект: ${player.aspects.secondary}</span>
                </div>
            </div>
            <div class="slot">
                <div class="slot-title">✨ Способность</div>
                <div class="slot-main">${player.ability}</div>
                <div class="aspects-row">
                    <span class="aspect-badge">🌀 аспект: ${player.aspects.ability}</span>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}

// ---------- ОСНОВНАЯ ФУНКЦИЯ ГЕНЕРАЦИИ ----------
function generate() {
    const error = validateSelections();
    if (error) {
        errorDiv.textContent = error;
        cardsContainer.innerHTML = '';
        return;
    }
    errorDiv.textContent = '';

    const selectedWeaponNames = getSelectedWeapons();
    const selectedAbilityNames = getSelectedAbilities();
    const selectedAspects = getSelectedAspects();

    const playerCount = parseInt(playersInput.value, 10) || 1;

    const players = [];
    for (let i = 0; i < playerCount; i++) {
        players.push(generatePlayer(selectedWeaponNames, selectedAbilityNames, selectedAspects));
    }

    renderCards(players);
}

// ---------- ЗАПУСК ----------
generateBtn.addEventListener('click', generate);

initCheckboxes();
// Генерируем при загрузке (если чекбоксы все включены)
window.addEventListener('load', generate);