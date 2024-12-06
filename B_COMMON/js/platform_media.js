function stopStreamedVideo(videoElem) {
    const stream = videoElem.srcObject;
    const tracks = stream.getTracks();
  
    tracks.forEach(function(track) {
      track.stop();
    });
  
    videoElem.srcObject = null;
  }
 
async function playVideoFromCamera() {
    try {
        const constraints = {'video': true, 'audio': true};
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = document.querySelector('video#localVideo');
        videoElement.srcObject = stream;
    } catch(error) {
        console.error('Error opening video camera.', error);
    }
}
function onclick_mediabar (elt, event) {
    let cmedia  = solution.get('media')
    
    var checked = $(elt).prop('checked');    
    $(elt).prop('checked', !checked);   
  
    const videoElement = document.querySelector('#mediavideopanel');  
    
    if (checked) {
        stopStreamedVideo(videoElement)
        
    } else {
        cmedia.get_video().then (video => {
            videoElement.srcObject = video;
            console.log (cmedia.video);
        })
    }
}
