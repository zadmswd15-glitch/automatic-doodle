// روبوت رورو - نسخة التحكم اليدوي الكامل عبر تيليجرام (V7)
// في هذه النسخة، لا يوجد ذكاء اصطناعي؛ أنت (زيد) من يرد على قمر من تيليجرام!

document.addEventListener('DOMContentLoaded', () => {
    // إنشاء واجهة الروبوت
    const aiWidget = document.createElement('div');
    aiWidget.id = 'roro-robot-widget';
    aiWidget.classList.add('hidden'); 
    
    const header = document.createElement('div');
    header.id = 'roro-robot-header';
    header.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>🤖 رورو الذكية (بانتظار ردودك)</span>
            <span id="close-robot" style="cursor:pointer; font-size: 1.2rem;">✖</span>
        </div>
    `;
    
    const chatArea = document.createElement('div');
    chatArea.id = 'roro-robot-chat';
    
    const inputArea = document.createElement('div');
    inputArea.id = 'roro-robot-input-area';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'اكتبي شيئاً لرورو...';
    
    const btn = document.createElement('button');
    btn.innerHTML = 'إرسال';
    
    inputArea.appendChild(input);
    inputArea.appendChild(btn);
    
    aiWidget.appendChild(header);
    aiWidget.appendChild(chatArea);
    aiWidget.appendChild(inputArea);
    
    document.body.appendChild(aiWidget);

    // إعدادات تيليجرام (البوت الثاني المخصص لرورو)
    const TELEGRAM_TOKEN = "8525028196:AAG8uBw0da3v5kBXsBi1x01K-PJwCG3zdyI";
    const TELEGRAM_CHAT_ID = "5251583036";
    let lastUpdateId = 0;

    addMessage("أهلاً بكِ يا قمر! أنا رورو، صديقتكِ المخلصة. اسأليني أي شيء وسأرد عليكِ فوراً! ✨", 'robot');

    document.getElementById('close-robot').addEventListener('click', () => {
        aiWidget.classList.add('hidden');
    });

    // إرسال رسالة قمر لتيليجرام زيد
    async function sendToZaid(text) {
        const msg = encodeURIComponent(`💬 رسالة جديدة من قمر للروبوت:\n"${text}"\n\n(رد عليها الآن في البوت ليظهر الرد عندها!)`);
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${msg}`;
        try {
            fetch(url);
        } catch (e) { console.error("Error sending to Zaid", e); }
    }

    // استلام رد زيد من تيليجرام وعرضه في الموقع
    async function checkZaidResponse() {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.ok && data.result.length > 0) {
                const lastMsg = data.result[data.result.length - 1];
                lastUpdateId = lastMsg.update_id;

                if (lastMsg.message && lastMsg.message.text) {
                    // حذف رسالة "رورو تفكر" إذا كانت موجودة
                    const thinking = document.getElementById('thinking-placeholder');
                    if (thinking) thinking.remove();

                    addMessage(lastMsg.message.text, 'robot');
                }
            }
        } catch (e) { console.error("Error checking Zaid response", e); }
    }

    async function sendMessage() {
        const text = input.value.trim();
        if(!text) return;
        
        addMessage(text, 'user');
        input.value = '';
        
        // إرسال لزيد
        sendToZaid(text);
        
        // إظهار حالة "تنتظر الرد"
        addMessage("رورو تفكر... ✨", 'robot', 'thinking-placeholder');
    }

    btn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if(e.key === 'Enter') sendMessage();
    });

    function addMessage(text, sender, id = null) {
        const msg = document.createElement('div');
        msg.classList.add('chat-msg', sender);
        msg.innerText = text; 
        if (id) msg.id = id;
        chatArea.appendChild(msg);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    // ربط الضغط على الهدية لفتح الروبوت
    const bigGift = document.getElementById('big-gift');
    if(bigGift) {
        bigGift.addEventListener('click', () => {
            aiWidget.classList.remove('hidden');
        });
    }

    // فحص الردود كل 3 ثوانٍ لسرعة التفاعل
    setInterval(checkZaidResponse, 3000);
});
