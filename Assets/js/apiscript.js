const searchInput = document.getElementById("search-here");
const searchButton = document.getElementById("search-btn");
const articlesDiv = document.getElementById("article-just");
const videosDiv = document.getElementById("videos-just");
const favDiv = document.getElementById("favorites-container");
const myModalEl = document.getElementById("modal");
const modal = new mdb.Modal(myModalEl);
const favoriteButton = document.getElementById("favorites-btn");
const clearButton = document.getElementById("clear-btn");
const languageNames = [
  "Argus",
  "BETA",
  "C",
  "C#",
  "C++",
  "CSS",
  "Dart",
  "Express.js",
  "Git",
  "Go",
  "HTML",
  "Java",
  "JavaScript",
  "jQuery",
  "JSON",
  "Kotlin",
  "MATLAB",
  "MySQL",
  "Node.js",
  "NoSQL",
  "Pearl",
  "PHP",
  "Python",
  "R",
  "React",
  "Ruby",
  "Rust",
  "Scala",
  "Swift",
  "Typescript",
];

const apiKey = "AIzaSyDW_VEGzWHTEaftCppwRMklcHH3tpPUBdU";

const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");

const PageSelector = {
  CURRENT: 0,
  PREVIOUS: -1,
  NEXT: 1,
};

let googleResultsStart = 1;
let previousPageToken = null;
let nextPageToken = null;
let favorites = [];

function getFavorites() {
  favorites = JSON.parse(localStorage.getItem("savedFavorites") || "[]");
}

function clearStorage(){
  console.log('clear clicked')
  localStorage.clear();
}

function clearUl(){
  favDiv.innerHTML = "Your Favorites is empty";
}

clearButton.addEventListener("click", function(){
  clearStorage();
  clearUl();
})

function setFavorite(clickedId) {
  // "do this for the title" const favTitle = ....
  const favUrl = document.getElementById(clickedId + "-url").value;
  const newFav = {
    url: favUrl,
  };
  getFavorites();
  if (
    favorites.some((fav) => {
      return fav.url === newFav.url;
    })
  ) {
    return listFavorites();
  }

  favorites.push(newFav);
  localStorage.setItem("savedFavorites", JSON.stringify(favorites));
  listFavorites();
}

function listFavorites() {
  getFavorites();
  let html = "<ul>";
  favorites.forEach((fav) => {
    html += `<li><a href="${fav.url}">${fav.url}</a></li>`;
  });
  html += "</ul>";
  favDiv.innerHTML = html;
}
function createFavoriteHTML(id, url) {
  let favData = `<input id = "fav-btn-${id}-url" value = "${url}" type = "hidden"></input>`;
  let favBtn = `<button class = "tosave-btn" id = "fav-btn-${id}" onClick = "setFavorite(this.id)"><img src="./Assets/Images/favorite.png" alt="save-icon"></button>`;
  return favData + favBtn;
}

//#region Youtube
function showYoutubeResults(response) {
  if (response.nextPageToken) {
    nextPageToken = response.nextPageToken;
  }
  if (response.prevPageToken) {
    previousPageToken = response.prevPageToken;
  } else {
    previousPageToken = null;
  }

  let html = "";
  let videoItems = response.items;

  videoItems.forEach((item) => {
    let title = item.snippet.title;
    let videoId = item.id.videoId;
    let url = `https://www.youtube.com/watch?v=${videoId}`;
    let thumbnail = item.snippet.thumbnails.default.url;
    html +=
      '<div class="result-item-base youtube-result-item">' +
      createFavoriteHTML(videoId, url) +
      `&nbsp;` +
      `<a href="${url}" target="_blank">` +
      `&nbsp;` +
      `<img src="${thumbnail}">` +
      `&nbsp;` +
      '<div class="result-item-text">' +
      `<p>V: ${title}</p>` +
      "</div></a>" +
      "</div>";
  });

  videosDiv.innerHTML = html;
}

function searchYoutube(selectedPage) {
  let searchTerm = searchInput.value;
  let requestUrl = "https://www.googleapis.com/youtube/v3/search";
  let params = {
    part: "snippet",
    key: apiKey,
    q: searchTerm,
    maxResults: 10,
  };
  if (selectedPage === PageSelector.NEXT) {
    params.pageToken = nextPageToken;
  }
  if (selectedPage === PageSelector.PREVIOUS) {
    params.pageToken = previousPageToken;
  }

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

  searchResults.forEach((item, index) => {
    let title = item.title;
    let url = item.link;
    let thumbnail;
    let pagemap = item.pagemap;
    if (pagemap && pagemap.cse_thumbnail) {
      thumbnail = pagemap.cse_thumbnail[0].src;
    }

    html +=
      '<div class="result-item-base google-result-item">' +
      createFavoriteHTML(index, url) +
      `&nbsp;` +
      `<a href="${url}" target="_blank">` +
      `&nbsp;` +
      (thumbnail ? `<img src="${thumbnail}" width="50" height="50">` : "") +
      `&nbsp;` +
      '<div class="result-item-text">' +
      `&nbsp;` +
      `<p>A: ${title}</p>` +
      "</div></a>" +
      "</div>";
  });

  articlesDiv.innerHTML = html;
}

function searchGoogle(selectedPage) {
  let searchTerm = searchInput.value;
  let requestUrl = "https://customsearch.googleapis.com/customsearch/v1";
  const searchEngineId = "60fa70cd46d710892";
  if (selectedPage === PageSelector.NEXT) {
    googleResultsStart += 10;
  }
  if (selectedPage === PageSelector.PREVIOUS) {
    googleResultsStart -= 10;
  }

  let params = {
    key: apiKey,
    cx: searchEngineId,
    q: searchTerm,
    num: 10,
    start: googleResultsStart,
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

// Modal Search Button

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  const searchTerm = searchInput.value.toLowerCase();
  if (!isValidSearchTerm(searchTerm)) {
    return modal.show();
  }
  searchYoutube(PageSelector.CURRENT);
  searchGoogle(PageSelector.CURRENT);
});

prevButton.addEventListener("click", function (e) {
  e.preventDefault();
  const searchTerm = searchInput.value.toLowerCase();
  if (!isValidSearchTerm(searchTerm)) {
  }
  if (previousPageToken) {
    searchYoutube(PageSelector.PREVIOUS);
  }
  if (googleResultsStart >= 10) {
    searchGoogle(PageSelector.PREVIOUS);
  }
});

nextButton.addEventListener("click", function (e) {
  e.preventDefault();
  const searchTerm = searchInput.value.toLowerCase();
  if (!isValidSearchTerm(searchTerm)) {
  }
  if (nextPageToken) {
    searchYoutube(PageSelector.NEXT);
  }
  searchGoogle(PageSelector.NEXT);
});

function isValidSearchTerm(searchTerm) {
  const languageNamesLowerCase = languageNames.map((lang) =>
    lang.toLowerCase()
  );

  if (languageNamesLowerCase.includes(searchTerm)) {
    return true;
  } else {
    return false;
  }
}

// Modal Favorite Button

favoriteButton.addEventListener("click", function () {
  const myModalEl = document.getElementById("modalFavorite");
  const modal = new mdb.Modal(myModalEl);
  modal.show();
});

listFavorites();