// const socket=io()
// const clientTotal=document.getElementById('client-total')
// const  messageContainer=document.getElementById('message-container')
// const nameinput=document.getElementById('name-input')
// const messageform= document.getElementById('message-form')
// const messageInput=document.getElementById('message-input')

// messageform.addEventListener('submit',(e)=>{
//     e.preventDefault()
//     sendMessage()
// })

// function sendMessage(){
//     // now send to json data to server mean socket sever
//     const data={
//         name:nameinput.value,
//         message:messageInput.value,
//         dateTime:new Date()
//     }
//     socket.emit('message',data)
//     addmessagetoUI(true,data)
//     messageInput.value=''
// }
// socket.on('chat-message',(data)=>{
//     console.log(data);
//     addmessagetoUI(false,data)
// })

// // lsiten event

// socket.on('clients-total',(data)=>{
//     clientTotal.innerText=`Total clients : ${data}`
// })
// function addmessagetoUI(isOwnMessage,data){
//     const element=`
//     <li class="${isOwnMessage ? "message-right":"message-left"}">
//     <p class="message">
//           ${data.message}
//         <span> ${data.name}  ${moment(data.dateTime).fromNow()}</span>
//     </p>
// </li>
//     `
//     messageContainer.innerHTML+=element
// }

const socket = io();
const clientTotal = document.getElementById('client-total');
const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

//  this song is simply render because this is inside the public folder
const messageTone=new Audio('/public_message-tone.mp3');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
});

function sendMessage() {
    if (messageInput.value === '') return
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    };
    socket.emit('message', data);
    addMessageToUI(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    messageTone.play()
    addMessageToUI(false, data);
});

socket.on('clients-total', (data) => {
    clientTotal.innerText = `Total clients : ${data}`;
});

function addMessageToUI(isOwnMessage, data) {
    clearFeedback()
    const alignmentClass = isOwnMessage ? 'message-right' : 'message-left';
    const element = `
    <li class="${alignmentClass}">
        <p class="message">
            ${data.message}
            <span>${data.name} ${moment(data.dateTime).fromNow()}</span>
        </p>
    </li>
    `;
    messageContainer.innerHTML += element;
    // setTimeout(scrollToBottom, 10);
    scrollToBottom()

}

// automaticaly scrolll  when send message
function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} is typing a message`
    })
})

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} is typing a message`
    })
})
messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ` `
    })
})
socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
    <li class="message-feedback">
    <p class="feedback" id="feedback"> ${data.feedback} </p>
</li>
    `
    messageContainer.innerHTML+=element
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element => {
        element.parentNode.removeChild(element)
    });
}