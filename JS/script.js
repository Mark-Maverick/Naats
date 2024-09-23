let currentNaat = new Audio();
let naats = []
let currentNaatIndex = -1;
var currentFolder = '';
var folders = []
let naatFolder;
let curF;



window.addEventListener('load', () => {
    let preloader = document.querySelector('.preloader'); // Fixed typo in class name
    setTimeout(() => {
        preloader.style.opacity = "0";
        // Wait for the fade-out transition to complete before removing
        preloader.addEventListener('transitionend', () => {
            preloader.style.display = "none"; // Remove it from the layout
        });
    }, 1500);
});



// handling the dialog
let dialog = document.querySelector("dialog")
let dp = document.querySelector('#dp')
let dialogCross = document.querySelector('.dialogCross')
dp.addEventListener("click", ()=>{
    dialog.showModal()
})
dialogCross.addEventListener("click", ()=>{
    dialog.close()
})




// responsiveNess
let ham = document.querySelector(".ham")
ham.addEventListener('click', () => {
    // console.log("ham was clciked sir")
    document.querySelector(".left").style.left = "0%";
})
let cross = document.querySelector(".cross")
cross.addEventListener('click', () => {
    // console.log("cross was clciked sir")
    document.querySelector(".left").style.left = "-120%";
})




// Function to dynamically set the current folder
function setCurrentFolder(folder) {
    currentFolder = folder;
}







async function getFolders() {
    folders = [];
    let a = await fetch('/naats/Artists');
    let response = await a.text()
    // console.log(response)
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    // console.log(as)


    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.includes('/Artists/')) {
            // console.log(element.href)
            folders.push(element.href)
            // console.log(currentFolder)


        }

    }
    return folders;
}



// getting albums
async function getAlbums() {
    folders = [];
    let a = await fetch('/naats/Albums');
    let response = await a.text()
    // console.log(response)
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')
    // console.log(as)


    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.includes('/Albums/')) {
            // console.log(element.href)
            folders.push(element.href)
            // console.log(currentFolder)


        }

    }
    return folders;
}








async function displayArtists() {
    await getFolders();
    folders.forEach(async (e, index) => {
        let folder = folders[index]
        // console.log(folder.split("/")[5].replaceAll("%20", " "))
        setCurrentFolder(`naats/Artists/${folder.split("/")[5].replaceAll("%20", " ")}`)
        // console.log(currentFolder)
        // console.log(e)
        let a = await fetch(`${currentFolder}/info.json`)
        let response = await a.json()
        // console.log(response)
        // console.log(response.tittle)
        // console.log(response.Description)
        let newfolder = `naats/Artists/${e.split('/')[5].replaceAll('%20', ' ')}`;
        // console.log(newfolder)
        document.querySelector('.artists').innerHTML += `<div data-folder="${newfolder}" class="aCard">
            <img class="aImg" src = "../${newfolder}/cover.jpg"></img>
            <div class="aName">
            <h4 class='name'>${response.tittle}</h4>
            </div>
            <div class="greyed description">${response.Description}</div>
            <img class="hoverPlay" src="images/hoverPlay.svg" alt="svg icon">
            </div>`
    })

}



// displaying albums
async function displayAlbums() {
    await getAlbums();
    folders.forEach(async (e, index) => {
        let folder = folders[index]
        // console.log(folder.split("/")[5].replaceAll("%20", " "))
        setCurrentFolder(`naats/Albums/${folder.split("/")[5].replaceAll("%20", " ")}`)
        // console.log(currentFolder)
        // console.log(e)
        let a = await fetch(`${currentFolder}/info.json`)
        // console.log(currentFolder)
        let response = await a.json()
        // console.log(response)
        // console.log(response.tittle)
        // console.log(response.Description)
        let newfolder = `naats/Albums/${e.split('/')[5].replaceAll('%20', ' ')}`;
        // console.log(newfolder)
        document.querySelector('.songCards').innerHTML += `<div data-folder="${newfolder}" class="sCard">
                        <img src="../${newfolder}/cover.jpg" alt="" class="cover">
                        <div class="sHeading">
                            <h4>${response.tittle}</h4>
                        </div>
                        <div class="sArtistName greyed">${response.Description}</div>
                        <img class="hoverPlay" src="images/hoverPlay.svg" alt="svg icon">
                    </div>`
    })

}



// used to get naats
async function getNaats(folder) {
    naatFolder = folder
    // console.log(naatFolder)
    document.querySelector(".playlist").innerHTML = '';
    currentNaatIndex = -1; // Reset index when loading a new playlist
    currentPlaylist = [];
    let a = await fetch(`${folder}`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            naats.push(element.href)
            currentPlaylist.push(element.href);
            var tittle = element.href.split("/")[6].replaceAll("%20", " ")
            // console.log(tittle)
            var artist = element.href.split("/")[5].replaceAll("%20", " ")
            var dtittle = element.href.split('/')[6].replaceAll("%20", " ").replace(".mp3", " ")
            // console.log(dtittle)
            document.querySelector(".playlist").innerHTML += `<div class="song">
            <img src="images/music.svg" alt="Music Icon" />
            <div class="sInfo">
            <p class="sTittle">${dtittle}</p>
            <p class="sArtist">${artist}</p>
            </div>
            <img class="sPlay" src="images/play.svg" alt="Play Icon" />
            </div>`;
        }
    }
    curF = "Artists"
    let naatList = Array.from(document.querySelector(".playlist").querySelectorAll('.song'))
    // console.log(naatList)
    naatList.forEach((e, index) => {
        let naat = `${e.querySelector(".sTittle").innerHTML.trim()}.mp3`;
        let artist = e.querySelector(".sArtist").innerHTML;
        e.addEventListener('click', () => { // click eventlistner added to the songs of the playlist to play them
            playNaat(naat, artist, index, curF)
        })
    })

}






async function getAlbumNaats(folder) {
    naatFolder = folder
    // console.log(naatFolder)
    document.querySelector(".playlist").innerHTML = '';
    currentNaatIndex = -1; // Reset index when loading a new playlist
    currentPlaylist = [];
    let a = await fetch(`${folder}`)
    let response = await a.text()
    let div = document.createElement('div')
    div.innerHTML = response
    let as = div.getElementsByTagName('a')

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')) {
            naats.push(element.href)
            // console.log(element.href)
            currentPlaylist.push(element.href);
            var altittle = element.href.split("/")[6].replaceAll("%20", " ")
            // console.log(tittle)
            var alartist = element.href.split("/")[5].replaceAll("%20", " ")
            var datittle = element.href.split('/')[6].replaceAll("%20", " ").replace(".mp3", " ")
            // console.log(dtittle)
            document.querySelector(".playlist").innerHTML += `<div class="song">
            <img src="images/music.svg" alt="Music Icon" />
            <div class="sInfo">
            <p class="sTittle">${datittle}</p>
            <p class="sArtist">${alartist}</p>
            </div>
            <img class="sPlay" src="images/play.svg" alt="Play Icon" />
            </div>`;
        }
    }
    curF = "Albums"
    let naatList = Array.from(document.querySelector(".playlist").querySelectorAll('.song'))
    // console.log(naatList)
    naatList.forEach((e, index) => {
        // console.log(e)
        // console.log(e.querySelector(".sTittle"))
        
        let naat = `${e.querySelector(".sTittle").innerHTML.trim()}.mp3`;
        // console.log(naat)
        let artist = e.querySelector(".sArtist").innerHTML;
        // console.log(artist)
        e.addEventListener('click', () => { // click eventlistner added to the songs of the playlist to play them
            playNaat(naat, artist, index, curF)
        })
    })

}







// load naats
async function loadNaats() {
    await displayArtists()
    // console.log("laodNaats working Sir")
    setTimeout(() => {


        let aCards = Array.from(document.querySelector(".artists").querySelectorAll('.aCard'))
        //  console.log(aCards)
        aCards.forEach((element) => {
            element.addEventListener('click', (e) => {
                let nowFolder = e.currentTarget.dataset.folder
                getNaats(`${nowFolder}`)
            })
        })
    }, 100);
}



// loading naats from albums
async function loadAlbumNaats() {
    await displayAlbums()
    // console.log("laodNaats working Sir")
    setTimeout(() => {


        let sCards = Array.from(document.querySelector(".songCards").querySelectorAll('.sCard'))
        //  console.log(aCards)
        sCards.forEach((element) => {
            // console.log(element)
            element.addEventListener('click', (e) => {
                // console.log(e)
                let fornowFolder = e.currentTarget.dataset.folder
                getAlbumNaats(`${fornowFolder}`)
            })
        })
    }, 100);
}




// funtion being used to play naats
function playNaat(naat, artist, index, curF) {
    currentNaat.src = `/naats/${curF}/${artist}/` + naat;
    // console.log(currentNaat.src)
    currentNaat.play()
    currentNaatIndex = index;
    document.querySelector(".play").innerHTML = `<img src="images/pause.svg" alt="svg icon">`
    document.querySelector('.cursongName').innerHTML = naat.replace('.mp3', ' ');
    document.querySelector('.cursongArtist').innerHTML = artist;
    updatePlaylistIcons();
}






function updatePlaylistIcons() {
    let naatList = Array.from(document.querySelector(".playlist").querySelectorAll('.song'));

    naatList.forEach((e, index) => {
        let playIcon = e.querySelector(".sPlay");

        // If the current naat is playing, show pause icon for it
        if (index === currentNaatIndex && !currentNaat.paused) {
            playIcon.src = "images/pause.svg";
        } else {
            playIcon.src = "images/play.svg";
        }
    });
}

// Adding an event listener for when the naat finishes playing
currentNaat.addEventListener('ended', () => {
    document.querySelector(".play").innerHTML = `<img src="images/play.svg" alt="svg icon">`;
    updatePlaylistIcons(); // Reset the play/pause icon when the song ends
});

// Adding a timeupdate event listener to sync the icons while playing
currentNaat.addEventListener('timeupdate', () => {
    updatePlaylistIcons();
});





// function to convet seconds to minute seconds in the format 00:00
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')
    return `${formattedMinutes}:${formattedSeconds}`;
}





// timeupdate event
currentNaat.addEventListener('timeupdate', () => {
    document.querySelector(".duration").innerHTML = `${secondsToMinutesSeconds(currentNaat.currentTime)}/${secondsToMinutesSeconds(currentNaat.duration)}`
    document.querySelector("#dur").value = ((currentNaat.currentTime) / (currentNaat.duration)) * 100 // progress bar update
})

//adding event linstner to the play button
{
    let play = document.querySelector(".play")
    play.addEventListener('click', () => {
        if (currentNaat.paused) {
            currentNaat.play()
            play.innerHTML = `<img src="images/pause.svg" alt="svg icon"></img>`
        }
        else {
            currentNaat.pause()
            play.innerHTML = `<img src="images/play.svg" alt="svg icon"></img>`
        }
    })

}



        //adding eventlistner to previous

        let previous = document.querySelector('.previous');
        previous.addEventListener('click', () => {
            // console.log('Previous button clicked sir');
            if (currentNaatIndex > 0) {
                currentNaatIndex--;
                let prevNaatUrl = currentPlaylist[currentNaatIndex];
                // console.log(prevNaatUrl)
                let artist = prevNaatUrl.split("/")[5].replaceAll("%20", " ");
                let naat = prevNaatUrl.split("/")[6].replaceAll("%20", " ");
                playNaat(naat, artist, currentNaatIndex, curF);
            }
        });


    // adding an eventlistner to the next button

        let next = document.querySelector(".next")
        next.addEventListener('click', () => {
            // console.log('next button clicked sir');
        if (currentNaatIndex < currentPlaylist.length - 1) {
            currentNaatIndex++;
            let nextNaatUrl = currentPlaylist[currentNaatIndex];
            let artist = nextNaatUrl.split("/")[5].replaceAll("%20", " ");
            let naat = nextNaatUrl.split("/")[6].replaceAll("%20", " ");
            playNaat(naat, artist, currentNaatIndex, curF);
        }
        })




// Add an event listener for when the naat finishes playing
currentNaat.addEventListener('ended', () => {
    document.querySelector(".play").innerHTML = `<img src="images/play.svg" alt="svg icon"></img>`;
});



// adding a event to body to listen keypress
{
    document.body.addEventListener('keydown', (event) => {
        // To play and pause with space key
        if (event.code === 'Space' || event.key === ' ') {
            event.preventDefault();
            if (currentNaat.paused) {
                currentNaat.play()
                document.querySelector(".play").innerHTML = `<img src="images/pause.svg" alt="svg icon"></img>`
            }
            else {
                currentNaat.pause()
                document.querySelector(".play").innerHTML = `<img src="images/play.svg" alt="svg icon"></img>`
            }
        }
        // console.log(event)
        // To volume up with Arrow up
        if (event.code === "ArrowUp") {
            event.preventDefault();
            if (currentNaat.volume < 1) {
                currentNaat.volume = Math.min(currentNaat.volume + 0.05, 1);
                document.querySelector("#vol").value = currentNaat.volume * 100;
            }
        }
        // To volume down with Arrow down
        if (event.code === "ArrowDown") {
            event.preventDefault();
            if (currentNaat.volume > 0) {
                currentNaat.volume = Math.max(currentNaat.volume - 0.05, 0);
                document.querySelector("#vol").value = currentNaat.volume * 100;
            }
        }


        // Increase duration by 5 seconds with Arrow Right
        if (event.code === "ArrowRight") {
            event.preventDefault();
            // Ensure that we don't go beyond the duration of the naat
            if (currentNaat.currentTime + 5 <= currentNaat.duration) {
                currentNaat.currentTime += 5;
            } else {
                currentNaat.currentTime = currentNaat.duration; // Set to end if it's close
            }
        }

        // Decrease duration by 5 seconds with Arrow Left
        if (event.code === "ArrowLeft") {
            event.preventDefault();
            // Ensure that we don't go below 0 seconds
            if (currentNaat.currentTime - 5 >= 0) {
                currentNaat.currentTime -= 5;
            } else {
                currentNaat.currentTime = 0; // Set to start if it's below
            }
        }



        // Adding keyboard controls for 'j' (previous) and 'k' (next)
        if (event.code === 'KeyJ') {
            event.preventDefault(); // Prevent default action
            if (currentNaatIndex > 0) {
                currentNaatIndex--;
                let prevNaatUrl = currentPlaylist[currentNaatIndex];
                // console.log(prevNaatUrl)
                let artist = prevNaatUrl.split("/")[5].replaceAll("%20", " ");
                let naat = prevNaatUrl.split("/")[6].replaceAll("%20", " ");
                playNaat(naat, artist, currentNaatIndex, curF);
            }
        }

        if (event.code === 'KeyK') {
            event.preventDefault(); // Prevent default action
            if (currentNaatIndex < currentPlaylist.length - 1) {
                currentNaatIndex++;
                let nextNaatUrl = currentPlaylist[currentNaatIndex];
                let artist = nextNaatUrl.split("/")[5].replaceAll("%20", " ");
                let naat = nextNaatUrl.split("/")[6].replaceAll("%20", " ");
                playNaat(naat, artist, currentNaatIndex, curF);
            }
        }




        // added event listner on m key to mute and unmute
        if (event.code === "KeyM" || event.key === 'm' || event.key === 'M') {
            volSVG = document.querySelector(".volume")
            event.preventDefault();
            if (currentNaat.volume != 0) {
                currentNaat.volume = 0;
                document.querySelector("#vol").value = 0
                volSVG.innerHTML = `<img src="images/mute.svg" alt="svg icon">`
            }
            else {
                document.querySelector("#vol").value = 50
                currentNaat.volume = 0.5
                volSVG.innerHTML = `<img src="images/volume.svg" alt="svg icon">`
            }
        }


    })
}







//volume control

{
    let vol = document.querySelector("#vol")
    vol.addEventListener('input', () => {
        currentNaat.volume = (vol.value) / 100;
    })
}

// adding evenlistner to the volume svg
{
    let volSVG = document.querySelector('.volume')
    volSVG.addEventListener('click', () => {
        if (currentNaat.volume != 0) {
            currentNaat.volume = 0;
            document.querySelector("#vol").value = 0
            volSVG.innerHTML = `<img src="images/mute.svg" alt="svg icon">`
        }
        else {
            document.querySelector("#vol").value = 50
            currentNaat.volume = 0.5
            volSVG.innerHTML = `<img src="images/volume.svg" alt="svg icon">`
        }
    })
}


//duration control and sync
{
    let dur = document.querySelector("#dur")
    dur.addEventListener('input', () => {
        let newTime = dur.value * currentNaat.duration / 100

        if (currentNaat.paused && newTime << currentNaat.duration) {
            document.querySelector(".play").innerHTML = `<img src="images/pause.svg" alt="svg icon">`;
            currentNaat.play()
            
        }
        currentNaat.currentTime = newTime
    })
}






// main function
async function main() {
    await loadNaats()
    await loadAlbumNaats()
    if (folders.length > 0) {
        getAlbumNaats(folders[0]); // Load the first folder
    }


    let naatList = Array.from(document.querySelector(".playlist").querySelectorAll('.song'))
    naatList.forEach((e, index) => {
        let naat = `${e.querySelector(".sTittle").innerHTML.trim()}.mp3`;
        let artist = e.querySelector(".sArtist").innerHTML;
        e.addEventListener('click', () => {
            playNaat(naat, artist, index, curF);
        });
    });

}

main()
