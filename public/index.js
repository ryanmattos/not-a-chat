$('.room').click(event => {
   document.querySelector('#room').value = event.target.innerHTML.replace('#', '');
})

const params = new URLSearchParams(window.location.search)

const user = params.get('username')

if (user) {
   document.querySelector('#username').value = user
}
