$(document).ready(main)

let __id = 0;

function getId() {
  return `article${__id++}`;
}
function gotoStory(id) {
  window.location.replace(`/details/${id}`)
}
function iconTemplate(plog) {
  let id = getId() 
  let photo = plog.photos[Math.floor(plog.photos.length*Math.random())]
  return `<article class="thumb">
  <a href="" onclick="event.preventDefault(); gotoStory(${plog.id})" class="image">
    <img src="${photo.url}" alt="" style="max-height:400px"/> </a>
  <h2>
    <a href="#"><strong>${plog.title}</strong> </a>
    <span style="margin-left:5px"><a href="#">@${plog.user.username}</a></span>
  </h2>
  <p>${plog.message}</p>
</article>`
}

function search() {
  var terms = $("#searchbox").val()

  let query = "/?query="+terms
  window.history.pushState("", "", query);
  
  loadStories(query)
}
function loadStories(query) {
  if (!query) return search()
  const URL = `/api/posts${query}`

  $.ajax({
    method: 'GET',
    url: URL,
    success: posts => {
      $("#main").html("")
      posts.forEach(post => $("#main").append(iconTemplate(post)))
      setThumbs()
      poptrox()
    }
  })
}
function main() {
  loadStories()
}