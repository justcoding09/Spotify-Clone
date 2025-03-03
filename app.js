let currentSong = new Audio();
let songs = [];
async function getSongs() {
    try {
        let response = await fetch("file:///C:/Users/Rufi_/Desktop/Small%20Projects/Spotify-Clone/songs/");
        let data = await response.text();
        // console.log(data);  // This should log the array of song objects
        let div = document.createElement('div');
        div.innerHTML = data;
        let as = div.getElementsByTagName("a");
        for (let i = 0; i < as.length; i++) {
            let element = as[i];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href);
            }
        }
        return songs;
    } catch (error) {
        console.log("Error fetching songs:", error);
    }
}
function convertSecondsToMinutes(seconds) {
    // Calculate the minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);

    // Format the result as "minutes:seconds"
    return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}
function getImageSrcByAlt(altText) {
    const images = document.querySelectorAll('img');
    for (let img of images) {
        if (img.alt === altText) {
            return img.src;
        }
    }
    return null; // Return null if no image with the given alt is found
}
function updateSong(songName) {
    if (songName.endsWith('.mp3')) {
        let finalsongname = songName.slice(songName.lastIndexOf('/') + 1);
        finalsongname = finalsongname.replaceAll("%20", " ");
        finalsongname = finalsongname.slice(0, finalsongname.indexOf('.'));
        songName = finalsongname;
    }
    document.querySelector('#songImage').src = getImageSrcByAlt(songName);
    document.querySelector('#title').innerHTML = `${songName}`;
}
const playMusic = (songName, image) => {
   // http://127.0.0.1:5500/songs/Zaalima.mp3
   console.log('file:///C:/Users/Rufi_/Desktop/Small%20Projects/Spotify-Clone/songs/' + songName + '.mp3');
    currentSong.src = ('file:///C:/Users/Rufi_/Desktop/Small%20Projects/Spotify-Clone/songs/' + songName + '.mp3');
    currentSong.play();
    updateSong(songName);
}
let cards = document.querySelectorAll('.card');
function updateTitle() {
    cards.forEach((card) => {
        card.querySelector('.name').innerHTML = `${card.querySelector('img').alt}`;
    })
}
async function main() {
    let songs = await getSongs();
    updateTitle();
    let onlyonce=false;
    // let prevbar=document.querySelector('.preview');
    // let playbar=document.createElement('div');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            let song = card.querySelector('img');
            playMusic(song.alt);
            updateSong(song.alt);
            document.querySelector('#play').src = "Spotify images/output.png";

            if(!onlyonce){
            document.querySelector('.preview').remove();
            document.querySelector('.playbar-section').classList.add('preview');
            onlyonce=true;
            }
        });
    })

    //play-pause the song
    let play = document.querySelector('#play');
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "Spotify images/output.png";
        }
        else {
            currentSong.pause();
            play.src = "Spotify images/player_icon3.png";
        }
    })

    currentSong.addEventListener('timeupdate', () => {
        if (!isNaN(currentSong.currentTime) && !isNaN(currentSong.duration)) {
            document.querySelector('#time').innerHTML = `${convertSecondsToMinutes(currentSong.currentTime)}/${convertSecondsToMinutes(currentSong.duration)}`;
            document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        }
    })

    document.querySelector('.seekbar').addEventListener('click', (e) => {
        //very imp
        let progress = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = `${progress}` + "%";
        currentSong.currentTime = (currentSong.duration * progress) / 100;//song update due to bar 


        document.querySelector('.circle').style.borderColor = 'crimson';
    })

    let prev = document.querySelector('#previous');
    let next = document.querySelector('#next');

    prev.addEventListener('click', () => {
        let currentSongName = currentSong.src.split('/').pop().split('.')[0];
        // Find the index of the current song in the songs array
        let index = songs.indexOf(`file:///C:/Users/Rufi_/Desktop/Small%20Projects/Spotify-Clone/songs/${currentSongName}.mp3`);
        //finding next song
        let nextsong = songs[(index - 1 + songs.length) % songs.length];
        updateSong(nextsong);
        currentSong.src = nextsong;
        currentSong.play();
        check();
    })
    next.addEventListener('click', () => {
        let currentSongName = currentSong.src.split('/').pop().split('.')[0];
        // Find the index of the current song in the songs array
        let index = songs.indexOf(`file:///C:/Users/Rufi_/Desktop/Small%20Projects/Spotify-Clone/songs/${currentSongName}.mp3`);
        //finding next song
        let nextsong = songs[(index + 1) % songs.length];
        updateSong(nextsong);
        currentSong.src = nextsong;
        currentSong.play();
        check();
    })

    document.querySelector('#loop').addEventListener('click',()=>{
        currentSong.currentTime=0;
        if(!currentSong.played())
        currentSong.play();
        check();
    })

    document.querySelector('.range').addEventListener('change',(e)=>{
        currentSong.volume=parseInt(e.target.value)/100;
    })

    function check(){
        if (currentSong.paused) {
            currentSong.play();
            play.src = "Spotify images/output.png";
        }
        else {
            currentSong.pause();
            play.src = "Spotify images/player_icon3.png";
        }    
    }
}
main();

