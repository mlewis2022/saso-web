// Load voices when available
speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices(); // triggers loading
};

document.addEventListener("DOMContentLoaded", function () {
    const spans = document.querySelectorAll(".nav-header .nav-item span");
    if (spans.length < 4) return;

    const weatherEl = spans[0];
    const dateEl = spans[1];
    const timeEl = spans[2];
    const locationEl = spans[3];

    const now = new Date();
    const isRTL = document.documentElement.dir === "rtl";
    const lang = isRTL ? 'ar' : 'en';

    // Format date & time
    const dateLocale = isRTL ? 'ar-EG' : 'en-GB';
    const timeLocale = isRTL ? 'ar-EG' : undefined;

    dateEl.textContent = now.toLocaleDateString(dateLocale, {
        day: '2-digit', month: 'short', year: 'numeric'
    });

    timeEl.textContent = now.toLocaleTimeString(timeLocale, {
        hour: '2-digit', minute: '2-digit'
    });

    // 🌍 Location (IP) + Weather
    const openWeatherApiKey = 'a70d70b94e75247d36b0ac653a06da41';

    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .then(async data => {
            const lat = data.latitude;
            const lon = data.longitude;
            let cityName = data.city;

            if (isRTL) {
                try {
                    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ar`;
                    const nomRes = await fetch(nominatimUrl);
                    const nomData = await nomRes.json();
                    if (nomData && nomData.address) {
                        const arCity = nomData.address.city || nomData.address.town || nomData.address.village;
                        if (arCity) {
                            cityName = arCity;
                        }
                    }
                } catch (err) {
                    console.warn("Failed to get Arabic city name:", err);
                }
            }

            try {
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`;
                const weatherRes = await fetch(weatherUrl);
                const weatherData = await weatherRes.json();

                locationEl.textContent = cityName;
                weatherEl.textContent = isRTL
                    ? `${Math.round(weatherData.main.temp)} درجة مئوية`
                    : `${Math.round(weatherData.main.temp)}°C`;

            } catch (error) {
                console.error("Error fetching weather:", error);
            }
        })
        .catch(err => {
            console.error("IP location error:", err);
        });

    // 📢 Controls
    let fontSize = 100;
    let fontLevel = 0;
    const minLevel = 0;
    const maxLevel = 4;
    const scaleStep = 0.1;
    let isReadingActive = false;

    const voiceBtns = document.querySelectorAll('img[src$="voice-icon.svg"]');
    const zoomInBtns = document.querySelectorAll('img[src$="zoom-in.svg"]');
    const zoomOutBtns = document.querySelectorAll('img[src$="zoom-out.svg"]');
    const eyeBtns = document.querySelectorAll('img[src$="eye.svg"]');

    // Speak text with custom voice
    function speakText(text) {
        const isArabic = /[\u0600-\u06FF]/.test(text);
        const voices = speechSynthesis.getVoices();

        let selectedVoice = null;

        if (isArabic) {
            selectedVoice = voices.find(v =>
                v.lang === "ar-SA" && v.name.toLowerCase().includes("male")
            ) || voices.find(v => v.lang === "ar-SA") || voices.find(v => v.lang.startsWith("ar"));
        } else {
            selectedVoice = voices.find(v =>
                v.lang.startsWith("en") && v.name.toLowerCase().includes("us") && v.name.toLowerCase().includes("male")
            ) || voices.find(v =>
                v.lang.startsWith("en") && v.name.toLowerCase().includes("us")
            ) || voices.find(v => v.lang.startsWith("en"));
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice || null;
        utterance.lang = selectedVoice?.lang || (isArabic ? "ar-EG" : "en-US");

        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }

    // Voice toggle
    voiceBtns.forEach(btn => {
        const parent = btn.parentElement;
        parent.addEventListener("click", (e) => {
            e.preventDefault();
            isReadingActive = !isReadingActive;
            parent.classList.toggle("active", isReadingActive);
        });
    });

    // Hover-to-read
    let readTimer;
    document.body.addEventListener("mouseover", (e) => {
        if (!isReadingActive) return;

        if (["SPAN", "P", "H1", "H2", "H3", "H4", "H5", "H6", "A", "LABEL", "DIV", "BUTTON", "LI"].includes(e.target.tagName)) {
            const text = e.target.textContent.trim();
            if (text) {
                clearTimeout(readTimer);
                readTimer = setTimeout(() => {
                    speakText(text);
                }, 500);
            }
        }
    });

    document.body.addEventListener("mouseout", () => {
        clearTimeout(readTimer);
        speechSynthesis.cancel();
    });

    // Text Scaling
    const textElements = document.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, a, li, label, td, th");
    const originalFontSizes = new Map();
    textElements.forEach(el => {
        const computedFontSize = window.getComputedStyle(el).fontSize;
        originalFontSizes.set(el, parseFloat(computedFontSize));
    });

    const applyFontSizeScaling = () => {
        const scale = 1 + (fontLevel * scaleStep);
        originalFontSizes.forEach((originalSize, el) => {
            el.style.fontSize = (originalSize * scale) + "px";
        });
    };

    zoomInBtns.forEach(btn => {
        const parent = btn.parentElement;
        parent.addEventListener("click", (e) => {
            e.preventDefault();
            if (fontLevel < maxLevel) {
                fontLevel++;
                applyFontSizeScaling();
            }
        });
    });

    zoomOutBtns.forEach(btn => {
        const parent = btn.parentElement;
        parent.addEventListener("click", (e) => {
            e.preventDefault();
            if (fontLevel > minLevel) {
                fontLevel--;
                applyFontSizeScaling();
            }
        });
    });

    [zoomInBtns, zoomOutBtns].forEach(btnGroup => {
        btnGroup.forEach(btn => {
            const parent = btn.parentElement;
            parent.addEventListener("mouseenter", () => parent.classList.add("active"));
            parent.addEventListener("mouseleave", () => parent.classList.remove("active"));
        });
    });

    // BW mode toggle
    eyeBtns.forEach(btn => {
        const parent = btn.parentElement;
        parent.addEventListener("click", (e) => {
            e.preventDefault();
            parent.classList.toggle("active");
            document.body.classList.toggle("bw-mode", parent.classList.contains("active"));
        });
    });
});