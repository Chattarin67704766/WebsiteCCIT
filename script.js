// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '90px'; // Adjusted for new nav height
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'white';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 10px 10px rgba(0,0,0,0.1)';
            }
        });
    }

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                }
            }
        });
    });

    // Intersection Observer for Fade-in Animation
    const observerOptions = { threshold: 0.1 };

    // Create styles for js-triggered animations if not exists
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

    // --- Gallery Slider Logic ---
    const slider = document.querySelector('.gallery-slider');
    const slides = document.querySelectorAll('.gallery-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');

    if (slider && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        // Create Dots
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

            // Update dots
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
            slideInterval = setInterval(nextSlide, 5000); // Auto slide every 5 seconds
        }

        function resetTimer() {
            clearInterval(slideInterval);
            startTimer();
        }

        // Event Listeners
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });

        // Initialize
        startTimer();
    }

    // --- Live Chat Widget (Crisp) ---
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "efd9b7f9-df18-476b-a7d6-937d3d352faf";

    // Hide Crisp by default when loaded
    $crisp.push(["safe", true]); // Use safe mode to avoid errors
    $crisp.push(["do", "chat:hide"]);

    (function () {
        var d = document;
        var s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = 1;
        d.getElementsByTagName("head")[0].appendChild(s);
    })();

    // --- Custom Chatbot Logic ---
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatWindow = document.getElementById('chat-window');
    const toggleBtn = document.getElementById('chatbot-toggle-btn');
    const closeBtn = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    if (chatbotContainer && chatWindow && toggleBtn) {
        // Toggle Chat Window
        toggleBtn.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
            // Hide badge when opened
            const badge = toggleBtn.querySelector('.notification-badge');
            if (badge) badge.style.display = 'none';
        });

        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });

        // Send Message
        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                // Add User Message
                addMessage(message, 'user');
                chatInput.value = '';

                // Show Typing Indicator
                showTypingIndicator();

                // Simulare Bot Response
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

        // Add Message to UI
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Send predefined option
        window.sendOption = function (option) {
            // Add User Message (visible)
            addMessage(option, 'user');

            // Google Auth Check for Contact Officer
            if (option === 'ติดต่อเจ้าหน้าที่') {
                // Check if already logged in via Google
                if (window.googleUserEmail) {
                    confirmHandover(window.googleUserEmail);
                } else {
                    // Request Login
                    addMessage("กรุณาเข้าสู่ระบบด้วย Google เพื่อยืนยันตัวตนก่อนติดต่อเจ้าหน้าที่ครับ", 'bot');
                    showGoogleLogin();
                }
                return;
            }

            // Simulate Bot Response

            // Simulate Bot Response
            setTimeout(() => {
                removeTypingIndicator();
                const response = getBotResponse(option);
                addMessage(response, 'bot');
            }, 800);
        }

        // --- Google Auth Logic ---
        function showGoogleLogin() {
            const loginContainerId = 'google-login-container-' + Date.now();
            const loginDiv = document.createElement('div');
            loginDiv.id = loginContainerId;
            loginDiv.className = 'google-login-wrapper';
            loginDiv.style.marginTop = '10px';
            loginDiv.style.display = 'flex';
            loginDiv.style.justifyContent = 'center';
            chatMessages.appendChild(loginDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            if (window.google) {
                google.accounts.id.initialize({
                    client_id: "1052435949448-e5j9sjdboj9emb7nsudts1ivifrtlt3q.apps.googleusercontent.com",
                    callback: handleCredentialResponse
                });
                google.accounts.id.renderButton(
                    document.getElementById(loginContainerId),
                    { theme: "outline", size: "large", width: "250" }  // customization attributes
                );
            } else {
                addMessage("ระบบ Google Login กำลังโหลด กรุณารอสักครู่...", 'bot');
            }
        }

        function handleCredentialResponse(response) {
            // Decode JWT to get user info (Simple client-side decode)
            const responsePayload = decodeJwtResponse(response.credential);

            console.log("ID: " + responsePayload.sub);
            console.log('Full Name: ' + responsePayload.name);
            console.log('Given Name: ' + responsePayload.given_name);
            console.log('Family Name: ' + responsePayload.family_name);
            console.log("Image URL: " + responsePayload.picture);
            console.log("Email: " + responsePayload.email);

            window.googleUserEmail = responsePayload.email;
            confirmHandover(responsePayload.email);
        }

        function decodeJwtResponse(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
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
            // Hide custom chatbot
            chatWindow.classList.remove('active');

            // Show Crisp
            try {
                if (typeof $crisp !== 'undefined') {
                    $crisp.push(["do", "chat:show"]);
                    $crisp.push(["do", "chat:open"]);
                } else {
                    // Fallback if script hasn't loaded yet
                    alert("ระบบ Live Chat กำลังโหลด... กรุณารอสักครู่");
                    setTimeout(() => {
                        $crisp.push(["do", "chat:show"]);
                        $crisp.push(["do", "chat:open"]);
                    }, 2000);
                }
            } catch (e) {
                console.error("Crisp error:", e);
                window.open('https://go.crisp.chat/chat/embed/?website_id=efd9b7f9-df18-476b-a7d6-937d3d352faf', '_blank');
            }
        }

        // Typing Indicator Helpers
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

        // Simple Rule Model
        function getBotResponse(input) {
            input = input.toLowerCase();

            if (input.includes('บริการ') || input.includes('service')) {
                return "เรามีบริการ IT Outsource, Infrastructure (Network/WiFi), Cyber Security และจำหน่ายอุปกรณ์ไอทีครับ สามารถดูรายละเอียดเพิ่มเติมได้ที่หน้า 'บริการของเรา' ครับ";
            } else if (input.includes('ราคา') || input.includes('price') || input.includes('package')) {
                return "ราคาเริ่มต้นสำหรับการดูแลระบบรายเดือนเริ่มต้นที่ 2,500 บาท/เดือน ครับ (สำหรับสำนักงานขนาดเล็ก) หากต้องการใบเสนอราคา รบกวนแจ้งขนาดองค์กรและจำนวนเครื่องคอมพิวเตอร์ครับ";
            } else if (input.includes('ติดต่อ') || input.includes('contact') || input.includes('โทร') || input.includes('ที่อยู่') || input.includes('เจ้าหน้าที่')) {
                return "สามารถติดต่อเจ้าหน้าที่ผ่านช่องทาง Live Chat ได้เลยครับ (เลือกเมนู 'ติดต่อเจ้าหน้าที่')";
            } else if (input.includes('ปัญหา') || input.includes('แจ้ง') || input.includes('support')) {
                return "หากพบปัญหาการใช้งาน สามารถแจ้งรายละเอียดไว้ที่นี่ หรือโทรสายด่วน 08X-XXX-XXXX ได้เลยครับ ทีมงานพร้อม Support ครับ";
            } else if (input.includes('สวัสดี') || input.includes('hello') || input.includes('hi')) {
                return "สวัสดีครับ! ยินดีต้อนรับสู่ IT Solution ครับ มีอะไรให้ช่วยบอกได้เลยนะครับ";
            } else {
                return "ขออภัยครับ ผมอาจจะยังไม่เข้าใจคำถาม รบกวนลองเลือกหัวข้อจากเมนูด้านบน หรือติดต่อเจ้าหน้าที่โดยตรงที่หน้า 'ติดต่อเรา' ได้เลยครับ";
            }
        }
    }
});
