document.addEventListener('DOMContentLoaded', () => {
    // عناصر شاشة تسجيل الدخول
    const loginScreen = document.getElementById('login-screen');
    const loginBtn = document.getElementById('login-btn');
    const loginError = document.getElementById('login-error');
    const usernameInput = document.getElementById('gmail');
    const passwordInput = document.getElementById('password');

    // عناصر شاشة البداية
    const startBtn = document.getElementById('start-btn');
    const startScreen = document.getElementById('start-screen');
    const mainContainer = document.getElementById('main-container');
    const bgMusic = document.getElementById('bg-music');
    const magicBtn = document.getElementById('magic-btn');
    const bigHeart = document.getElementById('big-heart');

    // منطق تسجيل الدخول (الصفحة 0)
    loginBtn.addEventListener('click', () => {
        const user = usernameInput.value.trim().toLowerCase();
        const pass = passwordInput.value.trim();
        
        // التحقق من البريد وكلمة المرور
        if (user === 'sayedzad3@gmail.com' && pass === 'zadzadzad99a') {
            loginScreen.classList.add('hidden');
            setTimeout(() => {
                loginScreen.style.display = 'none';
                startScreen.style.display = 'flex'; // إظهار الكيكة
            }, 500);
        } else {
            loginError.classList.remove('hidden');
        }
    });

    // تفعيل التسجيل بزر الانتر
    passwordInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') loginBtn.click();
    });
    usernameInput.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') loginBtn.click();
    });

    // البداية (الصفحة 1 - الكيكة)
    startBtn.addEventListener('click', () => {
        bgMusic.volume = 0.5;
        bgMusic.play().catch(e => console.log("Audio error:", e));

        // تأثير الشاشة البيضاء
        startScreen.classList.add('white-flash');
        startBtn.style.display = 'none';

        setTimeout(() => {
            startScreen.classList.add('hidden');
            mainContainer.classList.remove('hidden');
            
            // إظهار المحتوى بتأثير
            setTimeout(() => {
                startScreen.style.display = 'none';
                mainContainer.classList.add('visible');
                setInterval(createHeart, 400);
                createHeartBurst();
            }, 1000);
        }, 2000);
    });

    // زر السحر
    magicBtn.addEventListener('click', () => {
        createHeartBurst();
        magicBtn.style.transform = 'scale(0.9)';
        setTimeout(() => magicBtn.style.transform = '', 100);
    });

    // زر القلب
    bigHeart.addEventListener('click', () => {
        // فتح صورة القناة
        openLightbox('New folder/cortis.png', true);
    });

    // منطق إرسال الرسالة لزيد (عبر تيليجرام بوت بالخفاء)
    const sendSecretBtn = document.getElementById('send-secret-btn');
    const secretMessageInput = document.getElementById('secret-message');
    const sendStatus = document.getElementById('send-status');

    sendSecretBtn.addEventListener('click', async () => {
        const msg = secretMessageInput.value.trim();
        if (!msg) {
            alert("اكتبي شيئاً أولاً! 😊");
            return;
        }

        const botToken = "8557545501:AAH2vleynlcyPuj4h_LF2HLLd7hGkKZSlXw";
        const chatId = "5251583036";
        
        // تجهيز الرسالة
        const text = encodeURIComponent("💌 رسالة سرية من قمر لزيد:\n\n" + msg);
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}`;

        sendSecretBtn.innerText = "جاري الإرسال...";
        sendSecretBtn.disabled = true;

        try {
            const response = await fetch(url);
            if (response.ok) {
                sendStatus.innerText = "تم إرسال رسالتكِ لزيد بنجاح وبالخفاء! 💖🚀";
                sendStatus.style.color = "#00ffcc";
                secretMessageInput.value = "";
            } else {
                throw new Error("Error sending message");
            }
        } catch (error) {
            console.error("Telegram Error:", error);
            sendStatus.innerText = "عذراً، حدث خطأ أثناء الإرسال. حاولي لاحقاً.";
            sendStatus.style.color = "#ff4d6d";
        } finally {
            sendStatus.classList.remove('hidden');
            sendSecretBtn.innerText = "إرسال لزيد 🚀";
            sendSecretBtn.disabled = false;
        }
    });

    // --- منطق استلام رد زيد من تيليجرام ---
    const replySection = document.getElementById('zaid-reply-section');
    const replyText = document.getElementById('zaid-reply-text');
    let lastUpdateId = 0;

    async function checkZaidReplies() {
        const botToken = "8557545501:AAH2vleynlcyPuj4h_LF2HLLd7hGkKZSlXw";
        const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.ok && data.result.length > 0) {
                // نأخذ آخر رسالة وصلت للبوت
                const lastMessage = data.result[data.result.length - 1];
                lastUpdateId = lastMessage.update_id;

                // إذا كانت الرسالة نصية ومن زيد (بناءً على الـ Chat ID)
                if (lastMessage.message && lastMessage.message.text) {
                    const msgText = lastMessage.message.text;
                    
                    // إظهار الرد في الموقع
                    replySection.classList.remove('hidden');
                    replyText.innerText = msgText;
                    
                    // تأثير بسيط للفت الانتباه
                    replySection.style.animation = 'none';
                    replySection.offsetHeight; 
                    replySection.style.animation = 'float 3s infinite ease-in-out';
                }
            }
        } catch (error) {
            console.error("Error checking replies:", error);
        }
    }

    // فحص الردود كل 5 ثوانٍ
    setInterval(checkZaidReplies, 5000);
});

// دوال فتح وإغلاق الصور الكبيرة (Lightbox)
function openLightbox(imgSrc, isChannel = false) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxLink = document.getElementById('lightbox-link');
    const lightboxMsg = document.getElementById('lightbox-msg');
    
    // وضع مسار الصورة
    lightboxImg.src = imgSrc;
    
    // إذا كان القلب نظهر الرسالة وزر الزيارة
    if(isChannel) {
        lightboxMsg.classList.remove('hidden');
        lightboxLink.classList.remove('hidden');
    } else {
        lightboxMsg.classList.add('hidden');
        lightboxLink.classList.add('hidden');
    }

    lightbox.classList.remove('hidden');
}

function closeLightbox(event) {
    // عدم الإغلاق إذا تم الضغط على رابط اليوتيوب
    if(event && event.target.tagName === 'A') return;
    
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
}

// تأثيرات القلوب والأشكال
function createHeart() {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    
    const colors = ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd700', '#ffaa00', '#ffffff'];
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    const symbols = ['💖', '✨', '🎂', '🎈', '❤️', '💕', '🎉', '🌟'];
    heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];

    heart.style.left = Math.random() * 100 + "vw";
    heart.style.fontSize = (Math.random() * 25 + 20) + "px";
    
    const duration = Math.random() * 4 + 4;
    heart.style.animationDuration = duration + "s";

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

function createHeartBurst() {
    for (let i = 0; i < 40; i++) {
        setTimeout(createHeart, i * 50);
    }
}

// تسجيل Service Worker لتحويل الموقع إلى تطبيق
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      console.log('App ready to be installed as APK/PWA!');
    }).catch(err => {
      console.log('SW registration failed: ', err);
    });
  });
}