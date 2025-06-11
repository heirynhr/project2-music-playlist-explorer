document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".playlist-cards");
  const location = window.location.pathname;
  

  fetch("data/data.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network Error: " + response.status);
      return response.json();
    })
    .then((data) => {
      if (location.includes("featured.html")){
        //must be a random playlist
        const randomPl = Math.floor(Math.random() * data.playlists.length);
        createPlaylistFeature(data.playlists[randomPl], data.playlists);
      }
      else{
        data.playlists.forEach(createPlaylistTile);
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
  const pageFoot = document.querySelector("footer");

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
    modalContent.style.animation = "modalFadeIn 0.8s ease forwards";

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
    //<img class="songImg" src=${song.songPic} alt="Song cover">
    pl.songs.forEach(song => {
      songListHTML += `
        <div class="songs">
          <img class="songImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEjklEQVR4nO2dz2tcVRTHvzYLtf7YuKj218w5M6G1UndaEWGYd87Egr8QCSq49g/wH4iIphYRqqKlBV1kYXWjIoi4UNw3ibiyovVHWt2YFBeiaQoZufc1aEnTJM27c+99cz5wITCZee+e8879cc655wGGYRiGYRiGYRiGYRiGYRiGYaA1tgesz4L0JbB8CJZvQHoWLBdActE3/7eeBeksSD8o/7d4xn/X2CzjI2j2xsByEiQ/gLW/peZ+g/QEqOgBE9tMH2vBuhekR0F6fstCX1MZeh4kr/prGZcZFQbpGyBZDCb41YpYAssUGmP7h1cPO3q3+KeR9NLABL9aEZe88tuHb8dQQfIUWH6LJvirDU3cexK1p334Rv/ExRY4r9VkCrsfuBm1pNlt+CVkdCHretYwW7/la0PvBslcdOHyhi3hd1BxL2pBs3cILAvxhaqbVcICqLgfWdPq3pOn8HWl/ZmvJbQ7u8H6awJC7G95heTmrwxXO7PRhceVtW/R6NyEbCA5noDQ+hVbwpvIZ5OVgMA4QGvJE0iafQ/eFtSZxtGt4BwOdG5FspAcC9T5v0H6STm0yadg+SueIuQ1JEmzuy+IY430czQ6d15xrT26EyQfRbKCJbS7LSQHyXvVd1amr7H6uAEkL5Su5YFbwUkkGEypXhBNfXwD135o4J5VFwZNyl/kIlkhOrpf7tjY9YsdIPlywJZwBGkwPhJs5bMpxkfAOgnW5QFZwVwaMWYfQA/UyeuB9ZEB+p8E0XETUkoKcOztkZ/Aw1vBcUSH9MfkFDC46NsZJJA0Fa6DVUC954Ju3JzXNxouYy11BThYD4L1+yD32JKnEQ2fApiBAlb8VD61sfL7nEA0wnSoH0QBK7Tk+TKftKJ7JHkf0QgddAlFuXu+UJECpoPd5/odkZ+zVICDe0U1mzb5CdEgnc9WAQ7Sr7ZuAfoHolHlWMoRFMDycgVD0CKikb8CXslbAaF9LqFh+TrvIcgm4X7sSXgmSwvgSpehp4Pd5/odsY0YIm/EzBXBUV0R5oxDVGecuaP7GC12ISpVnOXlXAMy8h2i4w5BD2tIkvUdRMedQB/WoHyr6CI+lpYSn/L4/7AlZk0irdTEAI651gby8eOkJi7GDcZfDdZ3q++oziSZnOsWHsnBOhqm7oN8sSo93e0/YqanuwIjScL6esADGh+D5S2QfAbWf6IIv1TAUSRL7Y8oyVzaR5QcrupIbEFxkLYM6j2GLGB9u4ZP/zFkQ+mHmamR8E/7PmWF8xKy/pK/8PVcvjXm2sWB4LlDHFT4877UTta4ki85VkwhnQfJfagF7inKqnKKONfGQdSKcvc6nceE20nMz1MV/0WplhMddk7kt9q5HpyXs1xd9JPZ4WazyaqKux7dDpIXg+eXXvuJX/IW6VwoQ0vj4eblYWlwDray4vqU9+AaV6S4HAla3rL87cn6TrKVMLHNn0Avy55VcbLxjM9ecCdikigtkBujxS6ffebnCz3ll4nlCxwW/vcCh4XyBQ7+s1M+XdB9x9UVMgzDMAzDMAzDMAzDMAzDMAwMPf8CPL/xKjsOHFkAAAAASUVORK5CYII=" alt="circled-play">
          <div class="songDetails">
            <h3 id="songTitle" class="songTXT">${song.title}</h3>
            <h3 id="songArtist" class="songTXT">${song.artist}</h3>
          </div>
          <h3 class="songTime">${song.duration}</h3>
        </div>
      `;
    });


    // insert it all at once to my html file
    if (
      location.includes("index.html") ||location === "/" 
    ) {
      modalSongs.innerHTML = songListHTML;
    } else if (location.includes("featured.html")) {
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

  function createPlaylistFeature(pl, allPl){
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

    if (pl.songs.length > 0) {
      const song = pl.songs[0]; // first song
      pageFoot.className = "currentlyPlaying";
      pageFoot.innerHTML = `
        <iframe class="currentlyPlaying" style="border-radius:5px" src="${song.link}" width="95%" height="95%" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      `;
    }
    
    // shuffle
    const featuredShuffle = document.getElementById("FeaturedshuffleBtn");
    featuredShuffle.addEventListener("click", (e) => {
      e.stopPropagation();
      // Pick a new random playlist that is not the current one
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * allPl.length);
      } while (allPl[newIndex].playlist_name === pl.playlist_name && allPl.length > 1);
      createPlaylistFeature(allPl[newIndex], allPl);
    });

    // choose a song to play
    // Attach click listener to each song element after rendering
    featuredSongs.addEventListener("click", (e) => {
      e.stopPropagation();
      // need to get the closest song that was clicked
      const songDiv = e.target.closest("#songTitle"); 
      console.log(songDiv);
      const titleClicked = e.target.textContent.trim();
      song = pl.songs.find((s) => s.title === titleClicked);

      if (song && song.link) {
        pageFoot.innerHTML = "";
        pageFoot.innerHTML = `
          <iframe class="currentlyPlaying" style="border-radius:5px" src="${song.link}" width="95%" height="95%" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        `;
      }
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





