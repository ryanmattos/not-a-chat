const socket = io()

const params = new URLSearchParams(window.location.search)

const user = params.get('username')
const room = params.get('room')

socket.emit('room', {
   user,
   room
}, ({messagesList: messages, countUsers: count}) => {

   console.log(messages, count)

   messages.forEach(msg => createMessage(msg))

   document.querySelector('#room').innerHTML = room
   document.querySelector('#user').innerHTML = user
   document.querySelector('#count-users').innerHTML = `${count} usuário${count === 1 ? '' : 's'} online${count === 1 ? '' : 's'}`
   document.title = `Not a Chat - ${room}`

   // if (response.error) {
   //    alert(response.error)
   //    window.history.back()
   // }
})

const input = document.querySelector('#message')

input.addEventListener('keypress', event => {
   if (event.key === 'Enter') {
      event.preventDefault();
      const message = event.target.innerHTML

      const data = {
         room,
         message,
         user
      }

      socket.emit('message', data)
      
      input.innerHTML = ''

      window.scrollBy(0,1);
   }
})

socket.on('message', data => {
   createMessage(data)
})

document.querySelector('#logout').addEventListener('click', event => {
   window.location.href = `index.html?username=${user}`
})

function createMessage(data) {
   const messageList = document.querySelector('#chat-row')

   // console.log($('#chat-row').scrollTop(), $('#chat-row').height())


   if (data.user === user) {
      messageList.innerHTML += `
         <div class="message me">
            <div class="top">
               <span>${data.user}</span>
               <span id="time">${dayjs(data.createdAt).format("HH:mm")}</span>
            </div>
            <div class="content">
               ${data.message}
            </div>
         </div>
      `
   } else {
      messageList.innerHTML += `
         <div class="message them">
            <div class="top">
               <span id="time">${dayjs(data.createdAt).format("HH:mm")}</span>
               <span>${data.user}</span>
            </div>
            <div class="content">
               ${data.message}
            </div>
         </div>
      `
   }

   var observer = new IntersectionObserver(function(entries) {
      if(entries[0].isIntersecting === true)
         console.log('Element is fully visible in screen');
   }, { threshold: [1] });
   
   observer.observe(document.querySelector(".message"));
   

   if($('#chat-row').scrollTop() <= $('#chat-row').height()) {
      window.scrollBy(0,1);
   }
}


$('.picker').lsxEmojiPicker({
   width: 220,
   height: 220,
   twemoji: true,
   onSelect: function(emoji){
     input.innerHTML += twemoji.parse(emoji.value)
     input.focus();
     input.innerHTML = input.innerHTML
   }
});
