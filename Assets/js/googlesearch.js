//API key
const key = "AIzaSyDW_VEGzWHTEaftCppwRMklcHH3tpPUBdU";
// Search Engine ID
const id = "60fa70cd46d710892";
// search term
let q = searchTerm;
const requestUrl =
  "https://www.googleapis.com/customsearch/v1?key=AIzaSyDW_VEGzWHTEaftCppwRMklcHH3tpPUBdU&cx=60fa70cd46d710892&q=cats";

fetch(requestUrl).then(function (response) {
  response.json().then(function (res) {
    showResults(res);
  });
});
