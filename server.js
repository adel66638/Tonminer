const express = require('express');
const admin = require('firebase-admin');
const app = express();
const PORT = process.env.PORT || 3000;

// استدعاء ملف الأمان الذي رفعته للتو
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // استبدل الرابط أدناه برابط الـ Realtime Database الخاص بك
  databaseURL: "https://tonminer-87923-default-rtdb.firebaseio.com/" 
});

const db = admin.database();
app.use(express.json());

// --- منطق الإحالات والحماية ---
app.post('/api/login', async (req, res) => {
    const { wallet, ref } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const userRef = db.ref('users/' + wallet);
    const snap = await userRef.once('value');
    let user = snap.val();

    if (!user) {
        user = { wallet, ip, referrals: 0, isBanned: false };
        
        // التحقق من الإحالة الحقيقية: محفظة مختلفة + IP مختلف
        if (ref && ref !== wallet) {
            const rRef = db.ref('users/' + ref);
            const rSnap = await rRef.once('value');
            
            // لا تزيد الإحالة إذا كان الـ IP مكرراً (منع الغش الذاتي)
            if (rSnap.exists() && rSnap.val().ip !== ip) {
                await rRef.update({ referrals: rSnap.val().referrals + 1 });
            }
        }
        await userRef.set(user);
    }
    res.json(user);
});

// ... باقي كود الواجهة HTML ...
