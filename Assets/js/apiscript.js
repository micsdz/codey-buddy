const searchInput = document.getElementById("search-here");
const searchButton = document.getElementById("search-btn");
const articlesDiv = document.getElementById("ex1-tabs-1");
const videosDiv = document.getElementById("ex1-tabs-2");
const favDiv = document.getElementById("favorites-container");

const apiKey = "AIzaSyDW_VEGzWHTEaftCppwRMklcHH3tpPUBdU";

let favorites = [];

function getFavorites(){
   favorites = JSON.parse(localStorage.getItem("savedFavorites") || "[]");
  
}

function  setFavorite(clickedId){
  // "do this for the title" const favTitle = ....
  const favUrl = document.getElementById(clickedId+"-url").value;
  const newFav = {
    url: favUrl,
  };
  getFavorites();
  if (favorites.length === 0 || favorites.some((fav)=>{return fav.url === newFav.url})) {
    return listFavorites();
  }
  
  favorites.push(newFav);
  localStorage.setItem("savedFavorites", JSON.stringify(favorites));
  listFavorites();
}

function listFavorites(){
  getFavorites();
  let html = "<ul>";
  favorites.forEach((fav) => {
    html += `<li><a href="${fav.url}">${fav.url}</a></li>`;
  });
  html += "</ul>";
  favDiv.innerHTML = html;
  }

//#region Youtube
function showYoutubeResults(response) {
  let html = "";
  let videoItems = response.items;

  videoItems.forEach((item) => {
    let title = item.snippet.title;
    let description = item.snippet.description;
    let videoId = item.id.videoId;
    let url = `https://www.youtube.com/watch?v=${videoId}`;
    let thumbnail = item.snippet.thumbnails.default.url;
    let favData = `<input id = "fav-btn-${item.id.videoId}-url" value = "${url}" type = "hidden"></input>`
    let favBtn = `<button id = "fav-btn-${item.id.videoId}">Favorite</button>`;
    html +=
      '<div class="result-item-base youtube-result-item">' +
      `<a href="${url}">` +
      `<img src="${thumbnail}">` +
      '<div class="result-item-text">' +
      `<h1>V: ${title}</h1>` +
      `<p>${description}</p>` +
      "</div></a>"+favData+favBtn+"</div>";
  });

  videosDiv.innerHTML = html;
}

function searchYoutube() {
  let searchTerm = searchInput.value;
  let requestUrl = "https://www.googleapis.com/youtube/v3/search";
  const params = {
    part: "snippet",
    key: apiKey,
    q: searchTerm,
  };

  requestUrl +=
    "?" +
    Object.keys(params)
      .map((key) => key + "=" + encodeURIComponent(params[key]))
      .join("&");
  fetch(requestUrl).then(function (response) {
    response.json().then(function (res) {
      showYoutubeResults(res);
    });
  });
}
//#endregion

//#region Google
function showGoogleResults(response) {
  let html = "";
  let searchResults = response.items;

  searchResults.forEach((item,index) => {
    let title = item.title;
    let url = item.link;
    let thumbnail;
    let pagemap = item.pagemap;
    if (pagemap && pagemap.cse_thumbnail) {
      thumbnail = pagemap.cse_thumbnail[0].src;
    }
    let favData = `<input id = "fav-btn-${index}-url" value = "${url}" type = "hidden"></input>`
    let favBtn = `<button id = "fav-btn-${index}" onClick = "setFavorite(this.id)">Favorite</button>`;
    html +=
      '<div class="result-item-base google-result-item">' +
      `<a href="${url}">` +
      (thumbnail ? `<img src="${thumbnail}" width="128" height="128">` : "") +
      '<div class="result-item-text">' +
      `<h1>A: ${title}</h1>` +
      "</div></a>"+favData+favBtn+"</div>";
  });

  articlesDiv.innerHTML = html;
}

function searchGoogle() {
  let searchTerm = searchInput.value;
  let requestUrl = "https://customsearch.googleapis.com/customsearch/v1";
  const searchEngineId = "60fa70cd46d710892";
  let params = {
    key: apiKey,
    cx: searchEngineId,
    q: searchTerm,
  };

  requestUrl +=
    "?" +
    Object.keys(params)
      .map((key) => key + "=" + encodeURIComponent(params[key]))
      .join("&");
  fetch(requestUrl).then(function (response) {
    response.json().then(function (res) {
      showGoogleResults(res);
    });
  });
}
//#endregion

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  searchYoutube();
  searchGoogle();
});

listFavorites();