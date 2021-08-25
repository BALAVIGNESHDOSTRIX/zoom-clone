const socket = io('/')


// peerjs config
var peer = new Peer(undefined, {
    path : '/peer',
    host: '/',
    port: 3031
})


const videogrid = document.getElementById('video_grid');
const myownvideo = document.createElement('video')
myownvideo.muted = true

let myVideoStream;

// Check devices to get PART-1
navigator.mediaDevices.getUserMedia(
    { video: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myownvideo, stream);

    // embed the other user video PART - 5
    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userid) =>{
        connectToNewUser(userid, stream);
    })
}).catch(err => console.log(err))

// Own video frame maker(listener) PART-2
const addVideoStream = (video, stream) => {
    video.srcObject =stream;
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })

    videogrid.append(video);
}



// join the room PART-3
peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})


// PART - 4
const connectToNewUser = (userid, stream) =>{
    // console.log("New user" + userid)

    // under logic goes upper peer.call func
    const call = peer.call(userid, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })

}


// chat message

let text = $('input')

$('html').keydown((e) => {
    if(e.which == 13 && text.val().length !== 0){
        console.log(text.val())
        socket.emit('message', text.val());
        text.val('');
    }
})


// captue the message from server
socket.on('createMessage', message => {
    // console.log("message is coming from the server: " + message)

    $('ul').append(`<li class='user_message'><br/>user</br>${message}</li>`)

    scrolltoBottom();
})

const scrolltoBottom = () => {
    var d = $('.main__right_chat_window')
    d.scrollTop(d.prop("scrollHeight"))
}

// Mute our video

const MuteUnmute = () => {
    const enbaled = myVideoStream.getAudioTracks()[0].enbaled;

    if(enbaled){
        myVideoStream.getAudioTracks()[0].enbaled = false;
        setUnmuteButton();
    }else{
        myVideoStream.getAudioTracks()[0].enbaled = true;
        setMuteButton();
    }
}

const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>`

    document.querySelector('.main__mute_button').innerHTML = html;
}


const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>`

    document.querySelector('.main__mute_button').innerHTML = html;

}


const playStop = () => {
    const videoDevice = myVideoStream.getVideoTracks()[0];

    if(videoDevice.enbaled){
        console.log("Google")
        // myVideoStream.getVideoTracks()[0].stop();
        myVideoStream.getVideoTracks()[0].enbaled = false;
        setPlayVideo();
    }else{
        setStopPlayVideo();
        // myVideoStream.getVideoTracks()[0].start();
        myVideoStream.getVideoTracks()[0].enbaled = true;
        
    }
}

const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>`

    document.querySelector('.main__video_button').innerHTML = html;
}


const setStopPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video"></i>
    <span>Stop Video</span>`

    document.querySelector('.main__video_button').innerHTML = html;
}

