const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// تشغيل الملفات الثابتة (CSS, Images)
app.use(express.static(__dirname));

// الوظيفة الرئيسية: إرسال ملف index.html للمتصفح
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
