// Load voices when available
speechSynthesis.onvoiceschanged = () => {
    speechSynthesis.getVoices(); // Trigger loading of available voices
};

document.addEventListener("DOMContentLoaded", function () {
    // 1. Global variables
    let fontLevel = 0;
    const minLevel = 0;
    const maxLevel = 4;
    const scaleStep = 0.1;
    let isReadingActive = false;

    // 2. Create the Accessibility Widget
    const accessibilityWidget = document.createElement('div');
    accessibilityWidget.id = 'accessibility-widget';
    accessibilityWidget.innerHTML = `
      <button id="accessibility-toggle" aria-label="Accessibility Tools"><img src="../../assets/images/iconoir_accessibility.svg" alt="♿"></button>
      <div id="accessibility-panel" class="icons">
        <a href="#" class="voice-toggle"><img src="../../assets/images/voice-icon.svg" alt="Voice"></a>
        <a href="#" class="zoom-out"><img src="../../assets/images/zoom-out.svg" alt="Zoom Out"></a>
        <a href="#" class="zoom-in"><img src="../../assets/images/zoom-in.svg" alt="Zoom In"></a>
        <a href="#" class="bw-toggle"><img src="../../assets/images/eye.svg" alt="BW Mode"></a>
      </div>
    `;
    document.body.insertBefore(accessibilityWidget, document.body.firstChild);

    // 3. Select elements
    const toggleBtn = document.getElementById('accessibility-toggle');
    const panel = document.getElementById('accessibility-panel');
    const voiceBtns = document.querySelectorAll('img[src$="voice-icon.svg"]');
    const zoomInBtns = document.querySelectorAll('img[src$="zoom-in.svg"]');
    const zoomOutBtns = document.querySelectorAll('img[src$="zoom-out.svg"]');
    const eyeBtns = document.querySelectorAll('img[src$="eye.svg"]');

    // 4. Toggle Accessibility Panel
    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== toggleBtn) {
                panel.classList.remove('active');
            }
        });

        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 5. Speak Text Function
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
            ) || voices.find(v => v.lang.startsWith("en"));
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice || null;
        utterance.lang = selectedVoice?.lang || (isArabic ? "ar-EG" : "en-US");

        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }

    // 6. Toggle Voice Reading Mode
    voiceBtns.forEach(btn => {
        const parent = btn.parentElement;
        parent.addEventListener("click", (e) => {
            e.preventDefault();
            isReadingActive = !isReadingActive;

            // Toggle 'active' class on all voice buttons together
            voiceBtns.forEach(icon => {
                icon.parentElement.classList.toggle("active", isReadingActive);
            });
        });
    });

    // 7. Hover-to-Read Functionality
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

    // 8. Text Scaling
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

    // 9. Toggle BW (Black & White) Mode
    eyeBtns.forEach(btn => {
        const parent = btn.parentElement;
        parent.addEventListener('click', (e) => {
            e.preventDefault();

            // Check if currently active or not
            const isNowActive = !document.body.classList.contains("bw-mode");

            // Toggle BW mode on the body
            document.body.classList.toggle("bw-mode", isNowActive);

            // Toggle 'active' class on all BW buttons together
            eyeBtns.forEach(icon => {
                icon.parentElement.classList.toggle("active", isNowActive);
            });
        });
    });
});

window.addEventListener('scroll', function () {
    const widget = document.getElementById('accessibility-widget'); // Main widget
    const footer = document.querySelector('footer'); // Footer element
  
    if (!widget || !footer) return; // Make sure both exist
  
    const footerRect = footer.getBoundingClientRect(); // Footer position relative to viewport
    const windowHeight = window.innerHeight; // Current window height
  
    if (footerRect.top < windowHeight) {
      // Footer is appearing
      const overlap = windowHeight - footerRect.top;
      widget.style.bottom = `${overlap + 20}px`; // Move widget up
    } else {
      // Footer is not near
      widget.style.bottom = '20px'; // Keep it fixed normally
    }
  });
  