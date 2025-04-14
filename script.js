$(document).ready(function() {
    $('#openSidebar').click(function() {
        const icon = $(this).find('i');
        const sidebar = $('#sidebar');
        
        if(icon.hasClass('bi-list')) {
            icon.removeClass('bi-list').addClass('bi-x-lg');
            sidebar.removeClass('translate-x-full');
        } else {
            icon.removeClass('bi-x-lg').addClass('bi-list');
            sidebar.addClass('translate-x-full');
        }
    });
});

// Konstanta dan cache elemen DOM untuk performa
let MAX_NUMBER = 1000; // Default value
const $soal = $('.soal');
const $jawaban = $('#jawaban');
const $statusBenar = $('#status-jawaban-benar');
const $statusSalah = $('#status-jawaban-salah');
const $cekButton = $('#cek');

// Load saved MAX_NUMBER from localStorage
if (localStorage.getItem('maxNumber')) {
    MAX_NUMBER = parseInt(localStorage.getItem('maxNumber'));
    $('#max-number').val(localStorage.getItem('maxNumberOption'));
}

// Update MAX_NUMBER based on select value
$('#max-number').change(function() {
    const selectedValue = $(this).val();
    switch(selectedValue) {
        case 'satuan':
            MAX_NUMBER = 10;
            break;
        case 'puluhan':
            MAX_NUMBER = 100;
            break;
        case 'ratusaan':
            MAX_NUMBER = 1000;
            break;
        case 'ribuan':
            MAX_NUMBER = 1000000;
            break;
    }
    // Save to localStorage
    localStorage.setItem('maxNumber', MAX_NUMBER);
    localStorage.setItem('maxNumberOption', selectedValue);
    
    // Generate new question with new MAX_NUMBER
    generateQuestion();
});

// State aplikasi
const state = {
    angka1: 0,
    angka2: 0,
    isCorrect: false,
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
    // Save to localStorage
    localStorage.setItem('operasi', state.operasi);
    
    // Generate new question with new operasi
    generateQuestion();
});

// Generate angka random 1-MAX_NUMBER
const getRandomNumber = () => Math.floor(Math.random() * MAX_NUMBER) + 1;

// Fungsi untuk memperbarui tampilan soal
const updateSoalDisplay = () => {
    let soalText = `${state.angka1} + ${state.angka2} ?`;
    if (state.operasi === 'pengurangan') {
        soalText = `${state.angka1} - ${state.angka2} ?`;
    } else if (state.operasi === 'acak') {
        const randomOperator = Math.random() < 0.5 ? '+' : '-';
        soalText = `${state.angka1} ${randomOperator} ${state.angka2} ?`;
    }
    $soal.text(soalText);
};

// Reset status jawaban
const resetStatus = () => {
    $statusBenar.addClass('hidden');
    $statusSalah.addClass('hidden');
};

// Tampilkan status jawaban
const showStatus = (isCorrect) => {
    $statusBenar.toggleClass('hidden', !isCorrect);
    $statusSalah.toggleClass('hidden', isCorrect);
};

// Generate soal baru
const generateQuestion = () => {
    state.angka1 = getRandomNumber();
    state.angka2 = getRandomNumber();
    state.isCorrect = false;
    
    updateSoalDisplay();
    $jawaban.val('');
    resetStatus();
};

// Cek jawaban
const checkAnswer = () => {
    const userAnswer = parseInt($jawaban.val()) || 0;
    let correctAnswer = state.angka1 + state.angka2;
    if (state.operasi === 'pengurangan') {
        correctAnswer = state.angka1 - state.angka2;
    } else if (state.operasi === 'acak') {
        const randomOperator = Math.random() < 0.5 ? '+' : '-';
        if (randomOperator === '-') {
            correctAnswer = state.angka1 - state.angka2;
        }
    }
    
    state.isCorrect = (userAnswer === correctAnswer);
    showStatus(state.isCorrect);
};

// Event handlers 
$(document).ready(generateQuestion);
$('#buat-soal').click(generateQuestion);

// Load saved sistem penilayan from localStorage
if (localStorage.getItem('sistemPenilayan')) {
    const sistemPenilayan = localStorage.getItem('sistemPenilayan');
    $('#sistem-penilayan').val(sistemPenilayan);
    if (sistemPenilayan === 'otomatis') {
        $cekButton.addClass('hidden');
        $jawaban.on('input', checkAnswer);
    }
}

// Update sistem penilayan based on select value
$('#sistem-penilayan').change(function() {
    const selectedValue = $(this).val();
    // Save to localStorage
    localStorage.setItem('sistemPenilayan', selectedValue);
    
    if (selectedValue === 'otomatis') {
        $cekButton.addClass('hidden');
        $jawaban.on('input', checkAnswer);
    } else {
        $cekButton.removeClass('hidden');
        $jawaban.off('input');
    }
});