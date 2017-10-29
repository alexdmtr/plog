$(document).ready(main)

function iconTemplate(plog) {
  let photo = plog.photos[0]
  return `<article class="thumb">
  <a href="#" class="image">
    <img src="${photo.url}" alt="" style="max-height:400px"/> </a>
  <h2>
    <a href="#">${plog.title} </a>
    <small style="margin-left:5px"><a href="#">@${plog.user.username}</a></small>
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