
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".playlist-cards");

  fetch("data/data.json")
    .then((response) => {
      if (!response.ok) throw new Error("Network Error: " + response.status);
      return response.json();
    })
    .then((data) => {
      data.playlists.forEach(createPlaylistTile);
    })
    .catch((err) => console.error("Failed to load playlists:", err));

  
  const modal = document.getElementById("myModal");
  const modalContent = document.querySelector(".modalContent");
  const modalImg = document.getElementById("modalImg");
  const modalName = document.getElementById("modalName");
  const modalAuthor = document.getElementById("modalAuthor");
  const modalSongs = document.querySelector(".modalList");
  const closeBtn = document.querySelector(".close");

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
          <span class="heart-icon">&#x2665;</span>
          <span class="likeCount">${pl.likes}</span>
        </div>
      </div>
    `;

    //open modal when clicking the title but anywhere BUT the heart
    tile.addEventListener("click", (e) => {
      if (!e.target.classList.contains("heart-icon")) {
        openModal(pl);
      }
      // else{
      //   //implement like functionality 
      // }
    });

    // add it to within my playlist css grid section
    document.querySelector(".playlist-cards").appendChild(tile);
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
    modalImg.src = pl.playlist_art;
    modalName.textContent = pl.playlist_name;
    modalAuthor.textContent = "Created by: " + pl.playlist_author;
    
    // okay this will hold what i want the html to look like for the songs - this will hold every div and put it within my modalList
    let songListHTML = "";

    // the json obj has a song array, i want to iterate over it
    pl.songs.forEach(song => {
      songListHTML += `
        <div class="songs">
          <img class="songImg" src="./assets/img/song.png" alt="Song cover">
          <div class="songDetails">
            <h3 class="songTXT">${song.title}</h3>
            <h3 class="songTXT">${song.artist}</h3>
          </div>
          <h3 class="songTime">${song.duration}</h3>
        </div>
      `;
    });

    // insert it all at once to my html file
    modalSongs.innerHTML = songListHTML;

      // need to fix album and add it to json 
      // <h3 class="songTXT">Abulm: ${song.duration}</h3>
    
  }

  function closeModal() {
    modalContent.classList.add("fade-out");
    setTimeout(() => {
      modal.style.display = "none";
      modalContent.classList.remove("fade-out");
    }, 300); 
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





