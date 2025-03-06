document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const spaceBackground = document.querySelector('.space-background');
    const orbitContainer = document.querySelector('.orbit-container');
    const dot1 = document.querySelector('.dot-1');
    const dot2 = document.querySelector('.dot-2');
    const dot3 = document.querySelector('.dot-3');
    const profileImage = document.querySelector('.floating-profile');
    const aboutCards = document.querySelectorAll('.about-card');
    
    // Animation variables
    let angle1 = 0;
    let angle2 = 120;
    let angle3 = 240;
    
    // Cursor position
    let mouseX = 0;
    let mouseY = 0;
    
    // Animate dots
    function animateDots() {
        if (!dot1 || !dot2 || !dot3) return;
        
        // Dot 1 animation (clockwise) - slower
        angle1 += 0.1;
        dot1.style.left = `${50 + 49.5 * Math.cos(angle1 * Math.PI / 180)}%`;
        dot1.style.top = `${50 + 49.5 * Math.sin(angle1 * Math.PI / 180)}%`;
        
        // Dot 2 animation (counter-clockwise) - slower
        angle2 -= 0.07;
        dot2.style.left = `${50 + 49.5 * Math.cos(angle2 * Math.PI / 180)}%`;
        dot2.style.top = `${50 + 49.5 * Math.sin(angle2 * Math.PI / 180)}%`;
        
        // Dot 3 animation (custom path) - slower
        angle3 += 0.05;
        dot3.style.left = `${50 + 49.5 * Math.cos(angle3 * Math.PI / 180)}%`;
        dot3.style.top = `${50 + 49.5 * Math.sin(angle3 * Math.PI / 180)}%`;
        
        requestAnimationFrame(animateDots);
    }
    
    // Start animation if dots exist
    if (dot1 && dot2 && dot3) {
        animateDots();
    }
    
    // Track mouse movement for star movement
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Affect nearby stars
        moveStarsWithCursor(mouseX, mouseY);
        
        // Add subtle 3D tilt effect to profile image
        if (profileImage) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // Calculate mouse position relative to center of window
            const relativeX = e.clientX - windowWidth / 2;
            const relativeY = e.clientY - windowHeight / 2;
            
            // Calculate rotation amount (very subtle)
            const rotateY = (relativeX / windowWidth) * 3; // -1.5 to 1.5 degrees
            const rotateX = (relativeY / windowHeight) * -2; // -1 to 1 degrees
            
            // Apply transform with rotation and preserve the floating animation
            const currentY = parseFloat(profileImage.style.getPropertyValue('--translateY') || '0');
            profileImage.style.transform = `translateY(${currentY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
        }
    });
    
    // Scroll event for background color change and orbit disappearance
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Fade out orbits when scrolling
        if (orbitContainer) {
            const orbitOpacity = Math.max(0, 1 - (scrollPosition / (windowHeight * 0.3)));
            orbitContainer.style.opacity = orbitOpacity;
        }
        
        // Change background color based on scroll position - more aggressive transition
        if (spaceBackground) {
            if (scrollPosition > windowHeight * 0.3) {
                // Fully black after scrolling past 30% of the viewport height
                spaceBackground.style.background = '#000000';
            } else {
                // Gradual transition to black
                const opacity = scrollPosition / (windowHeight * 0.3);
                const centerBrightness = Math.max(0.1, 0.8 - opacity * 0.8);
                const middleBrightness = Math.max(0.05, 0.7 - opacity * 0.7);
                const outerBrightness = Math.max(0, 0.9 - opacity * 0.9);
                const edgeBrightness = Math.max(0, 1 - opacity);
                
                spaceBackground.style.background = `radial-gradient(circle at 50% 50%, 
                    rgba(17, 20, 60, ${centerBrightness}) 0%,
                    rgba(14, 16, 50, ${middleBrightness}) 40%,
                    rgba(10, 12, 40, ${outerBrightness}) 70%,
                    rgba(8, 10, 35, ${edgeBrightness}) 100%)`;
            }
        }
        
        // Alternative approach using body class
        if (scrollPosition > windowHeight * 0.3) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    });
    
    // Add stars to the background
    const stars = [];
    function createStars() {
        if (!spaceBackground) return;
        
        const background = spaceBackground;
        const starCount = 200; // Increased star count for more density
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random position
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            
            // Random size - slightly larger for better visibility
            const size = Math.random() * 2 + 1;
            
            // Random opacity - brighter overall
            const opacity = Math.random() * 0.6 + 0.2;
            
            // Random slight glow effect for some stars
            const hasGlow = Math.random() > 0.7;
            const glowColor = 'rgba(150, 180, 255, 0.4)';
            const glowSize = Math.random() * 3 + 1;
            const glow = hasGlow ? `box-shadow: 0 0 ${glowSize}px ${glowColor};` : '';
            
            star.style.cssText = `
                left: ${posX}%;
                top: ${posY}%;
                width: ${size}px;
                height: ${size}px;
                opacity: ${opacity};
                ${glow}
            `;
            
            stars.push({
                element: star,
                x: posX,
                y: posY,
                originalX: posX,
                originalY: posY,
                size: size,
                hasGlow: hasGlow
            });
            
            background.appendChild(star);
        }
    }
    
    // Create color variation spots for uneven coloring
    function createColorSpots() {
        if (!spaceBackground) return;
        
        const background = spaceBackground;
        const spotCount = 12; // Increased for more variation
        
        // Create a vignette effect container
        const vignette = document.createElement('div');
        vignette.classList.add('vignette');
        document.body.appendChild(vignette);
        
        // Add color spots at various positions
        for (let i = 0; i < spotCount; i++) {
            const spot = document.createElement('div');
            spot.classList.add('color-spot');
            
            // More varied positions
            let posX, posY;
            if (i < 4) {
                // Position in corners and edges
                posX = (i % 2) * 80 + 10; // Either 10% or 90%
                posY = Math.floor(i / 2) * 80 + 10; // Either 10% or 90%
            } else {
                // Random positions with more variety
                posX = Math.random() * 100;
                posY = Math.random() * 100;
            }
            
            // Random size with more variation
            const size = Math.random() * 40 + 15;
            
            // Darker blue colors for different spots
            let color;
            if (i % 4 === 0) {
                color = '25, 30, 80'; // Medium blue
            } else if (i % 4 === 1) {
                color = '18, 22, 70'; // Darker blue
            } else if (i % 4 === 2) {
                color = '30, 35, 90'; // Slightly brighter blue
            } else {
                color = '15, 18, 60'; // Very dark blue
            }
            
            // Varied opacity for more uneven distribution
            const opacity = Math.random() * 0.3 + 0.15;
            
            spot.style.cssText = `
                left: ${posX}%;
                top: ${posY}%;
                width: ${size}vw;
                height: ${size}vw;
                background-color: rgb(${color});
                opacity: ${opacity};
                filter: blur(${Math.random() * 50 + 70}px);
            `;
            
            background.appendChild(spot);
        }
        
        // Add a subtler central spot
        const centerSpot = document.createElement('div');
        centerSpot.classList.add('color-spot');
        centerSpot.style.cssText = `
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 40vw;
            height: 40vw;
            background-color: rgb(30, 40, 100);
            opacity: 0.2;
            filter: blur(100px);
        `;
        background.appendChild(centerSpot);
        
        // Add secondary center glow
        const secondaryGlow = document.createElement('div');
        secondaryGlow.classList.add('color-spot');
        secondaryGlow.style.cssText = `
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 20vw;
            height: 20vw;
            background-color: rgb(35, 45, 120);
            opacity: 0.18;
            filter: blur(80px);
        `;
        background.appendChild(secondaryGlow);
    }
    
    // Function to move stars with cursor
    function moveStarsWithCursor(mouseX, mouseY) {
        if (stars.length === 0) return;
        
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        stars.forEach(star => {
            // Convert percentage to pixels for distance calculation
            const starXpx = (star.originalX / 100) * windowWidth;
            const starYpx = (star.originalY / 100) * windowHeight;
            
            // Calculate distance from cursor to star
            const dx = mouseX - starXpx;
            const dy = mouseY - starYpx;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only affect stars within 150px of cursor
            const maxDistance = 150;
            if (distance < maxDistance) {
                // Calculate movement intensity based on distance (closer = more movement)
                const intensity = 1 - distance / maxDistance;
                
                // Move away from cursor
                const moveX = (dx / distance) * intensity * 30;
                const moveY = (dy / distance) * intensity * 30;
                
                // New position in pixels
                const newXpx = starXpx - moveX;
                const newYpx = starYpx - moveY;
                
                // Convert back to percentage
                const newX = (newXpx / windowWidth) * 100;
                const newY = (newYpx / windowHeight) * 100;
                
                // Apply new position
                star.x = newX;
                star.y = newY;
                star.element.style.left = `${newX}%`;
                star.element.style.top = `${newY}%`;
                
                // Increase opacity for stars near cursor
                star.element.style.opacity = 0.1 + intensity * 0.7;
            } else {
                // Gradually return to original position
                if (star.x !== star.originalX || star.y !== star.originalY) {
                    star.x += (star.originalX - star.x) * 0.05;
                    star.y += (star.originalY - star.y) * 0.05;
                    star.element.style.left = `${star.x}%`;
                    star.element.style.top = `${star.y}%`;
                    star.element.style.opacity = 0.1 + Math.random() * 0.3;
                }
            }
        });
    }
    
    // Custom floating animation for profile image
    if (profileImage) {
        let floatPos = 0;
        const floatSpeed = 0.05;
        const floatDistance = 15;
        const profileLine = document.querySelector('.profile-line');
        
        function updateFloatingAnimation() {
            // Calculate the Y position based on sine wave for smooth oscillation
            floatPos += floatSpeed;
            const translateY = Math.sin(floatPos) * floatDistance;
            
            // Store the current translate Y position as a CSS variable
            profileImage.style.setProperty('--translateY', `${translateY}`);
            
            // Apply the transform, preserving any rotation if present
            const transform = profileImage.style.transform || '';
            
            if (transform.includes('rotate')) {
                const rotateValues = transform.match(/rotateY\(([^)]+)\) rotateX\(([^)]+)\)/);
                if (rotateValues && rotateValues.length >= 3) {
                    profileImage.style.transform = `translateY(${translateY}px) rotateY(${rotateValues[1]}) rotateX(${rotateValues[2]})`;
                } else {
                    profileImage.style.transform = `translateY(${translateY}px)`;
                }
            } else {
                profileImage.style.transform = `translateY(${translateY}px)`;
            }
            
            // Subtle glow effect for the line
            if (profileLine) {
                const glowIntensity = Math.abs(Math.sin(floatPos * 0.5)) * 0.3 + 0.5;
                profileLine.style.opacity = glowIntensity;
            }
            
            requestAnimationFrame(updateFloatingAnimation);
        }
        
        updateFloatingAnimation();
    }
    
    // Initialize about section animations - UPDATED to reveal all cards simultaneously
    function initAboutSection() {
        if (!aboutCards.length) return;
        
        // Single IntersectionObserver for all cards
        const observer = new IntersectionObserver((entries) => {
            // If any card is visible, make all cards visible at once
            if (entries.some(entry => entry.isIntersecting)) {
                aboutCards.forEach(card => {
                    // Remove staggered delay
                    card.style.transitionDelay = "0s";
                    // Add visible class to all cards at once
                    card.classList.add('card-visible');
                });
                
                // Disconnect observer since we only need to do this once
                observer.disconnect();
            }
        }, {
            root: null,
            threshold: 0.2, // 20% of the item is visible
            rootMargin: "0px"
        });
        
        // Only observe the first card - when it's visible, show all cards
        observer.observe(aboutCards[0]);
        
        // Add hover effects for cards
        aboutCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('card-hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('card-hover');
            });
        });
    }
    
    // Initialize Why Hire Me section animation
    function initWhyHireSection() {
        const revealSection = document.querySelector('.reveal-section');
        const revealItems = document.querySelectorAll('.reveal-item');
        
        if (!revealSection || !revealItems.length) return;
        
        // Create intersection observer for the section
        const sectionObserver = new IntersectionObserver((entries) => {
            // When section becomes visible
            if (entries[0].isIntersecting) {
                // Add visible class to the section
                revealSection.classList.add('visible');
                
                // Add visible class to all items with a slight delay
                setTimeout(() => {
                    revealItems.forEach(item => {
                        item.classList.add('visible');
                    });
                }, 200);
                
                // Disconnect observer since we only need to trigger this once
                sectionObserver.disconnect();
            }
        }, {
            threshold: 0.2, // 20% of the section is visible
            rootMargin: "0px"
        });
        
        // Observe the section
        sectionObserver.observe(revealSection);
    }
    
    // Smooth scroll for anchor links
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        if (!anchorLinks.length) return;
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId.startsWith('#')) return;
                
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Initialize everything
    createStars();
    createColorSpots();
    initAboutSection();
    initWhyHireSection();
    initSmoothScroll();
    
    // Force-check scroll position on page load in case we're already scrolled down
    setTimeout(function() {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (nav.classList.contains('mobile-open') && 
            !event.target.closest('nav') && 
            !event.target.closest('.mobile-menu-toggle')) {
            nav.classList.remove('mobile-open');
        }
    });
    
    // Adjust animations based on device performance
    const isMobile = window.innerWidth <= 768;
    const hasReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isMobile || hasReducedMotion) {
        // Reduce the number of stars for better performance
        const stars = document.querySelectorAll('.star');
        const starsToKeep = Math.min(stars.length, 75); // Keep only 75 stars on mobile
        
        for (let i = starsToKeep; i < stars.length; i++) {
            if (stars[i].parentNode) {
                stars[i].parentNode.removeChild(stars[i]);
            }
        }
        
        // Slow down orbit animations for better performance
        const adjustAnimationSpeed = (selector, speedFactor) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.animationDuration = `${speedFactor}s`;
            }
        };
        
        adjustAnimationSpeed('.dot-1', 12); // Slower animation
        adjustAnimationSpeed('.dot-2', 15);
        adjustAnimationSpeed('.dot-3', 18);
    }
    
    // Detect device orientation change and update layout
    window.addEventListener('orientationchange', function() {
        // Force recalculation of layouts
        setTimeout(function() {
            window.dispatchEvent(new Event('resize'));
        }, 200);
    });
    
    // Function to handle responsive image loading
    function handleResponsiveImages() {
        const profileImage = document.querySelector('.floating-profile');
        if (profileImage) {
            if (window.innerWidth <= 768) {
                // Load smaller image version for mobile if needed
                // profileImage.src = 'static/profile-small.png';
            } else {
                // profileImage.src = 'static/profile.png';
            }
        }
    }

    // Initialize tech stack section animation
function initTechSection() {
    const techCards = document.querySelectorAll('.tech-card:not(.empty-card)');
    
    if (!techCards.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for a nice sequence effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: "0px"
    });
    
    techCards.forEach(card => {
        observer.observe(card);
    });
}



// Add this to your initialization code
initTechSection();
    
    handleResponsiveImages();
    window.addEventListener('resize', handleResponsiveImages);
});