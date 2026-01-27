app.post('/api/login', async (req, res) => {
    const { wallet, ref } = req.body;
    
    // 1. كشف الـ IP الحقيقي حتى خلف البروكسي
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 2. فحص بسيط: إذا كان هناك تلاعب في الـ Headers (غالباً بروكسي)
    if (req.headers['via'] || req.headers['proxy-connection']) {
        return res.json({ isBanned: true, reason: "Proxy detected" });
    }

    const userRef = db.ref('users/' + wallet);
    const snap = await userRef.once('value');
    let user = snap.val();

    if (!user) {
        user = { wallet, ip, referrals: 0, isBanned: false };
        
        if (ref && ref !== wallet) {
            const rRef = db.ref('users/' + ref);
            const rSnap = await rRef.once('value');
            
            // منع الإحالة إذا كان الـ IP مكرراً في قاعدة البيانات
            if (rSnap.exists() && rSnap.val().ip !== ip) {
                await rRef.update({ referrals: rSnap.val().referrals + 1 });
            } else {
                console.log("محاولة إحالة وهمية تم إحباطها للـ IP: " + ip);
            }
        }
        await userRef.set(user);
    }
    res.json(user);
});
