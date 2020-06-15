
var video            = document.querySelector('#sharedscreen');
var button           = document.querySelector('#share_screen');
var textarea         = document.querySelector('#capabilities');
var settings         = document.querySelector('#settings');
var aspectRatio      = document.querySelector('#aspectRatio');
var frameRate        = document.querySelector('#frameRate');
var resolutions      = document.querySelector('#resolutions');
var cursor           = document.querySelector('#cursor');
var displaySurface   = document.querySelector('#displaySurface');
var logicalSurface   = document.querySelector('#logicalSurface');
var yourVideo   = document.getElementById("yourVideo");
// var videoKind        = document.querySelector('#videoKind');

button.onclick = function() {
    this.disabled = true;
    
    invokeGetDisplayMedia(function(screen) {
        addStreamStopListener(screen, function() {
            //location.reload();
            showMyFace();
            showFriendsFace();
        });
        
        yourVideo.srcObject = screen;
       // pc.addStream(screen);
        stream = pc.addStream(screen);
       showFriendsFace();
        var _capabilities = screen.getTracks()[0].getCapabilities();
        capabilities.value = 'capabilities:\n\n' + JSON.stringify(_capabilities, null, '\t');
        capabilities.style.display = '';

        var _settings = screen.getTracks()[0].getSettings();
        settings.value = 'settings:\n\n' + JSON.stringify(_settings, null, '\t');
        settings.style.display = '';
    }, function(e) {
        button.disabled = false;

        var error = {
            name: e.name || 'UnKnown',
            message: e.message || 'UnKnown',
            stack: e.stack || 'UnKnown'
        };

        if(error.name === 'PermissionDeniedError') {
            if(location.protocol !== 'https:') {
                error.message = 'Please use HTTPs.';
                error.stack   = 'HTTPs is required.';
            }
        }

        console.error(error.name);
        console.error(error.message);
        console.error(error.stack);

        alert('Unable to capture your screen.\n\n' + error.name + '\n\n' + error.message + '\n\n' + error.stack);
    });
};

if(!navigator.getDisplayMedia && !navigator.mediaDevices.getDisplayMedia) {
    var error = 'Your browser does NOT supports getDisplayMedia API.';
    document.querySelector('h1').innerHTML = error;
    document.querySelector('h1').style.color = 'red';

    document.querySelector('video').style.display = 'none';
    button.style.display = 'none';
    throw new Error(error);
}

function invokeGetDisplayMedia(success, error) {
    var videoConstraints = {};

    if(aspectRatio.value !== 'default') {
        videoConstraints.aspectRatio = aspectRatio.value;
    }

    if(frameRate.value !== 'default') {
        videoConstraints.frameRate = frameRate.value;
    }

    if(cursor.value !== 'default') {
        videoConstraints.cursor = cursor.value;
    }

    if(displaySurface.value !== 'default') {
        videoConstraints.displaySurface = displaySurface.value;
    }

    if(logicalSurface.value !== 'default') {
        videoConstraints.logicalSurface = true;
    }

    if(resolutions.value !== 'default') {
        if (resolutions.value === 'fit-screen') {
            videoConstraints.width = screen.width;
            videoConstraints.height = screen.height;
        }

        if (resolutions.value === '4K') {
            videoConstraints.width = 3840;
            videoConstraints.height = 2160;
        }

        if (resolutions.value === '1080p') {
            videoConstraints.width = 1920;
            videoConstraints.height = 1080;
        }

        if (resolutions.value === '720p') {
            videoConstraints.width = 1280;
            videoConstraints.height = 720;
        }

        if (resolutions.value === '480p') {
            videoConstraints.width = 853;
            videoConstraints.height = 480;
        }

        if (resolutions.value === '360p') {
            videoConstraints.width = 640;
            videoConstraints.height = 360;
        }

        /*
        videoConstraints.width = {
            exact: videoConstraints.width
        };

        videoConstraints.height = {
            exact: videoConstraints.height
        };
        */
    }

    if(!Object.keys(videoConstraints).length) {
        videoConstraints = true;
    }

    var displayMediaStreamConstraints = {
        video: videoConstraints
    };

    if(navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia(displayMediaStreamConstraints).then(success).catch(error);
    }
    else {
        navigator.getDisplayMedia(displayMediaStreamConstraints).then(success).catch(error);
    }
}

function addStreamStopListener(stream, callback) {
    stream.addEventListener('ended', function() {
        callback();
        callback = function() {};
    }, false);
    stream.addEventListener('inactive', function() {
        callback();
        callback = function() {};
    }, false);
    stream.getTracks().forEach(function(track) {
        track.addEventListener('ended', function() {
            callback();
            callback = function() {};
        }, false);
        track.addEventListener('inactive', function() {
            callback();
            callback = function() {};
        }, false);
    });
}