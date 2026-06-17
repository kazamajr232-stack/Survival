/**
 * Audio Controller - Soundboard untuk game
 * Fitur: Sound krisis otomatis berhenti setelah ditangani
 */

const AudioController = {
    sounds: {},
    currentCrisisSound: null,
    isMuted: false,
    bgmStarted: false,

    init() {
        this.sounds = {
            krisis: document.getElementById('sound-krisis'),
            select: document.getElementById('sound-select'),
            success: document.getElementById('sound-success'),
            bgm: document.getElementById('sound-bgm')
        };

        // Setup volume
        if (this.sounds.krisis) this.sounds.krisis.volume = 0.6;
        if (this.sounds.select) this.sounds.select.volume = 0.4;
        if (this.sounds.success) this.sounds.success.volume = 0.5;
        if (this.sounds.bgm) {
            this.sounds.bgm.volume = 0.3;
            this.sounds.bgm.loop = true;
        }

        console.log('🎵 Audio Controller initialized');
    },

    // Play sound efek (one-shot)
    play(soundName) {
        if (this.isMuted) return;
        
        const sound = this.sounds[soundName];
        if (!sound) {
            console.warn(`Sound "${soundName}" not found`);
            return;
        }

        // Reset dan play
        sound.currentTime = 0;
        
        const playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                console.log(`Audio play prevented: ${err.message}`);
            });
        }
    },

    // Start background music
    startBGM() {
        if (this.isMuted || this.bgmStarted) return;
        
        const bgm = this.sounds.bgm;
        if (bgm) {
            bgm.currentTime = 0;
            const playPromise = bgm.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.bgmStarted = true;
                    console.log('🎵 BGM started');
                }).catch(err => {
                    console.log('BGM autoplay prevented, will retry on interaction');
                });
            }
        }
    },

    // Stop background music
    stopBGM() {
        const bgm = this.sounds.bgm;
        if (bgm) {
            bgm.pause();
            bgm.currentTime = 0;
            this.bgmStarted = false;
        }
    },

    // Play crisis sound (looping) - OTOMATIS BERHENTI SETELAH DITANGANI
    playCrisis() {
        if (this.isMuted) return;
        
        // Stop crisis sound yang sedang berjalan dulu
        this.stopCrisis();
        
        const crisis = this.sounds.krisis;
        if (crisis) {
            crisis.currentTime = 0;
            this.currentCrisisSound = crisis;
            
            const playPromise = crisis.play();
            if (playPromise !== undefined) {
                playPromise.catch(err => {
                    console.log('Crisis sound autoplay prevented');
                });
            }
            console.log('🚨 Crisis sound started (will auto-stop when handled)');
        }
    },

    // Stop crisis sound - DIPANGGIL OTOMATIS SETELAH KRISIS DITANGANI
    stopCrisis() {
        const crisis = this.sounds.krisis;
        if (crisis) {
            crisis.pause();
            crisis.currentTime = 0;
            this.currentCrisisSound = null;
            console.log('✅ Crisis sound stopped');
        }
    },

    // Play success sound (saat krisis berhasil ditangani)
    playSuccess() {
        this.play('success');
    },

    // Play select sound
    playSelect() {
        this.play('select');
    },

    // Toggle mute/unmute
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        Object.values(this.sounds).forEach(sound => {
            sound.muted = this.isMuted;
        });
        
        return this.isMuted;
    },

    // Mute semua audio
    muteAll() {
        this.isMuted = true;
        Object.values(this.sounds).forEach(sound => {
            sound.muted = true;
            sound.pause();
        });
    },

    // Unmute dan resume
    unmuteAll() {
        this.isMuted = false;
        Object.values(this.sounds).forEach(sound => {
            sound.muted = false;
        });
        if (this.bgmStarted) {
            this.startBGM();
        }
    }
};

// Inisialisasi saat DOM ready
document.addEventListener('DOMContentLoaded', () => {
    AudioController.init();
});