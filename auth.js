// ============================
// LUMINA AUTH — localStorage
// ============================

// Foydalanuvchilarni olish
function getUsers() {
    const users = localStorage.getItem('lumina_users');
    return users ? JSON.parse(users) : [];
}

// Foydalanuvchi saqlash
function saveUsers(users) {
    localStorage.setItem('lumina_users', JSON.stringify(users));
}

// Hozirgi foydalanuvchini olish
function getCurrentUser() {
    const user = localStorage.getItem('lumina_current_user');
    return user ? JSON.parse(user) : null;
}

// Sessiyani saqlash
function setCurrentUser(user) {
    localStorage.setItem('lumina_current_user', JSON.stringify(user));
}

// Chiqish
function logout() {
    localStorage.removeItem('lumina_current_user');
    window.location.href = 'login.html';
}

// ============================
// XABAR KO'RSATISH (alert box)
// ============================
function showMessage(text, type) {
    // Eski xabarni o'chirish
    const old = document.querySelector('.auth-message');
    if (old) old.remove();

    const msg = document.createElement('div');
    msg.className = 'auth-message ' + type;
    msg.innerHTML = '<i class="fa-solid ' + (type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation') + '"></i> ' + text;
    
    const form = document.querySelector('.form-container');
    form.insertBefore(msg, form.firstChild);

    // 4 sekunddan keyin yo'qolsin
    setTimeout(function() {
        msg.style.opacity = '0';
        msg.style.transform = 'translateY(-10px)';
        setTimeout(function() { msg.remove(); }, 400);
    }, 4000);
}

// ============================
// RO'YXATDAN O'TISH
// ============================
function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validatsiya
    if (name.length < 2) {
        showMessage("Ism kamida 2 ta belgi bo'lishi kerak!", 'error');
        return;
    }

    if (!email.includes('@') || !email.includes('.')) {
        showMessage("Email manzil noto'g'ri formatda!", 'error');
        return;
    }

    if (password.length < 6) {
        showMessage("Parol kamida 6 ta belgi bo'lishi kerak!", 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Parollar mos kelmaydi!", 'error');
        return;
    }

    // Email mavjudligini tekshirish
    const users = getUsers();
    const exists = users.find(function(u) { return u.email === email; });
    if (exists) {
        showMessage("Bu email allaqachon ro'yxatdan o'tgan!", 'error');
        return;
    }

    // Yangi foydalanuvchi qo'shish
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    showMessage("Muvaffaqiyatli ro'yxatdan o'tdingiz! Kirish sahifasiga yo'naltirilmoqda...", 'success');

    setTimeout(function() {
        window.location.href = 'login.html?registered=1';
    }, 2000);
}

// ============================
// KIRISH (LOGIN)
// ============================
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember');

    if (!email || !password) {
        showMessage("Barcha maydonlarni to'ldiring!", 'error');
        return;
    }

    const users = getUsers();
    const user = users.find(function(u) {
        return u.email === email && u.password === password;
    });

    if (!user) {
        showMessage("Email yoki parol noto'g'ri!", 'error');
        return;
    }

    // Sessiyaga saqlash
    setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email
    });

    // "Eslab qolish" tanlangan bo'lsa
    if (remember && remember.checked) {
        localStorage.setItem('lumina_remember', 'true');
    }

    showMessage("Xush kelibsiz, " + user.name + "! Bosh sahifaga yo'naltirilmoqda...", 'success');

    setTimeout(function() {
        window.location.href = 'luminauz.html';
    }, 1500);
}

// ============================
// SAHIFA YUKLANGANDA
// ============================
document.addEventListener('DOMContentLoaded', function() {
    // Login sahifasida — ro'yxatdan o'tish xabari
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === '1') {
        setTimeout(function() {
            showMessage("Muvaffaqiyatli ro'yxatdan o'tdingiz! Endi kiring.", 'success');
        }, 500);
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});
