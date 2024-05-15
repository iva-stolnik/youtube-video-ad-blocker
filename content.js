function handleMutations(mutationsList) {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            replaceAds();
        }
    });
}

function replaceAds() {
    try {
        // Detect the ad preview element
        const adPreview = document.querySelector('div.ytp-preview-ad');
        // Target ad video specifically
        const video = document.querySelector('video');

        if (video && !video.src) {
            video.style.display = "none";
        }
        
        if (adPreview && video) {
            video.style.display = "none";
            video.muted = true;

            if (video.duration && video.currentTime) {
                video.currentTime = video.duration - 1;
            }

        }
    
        // Detect and click all variations of the "Skip Ad" button
        const skipButtons = document.querySelectorAll('.ytp-ad-skip-button, .ytp-skip-ad-button, .ytp-ad-skip-button-container, .ytp-ad-skip-button-slot, .ytp-ad-skip-button-icon, .ytp-ad-skip-button-text');
        skipButtons.forEach(button => {
            button.click();
        });

        // Remove ad overlay info containers
        const adOverlays = document.querySelectorAll('.ytp-ad-player-overlay-layout__ad-info-container, .ytp-ad-player-overlay-layout__player-card-container');
        adOverlays.forEach(overlay => {
            overlay.parentNode.removeChild(overlay);
        });
    } catch (error) {
        console.error('Error replacing ads:', error);
    }
}

function handleInitialLoad() {
    try {
        replaceAds();

        const observer = new MutationObserver(handleMutations);
        document.removeEventListener('DOMContentLoaded', handleInitialLoad);

        const observeBody = () => {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            } else {
                requestAnimationFrame(observeBody);
            }
        };
        
        observeBody();
    } catch (error) {
        console.error('Error during initial load:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleInitialLoad);
} else {
    handleInitialLoad();
}
