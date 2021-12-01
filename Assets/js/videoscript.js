const searchButton = document.getElementById("search-button");
const searchInput = document.getElementById("keyword-input");
const maxresultInput = document.getElementById("maxresult-input");
const orderInput = document.getElementById("order-input");

function showResults(response) {
  let html = "";
  let videoItems = response.items;

  videoItems.forEach((item) => {
    let title = item.snippet.title;
    let videoId = item.id.videoId;
    let url = `https://www.youtube.com/watch?v=${videoId}`;
    let thumbnail = item.snippet.thumbnails.default.url;
    html += `<p>${title}</p><a href="${url}"><img src="${thumbnail}"></a>`;
  });

  document.getElementById("search-results").innerHTML = html;
}

function searchVideos() {
  let searchTerm = searchInput.value;
  let maxResult = maxresultInput.value;
  let order = orderInput.value;

  let requestUrl = "https://www.googleapis.com/youtube/v3/search";

  const params = {
    part: "snippet",
    key: "AIzaSyDW_VEGzWHTEaftCppwRMklcHH3tpPUBdU",
    maxResults: maxResult,
    order: order,
    q: searchTerm,
  };

  requestUrl +=
    "?" +
    Object.keys(params)
      .map((k) => k + "=" + encodeURIComponent(params[k]))
      .join("&");

  fetch(requestUrl).then(function (response) {
    response.json().then(function (res) {
      showResults(res);
    });
  });
}

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  searchVideos();
});
