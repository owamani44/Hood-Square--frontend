import Navbar from '../../Components/sidebar/Navbar'
import './chats.css'

const Chats = () => {
  var usernamePage = document.querySelector("#username-page");
  var chatPage=document.querySelector("#chat-page");
  var usernameForm= document.querySelector('#usernameForm');
  var messageForm= document.querySelector("#messageForm");
  var messageInput = document.querySelector('#message');
  var messageArea = document.querySelector('#messageArea');
  var connectingElement = document.querySelector('.connecting');

  var stompClient =null;
  var username = null;
  var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
  ];

  function connect (event){
    username = document.querySelector('#name').value.trim();
    if(username){
      usernamePage?.classList.add('hidden');
      chatPage?.classList.remove('hidden');
      var socket = new SocketJS('/ws');
      stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
    }

    function onConnected(){
      stompClient.subscribe('topicpublic', onMessageReceived);
      stompClient.send()
    }

    function onMessageeReceived(){

    }

   usernameForm.addEventListener('submit',connect ,true);
  

  return (
    <div className="chats">
      <Navbar/>

      <div id="username-page">
        <div className="username-page-container">
        <h1 className='title'>Enter username to join the ChatRoom</h1>
        <form id='usernameForm' name='usernameForm'>
          <div className="form-group">
            <input
             type="text"
             id="name" placeholder="Username"
              autoComplete="off"
               className="form-control" />
          </div>
          <div className="form-group">
                <button type="submit" className="accent username-submit">Join ChatRoom</button>
          </div>
        </form>
        </div>
      </div>
      
      
      <div id="chat-page" className="hidden">
        <div className="chat-container">
          <div className="chat-header">
            <h2>Chats by HoodSquare</h2>
          </div>
          <div className="connecting">
            Connecting
          </div>
          <ul id="messageArea">
            
          </ul>
          <form id="messageForm" name="messageForm">
            <div className="form-group">
                <div className="input-group clearfix">
                    <input type="text"
                     id="message" 
                     placeholder="Type a message..." autoComplete="off"
                      className="form-control"/>
                    <button type="submit" className="primary">Send</button>
                </div>
            </div>
        </form>
        </div>
      </div>

    </div>

    
  )
}

export default Chats
