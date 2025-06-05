const state = {
    energy: 0,
    electron: 0,
    atom: 0,
    cell: 0,
    planet: 0,
    galaxy: 0
};

function loadState() {
    const saved = localStorage.getItem('energyGame');
    if (saved) {
        Object.assign(state, JSON.parse(saved));
    }
}

function saveState() {
    localStorage.setItem('energyGame', JSON.stringify(state));
}

loadState();
setInterval(saveState, 5000);

const energyBtn = document.getElementById('energy-button');
energyBtn.addEventListener('click', () => {
    state.energy += 1;
    playClick();
});

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playClick() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    gain.gain.value = 0.1;
    osc.frequency.value = 300;
    osc.type = 'square';
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
}

function playUpgrade() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    gain.gain.value = 0.15;
    osc.frequency.value = 600;
    osc.type = 'sine';
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

function flashTier(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('flash');
    setTimeout(() => el.classList.remove('flash'), 400);
}

function updateDOM() {
    document.getElementById('energy-count').textContent = Math.floor(state.energy);
    document.getElementById('electron-count').textContent = Math.floor(state.electron);
    document.getElementById('atom-count').textContent = Math.floor(state.atom);
    document.getElementById('cell-count').textContent = Math.floor(state.cell);
    document.getElementById('planet-count').textContent = Math.floor(state.planet);
    document.getElementById('galaxy-count').textContent = Math.floor(state.galaxy);

    document.getElementById('energy-progress').style.width = (state.energy % 10) * 10 + '%';
    document.getElementById('electron-progress').style.width = (state.electron % 10) * 10 + '%';
    document.getElementById('atom-progress').style.width = (state.atom % 10) * 10 + '%';
    document.getElementById('cell-progress').style.width = (state.cell % 10) * 10 + '%';
    document.getElementById('planet-progress').style.width = (state.planet % 10) * 10 + '%';
}

function convert(base, next, tierId) {
    let upgraded = false;
    while (state[base] >= 10) {
        state[base] -= 10;
        state[next] += 1;
        upgraded = true;
    }
    if (upgraded) {
        playUpgrade();
        flashTier(tierId);
    }
}

let last = performance.now();
function loop(now) {
    const dt = (now - last) / 1000;
    last = now;

    // passive generation
    state.energy += state.electron * dt;
    state.electron += state.atom * dt;
    state.atom += state.cell * dt;
    state.cell += state.planet * dt;
    state.planet += state.galaxy * dt;

    convert('energy', 'electron', 'electron-tier');
    convert('electron', 'atom', 'atom-tier');
    convert('atom', 'cell', 'cell-tier');
    convert('cell', 'planet', 'planet-tier');
    convert('planet', 'galaxy', 'galaxy-tier');

    updateDOM();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
