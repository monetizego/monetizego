// Load the IMA SDK script dynamically
var script = document.createElement('script');
script.src = 'https://imasdk.googleapis.com/js/sdkloader/ima3.js';
script.onload = function() {
    // IMA SDK script loaded, call function to initialize ads
    initAds();
};
document.head.appendChild(script);

// Function to initialize ads
function initAds() {
    // Function to load the IMA SDK and initialize ads
    function loadAds() {
        // Check if the IMA SDK script has been loaded
        if (window.google && window.google.ima) {
            // IMA SDK is already loaded, initialize ads
            initAds();
        } else {
            // Load the IMA SDK script dynamically
            var script = document.createElement('script');
            script.src = imaSdkScriptUrl;
            script.onload = function() {
                // IMA SDK script loaded, initialize ads
                initAds();
            };
            document.head.appendChild(script);
        }
    }

    // Function to initialize ads
    function initAds() {
        // Create a new instance of the IMA SDK AdDisplayContainer
        var adDisplayContainer = new google.ima.AdDisplayContainer(
            document.getElementById('ad-container'),
            document.getElementById('video-player')
        );

        // Initialize the IMA SDK
        var adsLoader = new google.ima.AdsLoader(adDisplayContainer);

        // Register event listeners for the ads loader
        adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false);
        adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false);

        // Request video ads
        var adsRequest = new google.ima.AdsRequest();
        adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/22724712014,21720049534/kwords/marieclaire.fr/marieclaire.fr_video&description_url=https%3A%2F%2Fwww.marieclaire.fr%2F&tfcd=0&npa=0&sz=300x169%7C300x250%7C400x300%7C640x480&gdfp_req=1&unviewed_position_start=1&output=vast&env=vp&impl=s&correlator=&vad_type=linear'; // Replace with your ad tag URL

        // Load the ads request
        adsLoader.requestAds(adsRequest);
    }

    // Function to handle when ads manager is loaded successfully
    function onAdsManagerLoaded(adsManagerLoadedEvent) {
        // Get the ads manager
        var adsRenderingSettings = new google.ima.AdsRenderingSettings();
        adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
        var adsManager = adsManagerLoadedEvent.getAdsManager(
            document.getElementById('video-player'), adsRenderingSettings
        );

        // Start playing the ad
        adsManager.init(/* width, height, viewMode,*/ false, function () {
            adsManager.start();
        });
    }

    // Function to handle ad loading errors
    function onAdError(adErrorEvent) {
        console.log('Ad error: ' + adErrorEvent.getError());
    }

    // Check if video ad is available
    var videoAdAvailable = true; // Assuming videoAdAvailable is a boolean variable indicating whether video ad is available

    if (videoAdAvailable) {
        // Load video ad
        document.getElementById("video-player").style.display = "block"; // Show video player
        document.getElementById("banner-ad").style.display = "none"; // Hide banner ad
        // Load ads
        loadAds();
    } else {
        // Create banner ad container
        var bannerAdContainer = document.createElement('div');
        bannerAdContainer.id = 'banner-ad';
        
        // Append banner ad container to the ad container
        document.getElementById("ad-container").appendChild(bannerAdContainer);

        // Load banner ad tag
        var bannerAdScript = document.createElement('script');
        bannerAdScript.src = 'https://securepubads.g.doubleclick.net/tag/js/gpt.js';
        document.getElementById("banner-ad").appendChild(bannerAdScript);

        var bannerAdDiv = document.createElement('div');
        bannerAdDiv.id = 'gpt-passback';
        document.getElementById("banner-ad").appendChild(bannerAdDiv);

        var bannerAdScript2 = document.createElement('script');
        bannerAdScript2.innerHTML = `
            window.googletag = window.googletag || {cmd: []};
            googletag.cmd.push(function() {
            googletag.defineSlot('/22724712014,21720049534/kwords/marieclaire.fr/marieclaire.fr_300x250', [[336, 280], [300, 250]], 'gpt-passback').addService(googletag.pubads());
            googletag.pubads().set("page_url", "https://www.marieclaire.fr/");
            googletag.enableServices();
            googletag.display('gpt-passback');
            });
        `;
        document.getElementById("banner-ad").appendChild(bannerAdScript2);

        document.getElementById("video-player").style.display = "none"; // Hide video player
        document.getElementById("banner-ad").style.display = "block"; // Show banner ad
    }
}
