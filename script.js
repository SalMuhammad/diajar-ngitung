$(document).ready(function() {
    $('#openSidebar').click(function() {
        const ikon = $(this).find('i');
        const sidebar = $('#sidebar');
        ikon.toggleClass('bi-list bi-x-lg');
        sidebar.toggleClass('translate-x-full');
    });
    buatSoal();
});

$('select').on('change', function() {
    const ikon = $('#openSidebar').find('i');
    const sidebar = $('#sidebar');
    ikon.toggleClass('bi-list bi-x-lg');
    sidebar.toggleClass('translate-x-full');
});

// Konstanta dan cache elemen DOM untuk performa
let MAKSIMAL_ANGKA = 1000; // Default value
const $soal = $('.soal');
const $jawaban = $('#jawaban');
const $statusBenar = $('#status-jawaban-benar');
const $statusSalah = $('#status-jawaban-salah');
const $tombolCek = $('#cek');

// Load saved MAKSIMAL_ANGKA from localStorage
if (localStorage.getItem('maxNumber')) {
    MAKSIMAL_ANGKA = parseInt(localStorage.getItem('maxNumber'));
    $('#max-number').val(localStorage.getItem('maxNumberOption'));
}

// Update MAKSIMAL_ANGKA based on select value
$('#max-number').change(function() {
    const nilaiTerpilih = $(this).val();
    switch(nilaiTerpilih) {
        case 'satuan':
            MAKSIMAL_ANGKA = 10;
            break;
        case 'puluhan':
            MAKSIMAL_ANGKA = 100;
            break;
        case 'ratusaan':
            MAKSIMAL_ANGKA = 1000;
            break;
        case 'ribuan':
            MAKSIMAL_ANGKA = 1000000;
            break;
    }
    // Save to localStorage
    localStorage.setItem('maxNumber', MAKSIMAL_ANGKA);
    localStorage.setItem('maxNumberOption', $(this).val());
    buatSoal();
});

// State aplikasi
const state = {
    angka1: 0,
    angka2: 0,
    jawabanBenar: false,
    operasi: 'acak' // Default value
};

// Load saved operasi from localStorage
if (localStorage.getItem('operasi')) {
    state.operasi = localStorage.getItem('operasi'); 
    $('#operasi').val(state.operasi);
}

// Update operasi based on select value
$('#operasi').change(function() {
    state.operasi = $(this).val();
    localStorage.setItem('operasi', state.operasi);
    buatSoal();
});

// Generate angka random 1-MAKSIMAL_ANGKA
const dapatAngkaAcak = () => Math.floor(Math.random() * MAKSIMAL_ANGKA) + 1;

// Fungsi untuk memperbarui tampilan soal
const perbaruiTampilanSoal = () => {
    $soal.text(`${state.angka1} ${state.operasi === 'pengurangan' ? '-' : '+'} ${state.angka2} ?`);
};

// Reset status jawaban
const aturUlangStatus = () => {
    $statusBenar.addClass('hidden');
    $statusSalah.addClass('hidden');
};

// Tampilkan status jawaban
const tampilkanStatus = (benar) => {
    $statusBenar.toggleClass('hidden', !benar);
    $statusSalah.toggleClass('hidden', benar);
};

// Generate soal baru
const buatSoal = () => {
    state.angka1 = dapatAngkaAcak();
    state.angka2 = dapatAngkaAcak();
    state.jawabanBenar = false; 
    
    perbaruiTampilanSoal();
    $jawaban.val('');
    aturUlangStatus();
};

// Cek jawaban
const periksaJawaban = () => {
    const jawabanPengguna = parseInt($jawaban.val()) || 0;
    let jawabanBenar = state.angka1 + state.angka2;
    if (state.operasi === 'pengurangan') {
        jawabanBenar = state.angka1 - state.angka2;
    }
    
    state.jawabanBenar = (jawabanPengguna === jawabanBenar);
    tampilkanStatus(state.jawabanBenar);
};

$('#buat-soal').click(buatSoal);

// Load saved sistem penilayan from localStorage
if (localStorage.getItem('sistemPenilayan')) {
    const sistemPenilayan = localStorage.getItem('sistemPenilayan');
    $('#sistem-penilayan').val(sistemPenilayan);
    if (sistemPenilayan === 'otomatis') {
        $tombolCek.addClass('hidden');
        $jawaban.on('input', periksaJawaban);
    }
}

// Update sistem penilayan based on select value
$('#sistem-penilayan').change(function() {
    const nilaiTerpilih = $(this).val();
    localStorage.setItem('sistemPenilayan', nilaiTerpilih);
    
    if (nilaiTerpilih === 'otomatis') {
        $tombolCek.addClass('hidden');
        $jawaban.on('input', periksaJawaban);
    } else {
        $tombolCek.removeClass('hidden');
        $jawaban.off('input');
        $tombolCek.on('click', periksaJawaban);
    }
});