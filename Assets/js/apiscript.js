const searchInput = document.getElementById("search-here");
const searchButton = document.getElementById("search-btn");
const articlesDiv = document.getElementById("ex1-tabs-1");
const videosDiv = document.getElementById("ex1-tabs-2");

const apiKey = "AIzaSyDW_VEGzWHTEaftCppwRMklcHH3tpPUBdU";

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
      "</div></a></div>";
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

  searchResults.forEach((item) => {
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
      "</div></a></div>";
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
