const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. الربط بملف الأمان الذي رفعته سابقاً
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // الرابط الخاص بك الذي زودتني به
  databaseURL: "https://tonminer-87923-default-rtdb.firebaseio.com/" 
});

const db = admin.database();
app.use(express.json());

// 2. نظام تسجيل الدخول وكشف الإحالات الحقيقية ومنع الـ VPN
app.post('/api/login', async (req, res) => {
    const { wallet, ref } = req.body;
    
    // استخراج الـ IP الحقيقي للمستخدم لمنع الغش
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // فحص أولي للـ Proxy أو VPN
    const isProxy = req.headers['via'] || req.headers['proxy-connection'] || req.headers['x-real-ip'];

    const userRef = db.ref('users/' + wallet);
    const snap = await userRef.once('value');
    let user = snap.val();

    if (!user) {
        // إذا كان المستخدم جديداً تماماً
        user = { 
            wallet: wallet, 
            ip: ip, 
            referrals: 0, 
            isBanned: isProxy ? true : false, // حظر تلقائي إذا كان بروكسي واضح
            balance: 0.00000000
        };

        // نظام احتساب الإحالة "الحقيقية" فقط
        if (ref && ref !== wallet) {
            const referrerRef = db.ref('users/' + ref);
            const refSnap = await referrerRef.once('value');

            if (refSnap.exists()) {
                const referrerData = refSnap.val();
                
                // شرط الإحالة: IP مختلف + صاحب الإحالة غير محظور
                if (referrerData.ip !== ip && !referrerData.isBanned) {
                    await referrerRef.update({ 
                        referrals: (referrerData.referrals || 0) + 1 
                    });
                }
            }
        }
        await userRef.set(user);
    }

    // إرسال بيانات المستخدم الحقيقية لتحديث العداد في الواجهة
    res.json(user);
});

// 3. عرض صفحة الموقع الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log("Tonminer System is Live and Protected ✅");
});
