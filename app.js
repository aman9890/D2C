/* sakshi Fine Jewellery Redesign Interactions Script */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Navigation & Scroll Effects
    // ==========================================
    const navbar = document.getElementById('navbar');
    const heroBg = document.getElementById('hero-background-image');

    window.addEventListener('scroll', () => {
        // Sticky Glassmorphism Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Parallax Hero Background Scroll
        if (heroBg) {
            let scrollPosition = window.scrollY;
            heroBg.style.transform = `translateY(${scrollPosition * 0.15}px) scale(1.02)`;
        }
    });

    // ==========================================
    // 2. Scroll Reveal Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 3. Sparkle Effect Generator
    // ==========================================
    const sparkleContainer = document.getElementById('sparkle-container');

    function triggerSparkles(count = 8) {
        if (!sparkleContainer) return;
        
        // Clear previous sparkles
        sparkleContainer.innerHTML = '';
        
        const width = sparkleContainer.clientWidth;
        const height = sparkleContainer.clientHeight;
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.classList.add('sparkle-particle');
            
            // Randomly scatter sparkles around the diamond/crown (center area)
            const angle = Math.random() * Math.PI * 2;
            const distance = 40 + Math.random() * 80;
            const targetX = Math.cos(angle) * distance;
            const targetY = Math.sin(angle) * distance;

            // Set spawn coordinates close to center
            const spawnX = centerX - 10 + Math.random() * 20;
            const spawnY = centerY - 50 + Math.random() * 40; // Shifted up slightly towards ring crown

            sparkle.style.left = `${spawnX}px`;
            sparkle.style.top = `${spawnY}px`;
            sparkle.style.setProperty('--x', `${targetX}px`);
            sparkle.style.setProperty('--y', `${targetY}px`);

            // Random delay and scaling
            sparkle.style.animationDelay = `${Math.random() * 0.4}s`;
            
            sparkleContainer.appendChild(sparkle);
        }
    }

    // Auto-sparkle occasionally
    setInterval(() => {
        if (document.hidden) return;
        triggerSparkles(3);
    }, 4500);

    // ==========================================
    // 4. Bespoke Atelier Customizer State
    // ==========================================
    const ringWrapper = document.getElementById('ring-display-wrapper');
    const metalLabel = document.getElementById('metal-selected-label');
    const cutLabel = document.getElementById('cut-selected-label');
    const caratSlider = document.getElementById('carat-slider');
    const caratValueLabel = document.getElementById('carat-value-label');
    const dynamicPrice = document.getElementById('dynamic-price');

    // State Variables
    let currentMetal = 'platinum';
    let currentCut = 'round';
    let currentCarat = 1.0;

    // Metal Base Multipliers
    const metalPrices = {
        platinum: 3200,
        'yellow-gold': 2400,
        'rose-gold': 2600
    };

    // Cut Multipliers
    const cutMultipliers = {
        round: 1.5,
        emerald: 1.35,
        cushion: 1.25,
        pear: 1.4
    };

    // Initialize display classes
    if (ringWrapper) {
        ringWrapper.className = 'ring-display-wrapper platinum';
    }

    // Metal Selectors
    const metalButtons = document.querySelectorAll('.metal-btn');
    metalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            metalButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const metal = btn.dataset.metal;
            currentMetal = metal;
            
            // Format labels
            let labelText = 'Platinum';
            if (metal === 'yellow-gold') labelText = '18k Yellow Gold';
            if (metal === 'rose-gold') labelText = '18k Rose Gold';
            metalLabel.textContent = labelText;

            // Apply style classes dynamically to trigger CSS filters
            ringWrapper.className = `ring-display-wrapper ${metal}`;
            
            // Sparkle effect
            triggerSparkles(10);
            updatePrice();
        });
    });

    // Cut Selectors
    const cutButtons = document.querySelectorAll('.cut-btn');
    cutButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            cutButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const cut = btn.dataset.cut;
            currentCut = cut;
            
            // Format labels
            let labelText = 'Round Brilliant';
            if (cut === 'emerald') labelText = 'Emerald Cut';
            if (cut === 'cushion') labelText = 'Cushion Cut';
            if (cut === 'pear') labelText = 'Bespoke Pear Cut';
            cutLabel.textContent = labelText;

            // Subtle scale pulse animation representing stone change
            ringWrapper.style.transform = 'scale(0.85)';
            setTimeout(() => {
                ringWrapper.style.transform = `scale(${0.75 + (currentCarat * 0.15)})`;
                triggerSparkles(12);
            }, 250);

            updatePrice();
        });
    });

    // Carat Slider
    if (caratSlider) {
        caratSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            currentCarat = val;
            
            // Update labels
            caratValueLabel.textContent = `${val.toFixed(2)} ct`;

            // Dynamic scale transform of the ring display
            // Standard scale at 1ct is scale(0.9). Scales larger/smaller smoothly.
            const scaleFactor = 0.75 + (val * 0.15);
            ringWrapper.style.transform = `scale(${scaleFactor})`;

            updatePrice();
        });
    }

    // Luxurious Dynamic Price Counter Animation
    let previousPrice = 8500;
    
    function updatePrice() {
        if (!dynamicPrice) return;
        
        // Valuation algorithm
        // Price = (Metal Base Price + (Carat Weight^1.8 * 3500)) * Cut Multiplier
        const metalCost = metalPrices[currentMetal];
        const caratMultiplier = Math.pow(currentCarat, 1.8);
        const cutFactor = cutMultipliers[currentCut];
        
        const calculatedValuation = Math.round((metalCost + (caratMultiplier * 3600)) * cutFactor);
        
        // Animate counter from previousPrice to calculatedValuation
        let start = previousPrice;
        let end = calculatedValuation;
        
        if (start === end) return;
        
        const duration = 800; // ms
        const startTime = performance.now();
        
        function animateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.round(start + (end - start) * easeProgress);
            
            dynamicPrice.textContent = currentVal.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animateCounter);
            } else {
                previousPrice = end;
            }
        }
        
        requestAnimationFrame(animateCounter);
    }

    // ==========================================
    // 5. Diamond 4Cs Masterclass Tab Switching
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPane = document.getElementById(`pane-${btn.dataset.tab}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    // ==========================================
    // 6. Interactive 4Cs Education Sliders
    // ==========================================

    // 6A. Clarity Slider
    const claritySlider = document.getElementById('clarity-interactive-slider');
    const clarityLabel = document.getElementById('clarity-grade-title');
    const clarityDesc = document.getElementById('clarity-desc-note');
    const inclusionsContainer = document.getElementById('inclusions-container');

    const clarityGrades = {
        1: { name: 'SI1 (Slightly Included)', dots: 1.0, desc: 'SI1 inclusions are easily visible under 10x magnification, and sometimes visible to the naked eye. Beautiful, but structurally compromised.' },
        2: { name: 'VS2 (Very Slightly Included)', dots: 0.5, desc: 'VS2 diamonds house minor inclusions (clouds, pinpoints) that are difficult to locate under 10x magnification. Incredible relative value.' },
        3: { name: 'VVS1 (Very, Very Slightly Included)', dots: 0.15, desc: 'VVS1 represents elite clarity. Inclusions are microscopic and extremely challenging even for master gemologists to locate under magnification.' },
        4: { name: 'FL (Flawless)', dots: 0.0, desc: 'Flawless diamonds show absolutely zero internal inclusions or surface blemishes under 10x magnification. Pure rarity.' }
    };

    if (claritySlider) {
        claritySlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            const grade = clarityGrades[val];
            
            clarityLabel.textContent = grade.name;
            clarityDesc.textContent = grade.desc;
            
            // Alter inclusion carbon dots opacity directly in real-time!
            if (inclusionsContainer) {
                inclusionsContainer.style.opacity = grade.dots;
            }
        });
    }

    // 6B. Color Slider
    const colorSlider = document.getElementById('color-interactive-slider');
    const colorLabel = document.getElementById('color-grade-title');
    const colorDesc = document.getElementById('color-desc-note');
    const colorGlow = document.getElementById('color-overlay-glow');

    const colorGrades = {
        1: { name: 'D (Colorless)', glow: 'radial-gradient(circle, rgba(180, 220, 255, 0.25) 0%, transparent 70%)', desc: 'D is the highest possible grade. A stone of absolute purity, refracting perfectly clear white light with icy-blue brilliance.' },
        2: { name: 'F (Nearly Colorless)', glow: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)', desc: 'F diamonds are nearly colorless. Only trained experts can spot tiny color differences when placed upside down against clean sheets.' },
        3: { name: 'H (Faint Warmth)', glow: 'radial-gradient(circle, rgba(223, 186, 115, 0.1) 0%, transparent 70%)', desc: 'H grade stones contain a subtle warm undertone. Extremely popular as they look colorless when set in gold bands.' },
        4: { name: 'J (Faint Yellow Tint)', glow: 'radial-gradient(circle, rgba(223, 186, 115, 0.25) 0%, transparent 70%)', desc: 'J grade diamonds show a slight yellow/champagne coloration, visible to the naked eye. Rich and warm, but sells at a deep discount.' }
    };

    if (colorSlider) {
        colorSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            const grade = colorGrades[val];
            
            colorLabel.textContent = grade.name;
            colorDesc.textContent = grade.desc;
            
            // Modify background color tester glow overlay
            if (colorGlow) {
                colorGlow.style.background = grade.glow;
            }
        });
    }

    // 6C. Cut Slider
    const cutSlider = document.getElementById('cut-interactive-slider');
    const cutSliderLabel = document.getElementById('cut-grade-title');
    const cutDesc = document.getElementById('cut-desc-note');
    const cutRay1 = document.getElementById('cut-out-ray-1');
    const cutRay2 = document.getElementById('cut-out-ray-2');
    const cutInternalRay = document.getElementById('cut-internal-ray');
    const cutRefractionTitle = document.getElementById('cut-refraction-title');

    const cutGrades = {
        1: { 
            name: 'Fair (Lost Light)', 
            desc: 'A shallow or deep cut. Light enters the crown and escapes through the sides or bottom facets, leaving the diamond looking dark and dull.',
            opacity: '0.15',
            color: '#c27d73',
            points: '60,15 60,85 105,75', // Light escaping downward
            label: 'Lost Bottom Refraction'
        },
        2: { 
            name: 'Very Good (Partial Reflection)', 
            desc: 'A strong cut. The diamond captures and returns a high percentage of light, but some leakage occurs through crown edges.',
            opacity: '0.55',
            color: '#C5A059',
            points: '60,15 60,85 85,38 45,38 75,15',
            label: 'Standard Symmetry Refraction'
        },
        3: { 
            name: 'Ideal (Maximum Brilliance)', 
            desc: 'A mathematically perfect cut. Light bounces internally and exits fully through the crown, creating the celebrated "Fire & Brilliance".',
            opacity: '1.0',
            color: '#DFBA73',
            points: '60,15 60,85 90,38 30,38 60,85',
            label: 'Ideal Symmetry Refraction'
        }
    };

    if (cutSlider) {
        cutSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            const grade = cutGrades[val];
            
            cutSliderLabel.textContent = grade.name;
            cutDesc.textContent = grade.desc;
            
            // Manipulate SVG rays dynamically to visually explain refraction leak!
            if (cutRay1 && cutRay2 && cutInternalRay) {
                cutRay1.style.opacity = grade.opacity;
                cutRay2.style.opacity = grade.opacity;
                
                cutInternalRay.setAttribute('points', grade.points);
                cutInternalRay.setAttribute('stroke', grade.color);
                
                if (cutRefractionTitle) {
                    cutRefractionTitle.textContent = grade.label;
                }
            }
        });
    }

    // 6D. Carat Slider (Education Pane)
    const caratEduSlider = document.getElementById('carat-interactive-slider');
    const caratEduLabel = document.getElementById('carat-interactive-label');
    const caratEduTitle = document.getElementById('carat-education-title');
    const caratEduCircle = document.getElementById('carat-interactive-circle');
    const caratEduNote = document.getElementById('carat-edu-note');

    if (caratEduSlider) {
        caratEduSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            
            caratEduLabel.textContent = `${val.toFixed(2)} ct`;
            caratEduTitle.textContent = `${val.toFixed(2)} Carats`;
            
            // Exponential scale text representing relative rarity
            const pricingRarity = Math.round(val * val * 4500);
            caratEduNote.textContent = `A ${val.toFixed(2)}-carat diamond of this cut is highly rare. Valuation index jumps exponentially due to weight scarcity to approx $${pricingRarity.toLocaleString()}.`;

            // Physically scale comparison circle in education view
            if (caratEduCircle) {
                const diameter = 30 + (val * 15); // scales diameter beautifully
                caratEduCircle.style.width = `${diameter}px`;
                caratEduCircle.style.height = `${diameter}px`;
            }
        });
    }

    // ==========================================
    // 7. Booking Form & Animated Modal
    // ==========================================
    const bookingForm = document.getElementById('salon-booking-form');
    const modalOverlay = document.getElementById('confirmation-modal');
    const modalDesc = document.getElementById('confirmation-modal-desc');
    const btnModalClose = document.getElementById('btn-modal-close');
    const btnModalOk = document.getElementById('btn-modal-ok');

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch input details
            const name = document.getElementById('booking-name').value;
            const email = document.getElementById('booking-email').value;
            const serviceType = document.getElementById('booking-service').options[document.getElementById('booking-service').selectedIndex].text;
            const dateVal = document.getElementById('booking-date').value;

            // Format date beautifully
            const dateObj = new Date(dateVal);
            const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            // Customize modal description
            if (modalDesc) {
                modalDesc.innerHTML = `Salutations, <strong>${name}</strong>. Thank you for commissioning <strong>${serviceType}</strong>. We have set a reservation hold for <strong>${formattedDate}</strong>. A dedicated, GIA-accredited concierge will contact you at <strong>${email}</strong> within 24 hours to secure your access.`;
            }

            // Open luxury modal
            if (modalOverlay) {
                modalOverlay.classList.add('active');
            }

            // Reset Form fields
            bookingForm.reset();
        });
    }

    // Close Modal triggers
    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    }

    if (btnModalClose) btnModalClose.addEventListener('click', closeModal);
    if (btnModalOk) btnModalOk.addEventListener('click', closeModal);
    
    // Close on click outside modal content
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
});
