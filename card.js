/**
 * Data Kartu & Krisis untuk game Survival Hari Ini
 */

const CARD_DATA = {
    merah: {
        title: "🔴 TUGAS PENTING",
        cards: [
            {
                id: "M1",
                title: "Deadline Proyek",
                story: "Bos meminta laporan proyek selesai hari ini juga!",
                time: 4,
                energy: 40,
                stress: 20,
                productivity: 30,
                requirement: "Energi 40+"
            },
            {
                id: "M2",
                title: "Meeting Penting",
                story: "Rapat dengan klien besar yang menentukan kontrak.",
                time: 2,
                energy: 25,
                stress: 15,
                productivity: 20,
                requirement: "Energi 25+"
            },
            {
                id: "M3",
                title: "Presentasi",
                story: "Presentasi hasil kerja 3 bulan ke direksi.",
                time: 3,
                energy: 35,
                stress: 25,
                productivity: 25,
                requirement: "Energi 35+"
            },
            {
                id: "M4",
                title: "Perbaikan Bug",
                story: "Bug kritis di production harus diperbaiki sekarang!",
                time: 3,
                energy: 30,
                stress: 30,
                productivity: 20,
                requirement: "Energi 30+"
            }
        ]
    },
    biru: {
        title: "🔵 PENGEMBANGAN DIRI",
        cards: [
            {
                id: "B1",
                title: "Belajar Skill Baru",
                story: "Ikuti kursus online untuk meningkatkan kompetensi.",
                time: 2,
                energy: 20,
                stress: 5,
                productivity: 15,
                requirement: "Energi 20+"
            },
            {
                id: "B2",
                title: "Networking",
                story: "Hubungi rekan kerja dan bangun relasi profesional.",
                time: 1,
                energy: 15,
                stress: 10,
                productivity: 10,
                requirement: "Energi 15+"
            },
            {
                id: "B3",
                title: "Baca Buku",
                story: "Luangkan waktu 30 menit untuk membaca buku pengembangan diri.",
                time: 1,
                energy: 10,
                stress: -10,
                productivity: 10,
                requirement: "Energi 10+"
            },
            {
                id: "B4",
                title: "Meditasi",
                story: "Tenangkan pikiran untuk mengurangi stres akumulasi.",
                time: 1,
                energy: 5,
                stress: -20,
                productivity: 5,
                requirement: "Energi 5+"
            }
        ]
    },
    kuning: {
        title: "🟡 KEHIDUPAN SOSIAL",
        cards: [
            {
                id: "K1",
                title: "Makan Siang Bareng",
                story: "Ajak teman kantor makan siang untuk refreshing.",
                time: 1,
                energy: 15,
                stress: -15,
                productivity: 5,
                requirement: "Energi 15+"
            },
            {
                id: "K2",
                title: "Telepon Keluarga",
                story: "Hubungi orang tua atau saudara, tanyakan kabar mereka.",
                time: 1,
                energy: 10,
                stress: -10,
                productivity: 0,
                requirement: "Energi 10+"
            },
            {
                id: "K3",
                title: "Hangout Singkat",
                story: "Ngopi bareng teman di kafe dekat kantor.",
                time: 2,
                energy: 20,
                stress: -20,
                productivity: 0,
                requirement: "Energi 20+"
            },
            {
                id: "K4",
                title: "Bantu Teman",
                story: "Bantu teman yang kesulitan dengan tugasnya.",
                time: 2,
                energy: 20,
                stress: 5,
                productivity: 10,
                requirement: "Energi 20+"
            }
        ]
    },
    hijau: {
        title: "🟢 KESEHATAN & ISTIRAHAT",
        cards: [
            {
                id: "H1",
                title: "Tidur Siang",
                story: "Power nap 20 menit untuk memulihkan energi.",
                time: 1,
                energy: -30,
                stress: -15,
                productivity: 10,
                requirement: "Waktu tersedia"
            },
            {
                id: "H2",
                title: "Olahraga Ringan",
                story: "Jalan kaki atau stretching untuk menjaga kebugaran.",
                time: 1,
                energy: 10,
                stress: -20,
                productivity: 5,
                requirement: "Energi 10+"
            },
            {
                id: "H3",
                title: "Makan Sehat",
                story: "Nutrisi yang cukup untuk menjaga stamina kerja.",
                time: 1,
                energy: -20,
                stress: -10,
                productivity: 10,
                requirement: "Waktu tersedia"
            },
            {
                id: "H4",
                title: "Istirahat Mata",
                story: "Jauhkan pandangan dari layar selama 15 menit.",
                time: 1,
                energy: 5,
                stress: -15,
                productivity: 5,
                requirement: "Energi bebas"
            }
        ]
    },
    hitam: {
        title: "⚫ GANGUAN / DISTRAKSI",
        cards: [
            {
                id: "X1",
                title: "Scroll Media Sosial",
                story: "Cek Instagram/TikTok 'sebentar'... yang berjam-jam.",
                time: 2,
                energy: 10,
                stress: 10,
                productivity: -10,
                requirement: "Hati-hati!"
            },
            {
                id: "X2",
                title: "Maraton Netflix",
                story: "Nonton 1 episode yang berlanjut ke 5 episode.",
                time: 3,
                energy: 20,
                stress: 5,
                productivity: -20,
                requirement: "Waktu terbuang!"
            },
            {
                id: "X3",
                title: "Overthinking",
                story: "Mikirin masa depan yang belum terjadi sampai pusing.",
                time: 1,
                energy: 15,
                stress: 25,
                productivity: -5,
                requirement: "Jangan!"
            },
            {
                id: "X4",
                title: "Prokrastinasi",
                story: "Kerjakan nanti, padahal deadline mepet.",
                time: 2,
                energy: 5,
                stress: 20,
                productivity: -15,
                requirement: "Bahaya!"
            }
        ]
    }
};

const CRISIS_DATA = [
    {
        id: "C1",
        story: "🚨 KRISIS: Bos tiba-tiba meminta revisi besar pada proyek yang sudah hampir selesai!",
        options: [
            { text: "Terima & Kerjakan Lembur", energy: 50, stress: 40, productivity: 20, time: 3 },
            { text: "Negosiasi Deadline", energy: 20, stress: 25, productivity: 10, time: 1 },
            { text: "Tolak Sopan", energy: 10, stress: 30, productivity: -10, time: 0 }
        ]
    },
    {
        id: "C2",
        story: "🚨 KRISIS: Komputer/laptop tiba-tiba mati dan file belum tersimpan!",
        options: [
            { text: "Panic & Restart Ulang", energy: 30, stress: 35, productivity: -15, time: 2 },
            { text: "Tenang & Cari Backup", energy: 15, stress: 20, productivity: 5, time: 1 },
            { text: "Pakai Alternatif Lain", energy: 20, stress: 15, productivity: 10, time: 1 }
        ]
    },
    {
        id: "C3",
        story: "🚨 KRISIS: Teman dekat di kantor mengalami breakdown emosional!",
        options: [
            { text: "Bantu & Dampingi", energy: 25, stress: 15, productivity: 5, time: 2 },
            { text: "Panggil HR", energy: 10, stress: 10, productivity: 0, time: 1 },
            { text: "Abaikan & Fokus Kerja", energy: 5, stress: 25, productivity: 10, time: 0 }
        ]
    },
    {
        id: "C4",
        story: "🚨 KRISIS: Klien marah-marah di telepon karena kesalahan teknis!",
        options: [
            { text: "Tangani Sendiri", energy: 40, stress: 35, productivity: 15, time: 2 },
            { text: "Alihkan ke Atasan", energy: 15, stress: 20, productivity: 5, time: 1 },
            { text: "Biarkan Voicemail", energy: 5, stress: 30, productivity: -10, time: 0 }
        ]
    },
    {
        id: "C5",
        story: "🚨 KRISIS: Badan tiba-tiba demam dan pusing saat jam kerja!",
        options: [
            { text: "Minum Obat & Lanjut", energy: 30, stress: 25, productivity: 10, time: 1 },
            { text: "Izin Pulang", energy: 10, stress: 20, productivity: -20, time: 0 },
            { text: "Istirahat di Meja", energy: 20, stress: 15, productivity: 0, time: 2 }
        ]
    }
];

// Export untuk digunakan di game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CARD_DATA, CRISIS_DATA };
}