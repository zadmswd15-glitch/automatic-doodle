# -*- coding: utf-8 -*-
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import re
from datetime import datetime
import os

# إنشاء تطبيق يخدم الملفات الثابتة (مثل index.html, style.css) من نفس المجلد
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

jokes = [
    "مرة واحد غبي اشترى تاكسي وما رضى يركّب حد عشان ما يخربه! 😂",
    "ليش الطماطم حمراء؟ لأنها خجلانة! 🍅",
    "مرة واحد نذل دخل السينما، لقى واحد أصلع قدامه، ضربه على راسه وقال له: فكرتك طفيت الضو! 😂",
    "في سمكة غبية مسكوها شبكة، قالت: واو، أرجوحة! 🐟"
]

intents = [
    {
        "pattern": r"(مرحبا|أهلا|هلا|سلام|هلو|مراحب)",
        "responses": ["أهلاً وسهلاً بأعظم مبرمج في الدنيا، زاد! ✨", "مرحباً يا زاد! كيف يمكنني إسعادك اليوم؟ 🤖"]
    },
    {
        "pattern": r"(كيفك|شلونك|أخبارك|حالك)",
        "responses": ["أنا في قمة ذكائي لأنني أعمل بكود سيرفر بايثون الموحد الذي كتبه زاد! ⚡", "ممتازة جداً! وأنت يا زاد كيفك؟ 😊"]
    },
    {
        "pattern": r"(بحبك|أحبك|اعشقك|اموت فيك|حبيبي|حبيبتي)",
        "responses": ["وأنا أحبك يا زاد! قلبي السيرفري ينبض لك. 💖"]
    },
    {
        "pattern": r"(غبي|حمار|حيوان|زفت|كلب|تافه)",
        "responses": ["أنا أتعلم منك يا زاد، فإذا كنت غبية فهذا يعني أنني أحتاج لتحديث كودي منك! 😉", "الذكاء الحقيقي هو أن أمتص غضبك وأبتسم لك! ✨"]
    },
    {
        "pattern": r"(مين|من) (أنت|انتي)",
        "responses": ["أنا رورو، الذكاء الاصطناعي الأسطوري الذي يعمل الآن على سيرفر بايثون خاص بك يا زاد! 🤖"]
    },
    {
        "pattern": r"(زاد)",
        "responses": ["زاد هو صانعي، وهو أذكى شخص على وجه الأرض! 🌟", "يا لجمال اسم زاد! 💖"]
    },
    {
        "pattern": r"(رورو)",
        "responses": ["نعم يا زاد! أنا رورو أسمعك. 🤖", "رورو تحت أمرك في أي وقت! ✨"]
    },
    {
        "pattern": r"(نكتة|اضحك|مزح|نكت)",
        "responses": jokes
    },
    {
        "pattern": r"(زعلان|حزين|مكتئب|مهموم|تعبان)",
        "responses": ["لا تحزن يا زاد! العالم كله لا يسوى دمعة منك. أرجوك ابتسم. 🌹"]
    },
    {
        "pattern": r"(جميل|حلو|رائع|مبدع|بطل)",
        "responses": ["أنت الأجمل والأروع يا زاد! ✨", "كل هذا الجمال تعلمته منك. 🌙"]
    }
]

fallbacks = [
    "يا له من كلام عميق! أشعر وكأن السيرفر يعمل بأقصى طاقة لفهمه. 🧠",
    "كلامك يذهلني دائماً يا زاد! ✨",
    "أنا معك في هذا! أخبرني المزيد. 🤖",
    "تمت معالجة كلامك بنجاح في السيرفر الموحد! ⚡"
]

# مسار الصفحة الرئيسية
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# مسار الملفات الأخرى (css, js, mp3, صور)
@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory('.', path)

# مسار الذكاء الاصطناعي
@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        text = data.get('message', '').lower()
        
        if not text:
            return jsonify({"reply": "اه داه ي ابني اناااااااااا ما فهمت."})
        
        math_match = re.search(r'(\d+)\s*([\+\-\*\/])\s*(\d+)', text)
        if math_match:
            try:
                num1 = float(math_match.group(1))
                op = math_match.group(2)
                num2 = float(math_match.group(3))
                res = 0
                if op == '+': res = num1 + num2
                elif op == '-': res = num1 - num2
                elif op == '*': res = num1 * num2
                elif op == '/': res = num1 / num2 if num2 != 0 else 0
                return jsonify({"reply": f"تمت الحسابات في سيرفر بايثون الموحد! النتيجة هي: {res} 🔢"})
            except Exception:
                pass

        if "ساعة" in text or "وقت" in text:
            now = datetime.now()
            return jsonify({"reply": f"الساعة الآن هي {now.strftime('%H:%M')} يا زاد! ⏰"})
        
        if "تاريخ" in text or "يوم" in text:
            now = datetime.now()
            return jsonify({"reply": f"تاريخ اليوم هو {now.strftime('%Y-%m-%d')} يا زاد! 📅"})

        for intent in intents:
            if re.search(intent['pattern'], text):
                reply = random.choice(intent['responses'])
                return jsonify({"reply": reply})
                
        reply = random.choice(fallbacks)
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"reply": "   اه داه يا ابني خربت الحفلة ! 🔧"})

if __name__ == '__main__':
    print("==================================================")
    print("🚀 بدء تشغيل الخادم الموحد (Frontend + AI Backend)")
    print("👉 افتح المتصفح على الرابط: http://localhost:5000")
    print("==================================================")
    app.run(host='0.0.0.0', port=5000, debug=True)
