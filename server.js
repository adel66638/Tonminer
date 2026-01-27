const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

let users = {}; 

app.get('/', (req, res) => {
    res.send('<h1>سيرفر تعدين TON نشط</h1><p>بانتظار ربط الواجهة الأمامية...</p>');
});

app.get('/api/mine', (req, res) => {
    const wallet = req.query.wallet;
    const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!wallet) return res.status(400).json({ error: "عنوان المحفظة مطلوب" });

    // فحص منع الحسابات المتعددة
    const isDuplicate = Object.values(users).find(u => u.ip === userIP && u.wallet !== wallet);
    if (isDuplicate) return res.status(403).json({ error: "لا يمكن فتح حسابين من نفس الجهاز" });

    if (!users[wallet]) {
        users[wallet] = { wallet, ip: userIP, start: Date.now() };
    }

    const hours = (Date.now() - users[wallet].start) / (1000 * 60 * 60);
    const balance = (hours * (0.1 / 24)).toFixed(6);

    res.json({ balance: balance, status: "Mining in progress..." });
});

app.listen(port, () => console.log('Server is running'));
