const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TON Cloud Mining Pro</title>
    <style>
        :root { --ton-blue: #0088cc; --bg: #0a0d12; --card: #1c2128; --green: #3fb950; --red: #ff3e3e; }
        body { background: var(--bg); color: white; font-family: sans-serif; margin: 0; padding-bottom: 80px; text-align: center; }
        .card { background: var(--card); border-radius: 20px; padding: 20px; border: 1px solid #30363d; margin: 15px; }
        #balance { font-size: 30px; color: var(--green); margin: 10px 0; font-family: monospace; }
        .btn { background: var(--ton-blue); border: none; color: white; padding: 12px; width: 90%; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; }
        .locked { filter: blur(4px); pointer-events: none; }
        .status-msg { color: var(--red); font-size: 14px; margin-top: 5px; font-weight: bold; }
        .nav-bar { position: fixed; bottom: 0; width: 100%; background: #161b22; display: flex; justify-content: space-around; padding: 15px 0; border-top: 1px solid #30363d; }
        #banned-screen { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: black; z-index: 9999; justify-content: center; align-items: center; flex-direction: column; }
    </style>
</head>
<body>

    <div id="banned-screen">
        <h1 style="color: var(--red);">تم حظر حسابك!</h1>
        <p>بسبب اكتشاف إحالات وهمية متكررة.</p>
    </div>

    <div style="background: var(--ton-blue); padding: 10px; font-size: 12px;">نظام التعدين السحابي المطور V2</div>

    <div class="card" id="wallet-section">
        <h3>ربط المحفظة للبدء</h3>
        <input type="text" id="wallet-addr" placeholder="أدخل عنوان محفظة TON" style="width: 80%; padding: 10px; border-radius: 8px; border: 1px solid #333; background: #000; color: #fff;">
        <button class="btn" onclick="connectWallet()">ربط المحفظة الآن</button>
    </div>

    <div id="mining-area" class="locked">
        <div class="card">
            <small>رصيدك الحالي</small>
            <div id="balance">0.00000000</div>
            <button class="btn" style="background: var(--green);" onclick="checkWithdrawal()">سحب مجاني (0.1 TON)</button>
            <div id="withdraw-status" class="status-msg"></div>
        </div>

        <div class="card">
            <h3>نظام الإحالة (Referral)</h3>
            <p style="font-size: 12px; color: #8b949e;">انسخ الرابط وادعُ أصدقاءك (مطلوب 10 إحالات حقيقية للسحب المجاني)</p>
            <input type="text" readonly id="ref-link" value="https://tonminer-3zbx.onrender.com/?ref=user" style="width: 80%; padding: 8px; background: #161b22; color: #58a6ff; border: 1px dashed #58a6ff; text-align: center;">
            <p>عدد الإحالات: <span id="ref-count">0</span></p>
        </div>
    </div>

    <nav class="nav-bar">
        <div>التعدين</div>
        <div onclick="alert('سجل السحب فارغ')">السجلات</div>
    </nav>

    <script>
        let isConnected = false;
        let balance = 0;
        let referrals = 0;
        let fakeRefs = 0;

        // 1. وظيفة ربط المحفظة
        function connectWallet() {
            const addr = document.getElementById('wallet-addr').value;
            if (addr.length > 20) {
                isConnected = true;
                document.getElementById('wallet-section').style.display = 'none';
                document.getElementById('mining-area').classList.remove('locked');
                startMining();
                // تحديث رابط الإحالة بعنوان المحفظة
                document.getElementById('ref-link').value = window.location.href.split('?')[0] + "?ref=" + addr.substring(0, 8);
            } else {
                alert("يرجى إدخال عنوان محفظة صحيح");
            }
        }

        // 2. بدء التعدين بعد الربط فقط
        function startMining() {
            if (!isConnected) return;
            setInterval(() => {
                balance += 0.00000050;
                document.getElementById('balance').innerText = balance.toFixed(8);
            }, 100);
            
            // محاكاة زيادة إحالات (للتجربة)
            setTimeout(() => { referrals = 5; document.getElementById('ref-count').innerText = referrals; }, 5000);
        }

        // 3. شروط السحب والحظر
        function checkWithdrawal() {
            const status = document.getElementById('withdraw-status');
            
            // فحص الإحالات الوهمية (محاكاة)
            if (fakeRefs >= 2) {
                document.getElementById('banned-screen').style.display = 'flex';
                return;
            }

            if (referrals < 10) {
                status.innerText = "خطأ: مطلوب 10 إحالات حقيقية (لديك " + referrals + ")";
                fakeRefs++; // زيادة عداد المحاولات الوهمية عند الضغط المتكرر بدون شروط
                if (fakeRefs >= 2) {
                     setTimeout(() => { document.getElementById('banned-screen').style.display = 'flex'; }, 1000);
                }
            } else if (balance < 0.1) {
                status.innerText = "خطأ: الحد الأدنى للسحب هو 0.1 TON";
            } else {
                alert("تم إرسال طلب السحب بنجاح! سيصلك خلال 24 ساعة.");
            }
        }
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => { console.log("System Running with Security Logic..."); });
