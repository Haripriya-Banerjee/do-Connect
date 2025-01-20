var users = [];
// format:=> 
// users = [{userId: mongodb user id, socketId: socket.id, userName: sessionInfo.userName, index:index of this object}]

var userdetails = {};
// format:=>
// userdetails = {mongodb user id: socket id}

var messages = {};
// format:=>
// messages = {
//   1: {
//     2: [{fromSelf: true, message: "Hi"}, {fromSelf: false, message: "Hello"}]
//   },
//   2: {
//     1: [{fromSelf: false, message: "Hi"}, {fromSelf: true, message: "Hello"}]
//   }
// }

exports.socket = (io) => {
    io.on('connection', (socket) => {
        console.log(`${socket.id} user just connected....`);
    
        socket.on('newUser', (data) => {
            data.index = users.length;
            data.socketId = socket.id;
            users.push(data);
            userdetails[data.userId] = data.socketId;
            io.emit('userJoined', users);
        })
    
        socket.on('changedCurrentUser', (data) => {
          const from = data.from;
          const to = data.to;
          if(typeof messages[from]==='undefined') {
            messages[from] = {};
          }
          if(typeof messages[from][to]==='undefined') {
            messages[from][to]=[];
          }
          console.log(messages[from][to]);
          socket.emit('newCurrentUser', messages[from][to]);
        })
    
        socket.on('sendMessage', (data) => {
          const from = data.from;
          const to = data.to;
          if(typeof messages[from]==='undefined') {
            messages[from] = {};
          }
          if(typeof messages[from][to]==='undefined') {
            messages[from][to]=[];
          }
    
          if(typeof messages[to]==='undefined') {
            messages[to] = {};
          }
          if(typeof messages[to][from]==='undefined') {
            messages[to][from]=[];
          }
          messages[from][to].push({fromSelf: true, message:data.message})
          messages[to][from].push({fromSelf: false, message:data.message})
          socket.broadcast.to(userdetails[data.to]).emit('receiveMessage', {from: data.from, message:data.message});
        })
    
        socket.on('disconnect', () => {
          console.log(`${socket.id} disconnected`);
          users = users.filter(user => user.socketId!==socket.id);
          console.log(users)
          io.emit('userLeft', users);
        })
    })
}