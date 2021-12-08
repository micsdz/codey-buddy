const searchInput = document.getElementById("search-here");
const searchButton = document.getElementById("search-btn");
const articlesDiv = document.getElementById("article-just");
const videosDiv = document.getElementById("videos-just");
const favDiv = document.getElementById("favorites-container");
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

let favorites = [];

function getFavorites() {
  favorites = JSON.parse(localStorage.getItem("savedFavorites") || "[]");
}

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
  let favBtn = `<button id = "fav-btn-${id}" onClick = "setFavorite(this.id)">Favorite</button>`;
  return favData + favBtn;
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
    html +=
      '<div class="result-item-base youtube-result-item">' +
      `<a href="${url}">` +
      `<img src="${thumbnail}">` +
      '<div class="result-item-text">' +
      `<h1>V: ${title}</h1>` +
      `<p>${description}</p>` +
      "</div></a>" +
      createFavoriteHTML(videoId, url) +
      "</div>";
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
    maxResults: 49,
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
      `<a href="${url}">` +
      (thumbnail ? `<img src="${thumbnail}" width="128" height="128">` : "") +
      '<div class="result-item-text">' +
      `<h1>A: ${title}</h1>` +
      "</div></a>" +
      createFavoriteHTML(index, url) +
      "</div>";
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
function displayFavorites() {
  favDiv.style.display = "block";
}

function toggleSavedFavorites() {
  const mySavedFavorites = document.getElementById("userFavorites");
  let displaySetting = mySavedFavorites.style.display;
  let mySavedFavoritesButton = document.getElementById("SavedFavsButton");

  if (displaySetting == "block") {
    mySavedFavoritesButton.style.display = "none";
    SavedFavsButton.innerHTML = "Show Favs";
  } else {
    mySavedFavoritesButton.style.display = "block";
    SavedFavsButton.innerHTML = "Hide Favs";
  }
}

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  const searchTerm = searchInput.value.toLowerCase();
  if (isValidSearchTerm(searchTerm)) {
    searchYoutube();
    searchGoogle();
  } else {
    const myModalEl = document.getElementById("modal");
    const modal = new mdb.Modal(myModalEl);
    modal.show();
  }
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

listFavorites();

const mockYoutubeResults = {
  items: [
    {
      id: {
        videoId: "MockVideoId0",
      },
      snippet: {
        title: "YouTube Mock Title",
        description: "YouTube Mock Description, blah blah blah.",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/eX2qFMC8cFo/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBu-nic8l07zW0vFToITMym5Y5CUQ",
          },
        },
      },
    },
    {
      id: {
        videoId: "MockVideoId1",
      },
      snippet: {
        title: "YouTube Mock Title",
        description: "YouTube Mock Description, blah blah blah.",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/eX2qFMC8cFo/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBu-nic8l07zW0vFToITMym5Y5CUQ",
          },
        },
      },
    },
    {
      id: {
        videoId: "MockVideoId2",
      },
      snippet: {
        title: "YouTube Mock Title",
        description: "YouTube Mock Description, blah blah blah.",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/eX2qFMC8cFo/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBu-nic8l07zW0vFToITMym5Y5CUQ",
          },
        },
      },
    },
    {
      id: {
        videoId: "MockVideoId3",
      },
      snippet: {
        title: "YouTube Mock Title",
        description: "YouTube Mock Description, blah blah blah.",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/eX2qFMC8cFo/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBu-nic8l07zW0vFToITMym5Y5CUQ",
          },
        },
      },
    },
    {
      id: {
        videoId: "MockVideoId4",
      },
      snippet: {
        title: "YouTube Mock Title",
        description: "YouTube Mock Description, blah blah blah.",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/eX2qFMC8cFo/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBu-nic8l07zW0vFToITMym5Y5CUQ",
          },
        },
      },
    },
    {
      id: {
        videoId: "MockVideoId5",
      },
      snippet: {
        title: "YouTube Mock Title",
        description: "YouTube Mock Description, blah blah blah.",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/eX2qFMC8cFo/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBu-nic8l07zW0vFToITMym5Y5CUQ",
          },
        },
      },
    },
  ],
};

const mockGoogleResults = {
  items: [
    {
      title: "Google Mock Title",
      link: "Google Mock  Url",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://i.ytimg.com/vi/eX2qFMC8cFo/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBu-nic8l07zW0vFToITMym5Y5CUQ",
          },
        ],
      },
    },
    {
      title: "Google Mock Title",
      link: "Google Mock  Url",
    },
    {
      title: "Google Mock Title",
      link: "Google Mock  Url",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://i.ytimg.com/vi/eX2qFMC8cFo/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBu-nic8l07zW0vFToITMym5Y5CUQ",
          },
        ],
      },
    },
    {
      title: "Google Mock Title",
      link: "Google Mock  Url",
    },
    {
      title: "Google Mock Title",
      link: "Google Mock  Url",
      pagemap: {
        cse_thumbnail: [
          {
            src: "https://i.ytimg.com/vi/eX2qFMC8cFo/hq720.jpg?sqp=-oaymwEcCOgCEMoBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBu-nic8l07zW0vFToITMym5Y5CUQ",
          },
        ],
      },
    },
  ],
};
