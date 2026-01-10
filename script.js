// script.js

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '90px';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 10px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    const observerOptions = { threshold: 0.1 };

    if (!document.getElementById('js-anim-styles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'js-anim-styles';
        styleSheet.textContent = `.fade-in-scroll { animation: fadeIn 0.8s ease forwards; opacity: 1 !important; }`;
        document.head.appendChild(styleSheet);
    }

    document.querySelectorAll('.section, .hero-content').forEach(el => {
        el.style.opacity = '0';
        new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-scroll');
                    obs.unobserve(entry.target);
                }
            });
        }, observerOptions).observe(el);
    });

    const slider = document.querySelector('.gallery-slider');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');

    if (slider && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function updateSlider() {
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }

        function goToSlide(index) {
            currentSlide = index;
            updateSlider();
            resetTimer();
        }

        function startTimer() {
            slideInterval = setInterval(nextSlide, 5000);
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });

        startTimer();
    }

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "efd9b7f9-df18-476b-a7d6-937d3d352faf";

    $crisp.push(["safe", true]);
    $crisp.push(["do", "chat:hide"]);

    (function () {
        var d = document;
        var s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
    })();

    const chatbotContainer = document.getElementById('chatbot-container');
    const chatWindow = document.getElementById('chat-window');
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    if (chatbotContainer && chatWindow && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            const badge = toggleBtn.querySelector('.notification-badge');
            if (badge) badge.style.display = 'none';
        });

        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                addMessage(message, 'user');
                chatInput.value = '';
                showTypingIndicator();
                setTimeout(() => {
                    removeTypingIndicator();
                    const response = getBotResponse(message);
                    addMessage(response, 'bot');
                }, 1000);
            }
        }

        sendBtn.addEventListener('click', sendMessage);

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        window.sendOption = function (option) {
            addMessage(option, 'user');

            if (option === 'ติดต่อเจ้าหน้าที่') {
                if (window.googleUserEmail) {
                    confirmHandover(window.googleUserEmail);
                } else {
                    addMessage("กรุณาเข้าสู่ระบบด้วย Google เพื่อยืนยันตัวตนก่อนติดต่อเจ้าหน้าที่ครับ", 'bot');
                    showGoogleLogin();
                }
                return;
            }

            setTimeout(() => {
                removeTypingIndicator();
                const response = getBotResponse(option);
                addMessage(response, 'bot');
            }, 800);
        }

        function showGoogleLogin() {
            const loginContainerId = 'google-login-container-' + Date.now();
            const loginDiv = document.createElement('div');
            loginDiv.id = loginContainerId;
            loginDiv.style.marginTop = '10px';
            loginDiv.style.display = 'flex';
            loginDiv.style.justifyContent = 'center';
            chatMessages.appendChild(loginDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Assign to window to ensure Google API can call it
            window.handleCredentialResponse = handleCredentialResponse;

            google.accounts.id.initialize({
                client_id: "1052435949448-e5j9sjdboj9emb7nsudts1ivifrtlt3q.apps.googleusercontent.com",
                callback: window.handleCredentialResponse,
                auto_select: false,
                cancel_on_tap_outside: false
            });

            google.accounts.id.renderButton(
                document.getElementById(loginContainerId),
                { theme: "outline", size: "large", width: "250" }
            );

            // Failsafe: Show bypass QUICKLY (1.5s) if Google hangs
            setTimeout(() => {
                if (document.getElementById('bypass-login')) return;

                const noteDiv = document.createElement('div');
                noteDiv.style.marginTop = '10px';
                noteDiv.style.textAlign = 'center';
                noteDiv.innerHTML = `
                    <div style="font-size:12px; color:#666; margin-bottom:5px;">หากรอนานเกินไป หรือปุ่มหมุนไม่หยุด</div>
                    <button id="bypass-login" style="background:#e5e7eb; border:none; padding:5px 10px; border-radius:4px; color:#ef4444; font-weight:bold; cursor:pointer;">
                        👉 กดตรงนี้เพื่อข้าม (Bypass)
                    </button>
                `;
                chatMessages.appendChild(noteDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;

                document.getElementById('bypass-login').addEventListener('click', (e) => {
                    e.preventDefault();
                    confirmHandover('test_user_bypass@example.com (Bympass)');
                });
            }, 1500);
        }

        function handleCredentialResponse(response) {
            const payload = decodeJwtResponse(response.credential);

            window.googleUserEmail = payload.email;

            const waitForCrisp = setInterval(() => {
                if (window.$crisp && window.CRISP_WEBSITE_ID) {
                    clearInterval(waitForCrisp);

                    $crisp.push(["set", "user:email", [payload.email]]);
                    $crisp.push(["set", "user:nickname", [payload.name]]);
                    $crisp.push(["set", "session:data", [
                        ["auth_provider", "google"],
                        ["verified", "true"]
                    ]]);

                    confirmHandover(payload.email);
                }
            }, 300);
        }

        function decodeJwtResponse(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            return JSON.parse(jsonPayload);
        }


        function confirmHandover(email) {
            addMessage(`ยืนยันตัวตนสำเร็จ! สวัสดีคุณ ${email}`, 'bot');
            setTimeout(() => {
                addMessage("กำลังส่งต่อให้เจ้าหน้าที่ครับ... กรุณารอสักครู่", 'bot');

                // Pass email to Crisp (Optional: Set user email in Crisp)
                if (window.$crisp) {
                    $crisp.push(["set", "user:email", [email]]);
                }

                setTimeout(() => {
                    switchToLiveChat();
                }, 1500);
            }, 1000);
        }

        function switchToLiveChat() {
            chatWindow.classList.remove('active');

            const waitForCrisp = setInterval(() => {
                if (window.$crisp) {
                    clearInterval(waitForCrisp);
                    $crisp.push(["do", "chat:show"]);
                    $crisp.push(["do", "chat:open"]);
                }
            }, 300);
        }

        function showTypingIndicator() {
            const typingDiv = document.createElement('div');
            typingDiv.classList.add('typing');
            typingDiv.id = 'typing-indicator';
            typingDiv.innerHTML = `
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            `;
            chatMessages.appendChild(typingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function removeTypingIndicator() {
            const typingDiv = document.getElementById('typing-indicator');
            if (typingDiv) typingDiv.remove();
        }

        function getBotResponse(input) {
            input = input.toLowerCase();

            if (input.includes('บริการ') || input.includes('service')) {
                return "เรามีบริการ IT Outsource, Infrastructure (Network/WiFi), Cyber Security และจำหน่ายอุปกรณ์ไอทีครับ สามารถดูรายละเอียดเพิ่มเติมได้ที่หน้า 'บริการของเรา' ครับ";
            } else if (input.includes('ราคา') || input.includes('price') || input.includes('package')) {
                return "ราคาเริ่มต้นสำหรับการดูแลระบบรายเดือนเริ่มต้นที่ 2,500 บาท/เดือน ครับ";
            } else if (input.includes('สวัสดี') || input.includes('hello') || input.includes('hi')) {
                return "สวัสดีครับ! ยินดีต้อนรับครับ มีอะไรให้ช่วยบอกได้เลยครับ";
            } else {
                return "ขออภัยครับ ผมอาจยังไม่เข้าใจคำถาม ลองเลือกเมนูด้านบน หรือ ติดต่อเจ้าหน้าที่ได้เลยครับ";
            }
        }
    }
});
