function handleMutations(mutationsList) {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            replaceAds();
        }
    });
}

function replaceAds() {
    // Detect the ad preview element
    const adPreview = document.querySelector('div.ytp-preview-ad');
    const video = document.querySelector('video'); // Target ad video specifically

    if(video && !video.src)
    {
        video.style = "display:none;"
    }
    
    if (adPreview && video) {
        video.style = "display:none;"
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
}

function handleInitialLoad() {
    // Run replaceAds() immediately on page load to handle any ads already present
    replaceAds();

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(handleMutations);
    document.removeEventListener('DOMContentLoaded', handleInitialLoad);

    // Start observing the target node for configured mutations
    // Wait until document.body is available
    const observeBody = () => {
        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            requestAnimationFrame(observeBody);
        }
    };
    
    observeBody();
}


// Ensure handleInitialLoad is called as early as possible
if (document.readyState === 'loading') {  // Loading hasn't finished yet
    document.addEventListener('DOMContentLoaded', handleInitialLoad);

} else {  // `DOMContentLoaded` has already fired
    handleInitialLoad();
}

