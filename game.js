/**
 * Game Logic - Survival Hari Ini
 * Fitur utama: Manajemen waktu, energi, stress, produktivitas
 * FIX: Skor akhir tidak ketutupan header/waktu
 */

// ===== STATE GAME =====
let gameState = {
    time: 16,           // 16 jam tersedia
    energy: 100,        // Energi awal
    stress: 0,          // Stress awal
    productivity: 0,    // Produktivitas
    selectedCards: [],   // Kartu yang dipilih
    crisisHandled: false,
    currentCrisis: null,
    gameFinished: false
};

// ===== INITIALIZATION =====
function initGame() {
    gameState = {
        time: 16,
        energy: 100,
        stress: 0,
        productivity: 0,
        selectedCards: [],
        crisisHandled: false,
        currentCrisis: null,
        gameFinished: false
    };
    
    renderCards();
    updateTracker();
    updateSummary();
    
    // Hide panels
    document.getElementById('crisis-panel').classList.remove('active');
    document.getElementById('anim-panel').classList.remove('active');
    document.getElementById('final-score-modal').classList.remove('active');
    
    console.log('🎮 Game initialized');
}

function startGame() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-container').style.display = 'block';
    
    // Start BGM setelah interaksi user
    AudioController.startBGM();
    
    initGame();
    
    // Random crisis setelah 3-5 kartu dipilih
    setTimeout(() => {
        if (!gameState.crisisHandled && gameState.selectedCards.length >= 3) {
            triggerCrisis();
        }
    }, 100);
}

// ===== RENDER CARDS =====
function renderCards() {
    const container = document.getElementById('card-sections');
    container.innerHTML = '';
    
    Object.entries(CARD_DATA).forEach(([category, data]) => {
        const section = document.createElement('div');
        section.className = `section section-${category}`;
        
        const title = document.createElement('div');
        title.className = 'section-title';
        title.textContent = data.title;
        section.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'cards-grid';
        
        data.cards.forEach(card => {
            const cardEl = createCardElement(card, category);
            grid.appendChild(cardEl);
        });
        
        section.appendChild(grid);
        container.appendChild(section);
    });
}

function createCardElement(card, category) {
    const el = document.createElement('div');
    el.className = `card card-${category}`;
    el.dataset.id = card.id;
    el.dataset.time = card.time;
    el.dataset.energy = card.energy;
    el.dataset.stress = card.stress;
    el.dataset.productivity = card.productivity;
    
    const isSelected = gameState.selectedCards.find(c => c.id === card.id);
    const canAfford = gameState.time >= card.time && 
                       (card.energy < 0 || gameState.energy >= card.energy);
    
    if (isSelected) {
        el.classList.add('selected');
    }
    
    if (!canAfford && !isSelected) {
        el.classList.add('disabled');
    }
    
    el.innerHTML = `
        <div class="card-header">
            <span class="card-id">${card.id}</span>
            <span class="card-time">⏱️ ${card.time}j</span>
        </div>
        <h3>${card.title}</h3>
        <div class="card-story">"${card.story}"</div>
        <div class="card-meta">
            <span class="card-requirement">${card.requirement}</span>
            <span>⚡${card.energy > 0 ? '-' : '+'}${Math.abs(card.energy)} | 😰${card.stress > 0 ? '+' : ''}${card.stress} | 📊${card.productivity > 0 ? '+' : ''}${card.productivity}</span>
        </div>
    `;
    
    el.addEventListener('click', () => toggleCard(card, category));
    
    return el;
}

// ===== CARD SELECTION =====
function toggleCard(card, category) {
    if (gameState.gameFinished) return;
    
    const existingIndex = gameState.selectedCards.findIndex(c => c.id === card.id);
    
    if (existingIndex >= 0) {
        // Unselect
        gameState.selectedCards.splice(existingIndex, 1);
        AudioController.playSelect();
    } else {
        // Check if can afford
        if (gameState.time < card.time) {
            showNotification('Waktu tidak cukup!', 'error');
            return;
        }
        if (card.energy > 0 && gameState.energy < card.energy) {
            showNotification('Energi tidak cukup!', 'error');
            return;
        }
        
        // Select
        gameState.selectedCards.push({...card, category});
        AudioController.playSelect();
        
        // Check for crisis trigger
        if (!gameState.crisisHandled && gameState.selectedCards.length >= 3 && Math.random() > 0.5) {
            setTimeout(triggerCrisis, 500);
        }
    }
    
    recalculateState();
    renderCards();
    updateTracker();
    updateSummary();
}

// ===== STATE RECALCULATION =====
function recalculateState() {
    // Reset ke nilai awal
    gameState.time = 16;
    gameState.energy = 100;
    gameState.stress = 0;
    gameState.productivity = 0;
    
    // Terapkan semua kartu yang dipilih
    gameState.selectedCards.forEach(card => {
        gameState.time -= card.time;
        gameState.energy -= card.energy;
        gameState.stress += card.stress;
        gameState.productivity += card.productivity;
    });
    
    // Clamp values
    gameState.time = Math.max(0, gameState.time);
    gameState.energy = Math.max(0, Math.min(100, gameState.energy));
    gameState.stress = Math.max(0, Math.min(100, gameState.stress));
    gameState.productivity = Math.max(0, gameState.productivity);
}

// ===== CRISIS HANDLING =====
function triggerCrisis() {
    if (gameState.crisisHandled || gameState.currentCrisis) return;
    
    const crisis = CRISIS_DATA[Math.floor(Math.random() * CRISIS_DATA.length)];
    gameState.currentCrisis = crisis;
    
    // Play crisis sound
    AudioController.playCrisis();
    
    const panel = document.getElementById('crisis-panel');
    const story = document.getElementById('crisis-story');
    const options = document.getElementById('crisis-options');
    
    story.textContent = crisis.story;
    options.innerHTML = '';
    
    crisis.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'crisis-option';
        btn.innerHTML = `
            <h4>${opt.text}</h4>
            <div class="meta">
                ⚡${opt.energy > 0 ? '-' : '+'}${Math.abs(opt.energy)} | 
                😰${opt.stress > 0 ? '+' : ''}${opt.stress} | 
                📊${opt.productivity > 0 ? '+' : ''}${opt.productivity} | 
                ⏱️${opt.time}j
            </div>
        `;
        btn.addEventListener('click', () => handleCrisisOption(opt));
        options.appendChild(btn);
    });
    
    panel.classList.add('active');
    showNotification('🚨 KRISIS MENDADAK!', 'warning');
}

function handleCrisisOption(option) {
    // Apply crisis effects
    gameState.time -= option.time;
    gameState.energy -= option.energy;
    gameState.stress += option.stress;
    gameState.productivity += option.productivity;
    
    // Clamp values
    gameState.time = Math.max(0, gameState.time);
    gameState.energy = Math.max(0, Math.min(100, gameState.energy));
    gameState.stress = Math.max(0, Math.min(100, gameState.stress));
    
    gameState.crisisHandled = true;
    gameState.currentCrisis = null;
    
    // ===== SOUNDBOARD: STOP CRISIS SOUND & PLAY SUCCESS =====
    AudioController.stopCrisis();
    AudioController.playSuccess();
    
    document.getElementById('crisis-panel').classList.remove('active');
    showNotification('✅ Krisis berhasil ditangani!', 'success');
    
    updateTracker();
    updateSummary();
    renderCards();
}

// ===== UPDATE UI =====
function updateTracker() {
    document.getElementById('time-display').textContent = `${gameState.time}:00`;
    document.getElementById('energy-display').textContent = Math.floor(gameState.energy);
    document.getElementById('stress-display').textContent = Math.floor(gameState.stress);
    document.getElementById('productivity-display').textContent = Math.floor(gameState.productivity);
    
    // Warning states
    document.getElementById('tracker-time').classList.toggle('warning', gameState.time <= 2);
    document.getElementById('tracker-energy').classList.toggle('warning', gameState.energy <= 20);
    document.getElementById('tracker-stress').classList.toggle('warning', gameState.stress >= 70);
    
    // Update summary panel too
    document.getElementById('summary-time').textContent = `${gameState.time}:00`;
    document.getElementById('summary-energy').textContent = Math.floor(gameState.energy);
    document.getElementById('summary-stress').textContent = Math.floor(gameState.stress);
    document.getElementById('summary-productivity').textContent = Math.floor(gameState.productivity);
}

function updateSummary() {
    const container = document.getElementById('selected-cards');
    container.innerHTML = '';
    
    gameState.selectedCards.forEach(card => {
        const tag = document.createElement('span');
        tag.className = 'selected-tag';
        tag.textContent = `${card.id}: ${card.title}`;
        container.appendChild(tag);
    });
    
    // Update status badge
    const badge = document.getElementById('status-badge');
    let status = 'SIAP BERJUANG';
    let statusClass = 'status-thrive';
    
    if (gameState.stress >= 80 || gameState.energy <= 10) {
        status = '⚠️ BURNOUT RISK!';
        statusClass = 'status-burnout';
    } else if (gameState.stress >= 50 || gameState.energy <= 30) {
        status = '😰 HATI-HATI';
        statusClass = 'status-risk';
    } else if (gameState.stress >= 30 || gameState.energy <= 50) {
        status = '😐 BERTAHAN';
        statusClass = 'status-survive';
    }
    
    if (gameState.time <= 0) {
        status = '⏰ WAKTU HABIS';
        statusClass = 'status-risk';
    }
    
    badge.textContent = `STATUS: ${status}`;
    badge.className = `status-badge ${statusClass}`;
    
    // Enable/disable finish button
    document.getElementById('finish-btn').disabled = gameState.selectedCards.length === 0;
}

// ===== FINISH GAME & SCORING =====
function finishGame() {
    if (gameState.selectedCards.length === 0) {
        showNotification('Pilih minimal 1 aktivitas!', 'error');
        return;
    }
    
    gameState.gameFinished = true;
    
    // Stop BGM
    AudioController.stopBGM();
    
    // Show animation panel first
    showScoreAnimation();
}

function showScoreAnimation() {
    const panel = document.getElementById('anim-panel');
    const emoji = document.getElementById('anim-emoji');
    const text = document.getElementById('anim-text');
    const details = document.getElementById('anim-details');
    const btn = document.getElementById('anim-btn');
    
    panel.classList.add('active');
    btn.style.display = 'none';
    
    // Calculate final score
    const score = calculateFinalScore();
    
    // Animation sequence
    let step = 0;
    const steps = [
        { emoji: '🐱', text: 'Menghitung skor...', anim: 'anim-cat-jump', details: '' },
        { emoji: '📊', text: 'Mengevaluasi produktivitas...', anim: '', details: `Produktivitas: ${score.productivity}` },
        { emoji: '⚡', text: 'Menghitung sisa energi...', anim: '', details: `Energi tersisa: ${score.energy}` },
        { emoji: '😰', text: 'Mengukur tingkat stress...', anim: '', details: `Stress akhir: ${score.stress}` },
        { emoji: score.rankEmoji, text: 'Hasil akhir...', anim: '', details: `Skor total: ${score.total}` }
    ];
    
    function nextStep() {
        if (step >= steps.length) {
            // Show button to continue
            btn.style.display = 'inline-block';
            btn.textContent = 'LIHAT HASIL LENGKAP';
            btn.onclick = () => {
                panel.classList.remove('active');
                showFinalScore(score);
            };
            return;
        }
        
        const s = steps[step];
        emoji.textContent = s.emoji;
        text.textContent = s.text;
        details.textContent = s.details;
        
        // Reset animations
        emoji.className = 'anim-emoji ' + s.anim;
        
        step++;
        setTimeout(nextStep, 800);
    }
    
    nextStep();
}

function calculateFinalScore() {
    const { time, energy, stress, productivity, selectedCards } = gameState;
    
    // Base calculations
    let timeBonus = time * 10;
    let energyBonus = energy * 2;
    let stressPenalty = stress * 1.5;
    let prodScore = productivity * 3;
    
    // Card diversity bonus
    const categories = new Set(selectedCards.map(c => c.category));
    let diversityBonus = categories.size * 25;
    
    // Total score
    let total = Math.floor(timeBonus + energyBonus + prodScore + diversityBonus - stressPenalty);
    total = Math.max(0, total);
    
    // Determine rank
    let rank, rankEmoji, message;
    if (total >= 800) {
        rank = 'S'; rankEmoji = '👑'; message = 'Sempurna! Kamu adalah master manajemen waktu!';
    } else if (total >= 650) {
        rank = 'A'; rankEmoji = '🌟'; message = 'Luar biasa! Kamu berhasil melewati hari dengan sangat baik!';
    } else if (total >= 500) {
        rank = 'B'; rankEmoji = '👍'; message = 'Bagus! Kamu cukup berhasil mengelola harimu.';
    } else if (total >= 350) {
        rank = 'C'; rankEmoji = '😐'; message = 'Cukup. Ada ruang untuk perbaikan di lain waktu.';
    } else if (total >= 200) {
        rank = 'D'; rankEmoji = '😰'; message = 'Kurang. Kamu hampir mengalami burnout.';
    } else {
        rank = 'F'; rankEmoji = '💀'; message = 'Burnout total! Kamu perlu istirahat yang serius.';
    }
    
    // Burnout override
    if (stress >= 90 || energy <= 5) {
        rank = 'F'; rankEmoji = '💀'; message = 'BURNOUT! Kamu kolaps karena kelelahan!';
    }
    
    return { total, rank, rankEmoji, message, time, energy, stress, productivity };
}

// ===== FINAL SCORE MODAL (FIXED: TIDAK KETUTUPAN) =====
function showFinalScore(score) {
    const modal = document.getElementById('final-score-modal');
    
    document.getElementById('final-emoji').textContent = score.rankEmoji;
    document.getElementById('final-rank').textContent = `RANK ${score.rank}`;
    document.getElementById('final-score-value').textContent = score.total;
    document.getElementById('final-message').textContent = score.message;
    
    document.getElementById('final-time').textContent = `${score.time}:00`;
    document.getElementById('final-energy').textContent = Math.floor(score.energy);
    document.getElementById('final-stress').textContent = Math.floor(score.stress);
    document.getElementById('final-productivity').textContent = Math.floor(score.productivity);
    
    // Color coding untuk rank
    const rankEl = document.getElementById('final-rank');
    const colors = {
        'S': '#f1c40f', 'A': '#2ecc71', 'B': '#3498db', 
        'C': '#9b59b6', 'D': '#e67e22', 'F': '#e74c3c'
    };
    rankEl.style.color = colors[score.rank] || '#fff';
    
    modal.classList.add('active');
    
    // Play appropriate sound
    if (score.rank === 'S' || score.rank === 'A') {
        AudioController.play('success');
    }
}

function closeAnim() {
    document.getElementById('anim-panel').classList.remove('active');
}

function restartGame() {
    document.getElementById('final-score-modal').classList.remove('active');
    document.getElementById('start-screen').classList.remove('hidden');
    document.getElementById('game-container').style.display = 'none';
    
    // Stop all sounds
    AudioController.stopCrisis();
    AudioController.stopBGM();
    
    initGame();
}

function shareScore() {
    const score = calculateFinalScore();
    const text = `Saya mendapatkan RANK ${score.rank} dengan skor ${score.total} di Survival Hari Ini! 🎮\\n\\n` +
                 `⏰ Waktu: ${score.time}j | ⚡ Energi: ${score.energy} | 😰 Stress: ${score.stress} | 📊 Produktivitas: ${score.productivity}\\n\\n` +
                 `Coba kamu bisa lebih baik?`;
    
    if (navigator.share) {
        navigator.share({ title: 'Survival Hari Ini - Skor Saya', text: text });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Skor disalin ke clipboard!', 'success');
        });
    }
}

// ===== NOTIFICATION =====
function showNotification(message, type = 'info') {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.style.display = 'block';
    
    const colors = {
        error: '#e74c3c',
        success: '#2ecc71',
        warning: '#f39c12',
        info: '#3498db'
    };
    notif.style.background = colors[type] || colors.info;
    
    setTimeout(() => {
        notif.style.display = 'none';
    }, 3000);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const animPanel = document.getElementById('anim-panel');
        const finalModal = document.getElementById('final-score-modal');
        
        if (animPanel.classList.contains('active')) {
            animPanel.classList.remove('active');
        } else if (finalModal.classList.contains('active')) {
            // Don't close final modal with escape, require button click
        }
    }
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    // Pre-load check
    console.log('🎮 Survival Hari Ini - Ready');
});