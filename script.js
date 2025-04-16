// ============================================
// Inisialisasi Nilai Default dan State Aplikasi
// ============================================

let MAKSIMAL_ANGKA = 1000;

const state = {
    angka1: 0,
    angka2: 0,
    jawabanBenar: false,
    operasi: 'penjumlahan'
};


// ===================
// Document Ready Block
// ===================

$(document).ready(function () {
    // =====================
    // Sidebar Interactions
    // =====================

    $('#openSidebar').click(function () {
        $(this).find('i').toggleClass('bi-list bi-x-lg');
        $('#sidebar').toggleClass('translate-x-full');
    });

    $('select').on('change', function () {
        $('#openSidebar').find('i').toggleClass('bi-list bi-x-lg');
        $('#sidebar').toggleClass('translate-x-full');
    });

    // ===================
    // Load & Init Soal Awal
    // ===================

    loadFromStorage();
    buatSoal();

    // ============================
    // Event Handler: Ubah Setting
    // ============================

    $('#max-number').change(function () {
        const nilaiTerpilih = $(this).val();
        switch (nilaiTerpilih) {
            case 'satuan': MAKSIMAL_ANGKA = 10; break;
            case 'puluhan': MAKSIMAL_ANGKA = 100; break;
            case 'ratusaan': MAKSIMAL_ANGKA = 1000; break;
            case 'ribuan': MAKSIMAL_ANGKA = 1000000; break;
        }
        localStorage.setItem('maxNumber', MAKSIMAL_ANGKA);
        localStorage.setItem('maxNumberOption', $(this).val());
        buatSoal();
    });

    $('#operasi').change(function () {
        state.operasi = $(this).val();
        localStorage.setItem('operasi', state.operasi);
        buatSoal();
    });

    $('#sistem-penilayan').change(function () {
        const nilaiTerpilih = $(this).val();
        localStorage.setItem('sistemPenilayan', nilaiTerpilih);
        updateSistemPenilaian(nilaiTerpilih);
    });

    $('#buat-soal').click(buatSoal);
});


// =============================
// Fungsi Utilitas & Logika Inti
// =============================

function dapatAngkaAcak() {
    return Math.floor(Math.random() * MAKSIMAL_ANGKA) + 1;
}

function perbaruiTampilanSoal() {
    $('.soal').text(`${state.angka1} ${state.operasi === 'pengurangan' ? '-' : '+'} ${state.angka2} ?`);
}

function aturUlangStatus() {
    $('#status-jawaban-benar').addClass('hidden');
    $('#status-jawaban-salah').addClass('hidden');
}

function tampilkanStatus(benar) {
    $('#status-jawaban-benar').toggleClass('hidden', !benar);
    $('#status-jawaban-salah').toggleClass('hidden', benar);
}

function buatSoal() {
    state.angka1 = dapatAngkaAcak();
    state.angka2 = dapatAngkaAcak();
    state.jawabanBenar = false;

    perbaruiTampilanSoal();
    $('#jawaban').val('');
    aturUlangStatus();
    
    // Sembunyikan jawaban benar ketika soal baru dibuat
    $('#container-jawaban-benar').addClass('hidden');
}

function periksaJawaban() {
    const jawabanPengguna = parseInt($('#jawaban').val()) || 0;
    let jawabanBenar = state.angka1 + state.angka2;
    if (state.operasi === 'pengurangan') {
        jawabanBenar = state.angka1 - state.angka2;
    }
    
    // Update nilai jawaban benar di elemen
    $('#jawaban-benar').text(jawabanBenar);
    $('#kisi_kisi').text(`Jawaban Benar: ${jawabanBenar}`); // Updated this line to include the text "Jawaban Benar: "
    console.log(jawabanBenar);
    state.jawabanBenar = (jawabanPengguna === jawabanBenar);
    tampilkanStatus(state.jawabanBenar);
}

function updateSistemPenilaian(nilaiTerpilih) {
    if (nilaiTerpilih === 'otomatis') {
        $('#cek').addClass('hidden');
        $('#jawaban').on('input', periksaJawaban);
    } else {
        $('#cek').removeClass('hidden');
        $('#jawaban').off('input');
        $('#cek').on('click', periksaJawaban);
    }
}


// ==============================
// Fungsi: Muat dari LocalStorage
// ==============================

function loadFromStorage() {
    if (localStorage.getItem('maxNumber')) {
        MAKSIMAL_ANGKA = parseInt(localStorage.getItem('maxNumber'));
        $('#max-number').val(localStorage.getItem('maxNumberOption'));
    }

    if (localStorage.getItem('operasi')) {
        state.operasi = localStorage.getItem('operasi');
        $('#operasi').val(state.operasi);
    }

    if (localStorage.getItem('sistemPenilayan')) {
        const sistemPenilayan = localStorage.getItem('sistemPenilayan');
        $('#sistem-penilayan').val(sistemPenilayan);
        updateSistemPenilaian(sistemPenilayan);
    }
}

// Event listener untuk tombol lihat jawaban
$('#tombol-lihat-kisi_kisi').on('click', function() {
    $('#container-kisi_kisi').toggleClass('hidden');
});