document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".playlist-cards");
  const location = window.location.pathname;
  

  fetch("data/data.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network Error: " + response.status);
      return response.json();
    })
    .then((data) => {
      if (location.includes("index.html")) {
        data.playlists.forEach(createPlaylistTile);
      }
      else if (location.includes("featured.html")){
        //must be a random playlist
        const randomPl = Math.floor(Math.random() * data.playlists.length);
        createPlaylistFeature(data.playlists[randomPl]);
      }
    })
    .catch((err) => console.error("Failed to load playlists:", err));
  
  const modal = document.getElementById("myModal");
  const modalContent = document.querySelector(".modalContent");
  const modalImg = document.getElementById("modalImg");
  const modalName = document.getElementById("modalName");
  const modalAuthor = document.getElementById("modalAuthor");
  const modalSongs = document.querySelector(".modalList");
  const closeBtn = document.querySelector(".close");
  const modalShuffle = document.getElementById("shuffleBtn");

  const featuredSongs = document.getElementById("featuredList");

  // create playlist tiles
  function createPlaylistTile(pl) {
    const tile = document.createElement("div");

    //alr in my css - create the playlist div i created and styled
    tile.className = "playlist";

    // add everythings within the div using .innerHtml which affects the HTML using js instead of having to hard code it within the html structure
    tile.innerHTML = `
      <img class="playlistImg" src="${pl.playlist_art}" alt="${pl.playlist_name}"> 
      <div class="playlistInfo">
        <h2 class="playlistName">${pl.playlist_name}</h2>
        <h3 class="playlistAuthor">${pl.playlist_author}</h3>
        <div>
          <span class="heart-icon">&#10084;</span>
          <span class="likeCount">${pl.likes}</span>
        </div>
      </div>
    `;

    
    //open modal when clicking the title but anywhere BUT the heart
    tile.addEventListener("click", (e) => {
      if (!e.target.classList.contains("heart-icon")) {
        openModal(pl);
      }
    });
    
    // call the elements
    const heart = tile.querySelector(".heart-icon");
    const count = tile.querySelector(".likeCount");

    // okay now listen if the heart is clicked
    heart.addEventListener("click", (e) => {
      // further prevents heart from accidentally opening the modal
      // can only like and unlike
      // prevents event from affecting its parent elements
      e.stopPropagation();

      // next like tells js to convert this string to an int
      let n = parseInt(count.textContent, 10);

      // now add a class to the icon/element which will allow me to change the class and css styling
      if (heart.classList.contains("liked")) {
        heart.classList.remove("liked");
        count.textContent = --n;
      } else {
        heart.classList.add("liked");
        count.textContent = ++n;
      }
    });


    // add it to within my playlist css grid section
    container.appendChild(tile);
  }

  // need to open the modal
  function openModal(pl) {
    // make the modal show
    modal.style.display = "block";

    // make sure it is ready for animation
    modalContent.classList.remove("fade-out");
    // add the fadein animation
    modalContent.style.animation = "modalFadeIn 0.65s ease forwards";

    // need to call everything from the json the pl is the obj and you call the obj attribute and add it to its corresponding element that we created in the html 
    // these are the playlist DETAILS aka goes in the modal header so rewrite the place holder
    currentplaylist = pl;
    modalImg.src = pl.playlist_art;
    modalName.textContent = pl.playlist_name;
    modalAuthor.textContent = "Created by: " + pl.playlist_author;


    displaySongs(pl);
      // need to fix album and add it to json 
      // <h3 class="songTXT">Abulm: ${song.duration}</h3>

    

    // shuffle
    modalShuffle.addEventListener("click", (e) => {
      e.stopPropagation();
      shuffleSongs(currentplaylist);
      displaySongs(currentplaylist)
    });
    
  }

  function shuffleSongs(pl){
    for (let i = pl.songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pl.songs[i], pl.songs[j]] = [pl.songs[j], pl.songs[i]];
    }
  }

  function displaySongs (pl){
    // okay this will hold what i want the html to look like for the songs - this will hold every div and put it within my modalList
    let songListHTML = "";

    // the json obj has a song array, i want to iterate over it
    pl.songs.forEach(song => {
      songListHTML += `
        <div class="songs">
          <img class="songImg" src=${song.songPic} alt="Song cover">
          <div class="songDetails">
            <h3 class="songTXT">${song.title}</h3>
            <h3 class="songTXT">${song.artist}</h3>
          </div>
          <h3 class="songTime">${song.duration}</h3>
        </div>
      `;
    });


    // insert it all at once to my html file
    if (location.includes("index.html")) {
        modalSongs.innerHTML = songListHTML;
      }
      else if (location.includes("featured.html")){
        featuredSongs.innerHTML = songListHTML;
      }
  }


  function closeModal() {
    modalContent.classList.add("fade-out");
    setTimeout(() => {
      modal.style.display = "none";
      modalContent.classList.remove("fade-out");
    }, 300); 
  }

  function createPlaylistFeature(pl){
    const featuredContainer = document.querySelector(".featuredPlaylistCont");
    const featuredList = document.getElementById("featuredList");

    // Remove any previous graphicsCont
    const oldGraphics = featuredContainer.querySelector(".graphicsCont");
    if (oldGraphics) oldGraphics.remove();

    const graphicsCont = document.createElement("div");
    graphicsCont.className = "graphicsCont";

    graphicsCont.innerHTML = `
      <img class="playlistImg" src="${pl.playlist_art}" alt="${pl.playlist_name}"> 
      <div id = "featuredDeets" class="playlistInfo">
        <h2 id="featuredName" class="playlistName">${pl.playlist_name}</h2>
        <h3 id="featuredAuthor" class="playlistAuthor">${pl.playlist_author}</h3>
      </div>
      <button id="FeaturedshuffleBtn">Choose Another</button>
    `;

    // Insert the graphics/header before the song list
    featuredContainer.insertBefore(graphicsCont, featuredList);

    displaySongs(pl);
    
    // shuffle
    const featuredShuffle = document.getElementById("FeaturedshuffleBtn");
    featuredShuffle.addEventListener("click", (e) => {
      e.stopPropagation();
      // Pick a new random playlist that is not the current one
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * data.playlists.length);
      } while (data.playlists[newIndex].playlist_name === pl.playlist_name && data.playlists.length > 1);
      createPlaylistFeature(data.playlists[newIndex]);
    });
  }

  // close the modal if the user clicks on the background
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // close the modal if the user clicks the x button
  closeBtn.addEventListener("click", () => {
    closeModal();
  });



});





