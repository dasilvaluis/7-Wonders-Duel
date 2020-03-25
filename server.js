const express = require('express');
const app = express();
const socketio = require('socket.io');

const events = {
  FLIP_ELEMENT: 'flip_element',
  MOVE_ELEMENT: 'move_element',
  GET_ELEMENTS: 'get_elements',
  SET_ELEMENTS: 'set_elements',
  ADD_ELEMENTS: 'add_elements'
}

app.use(express.static(__dirname + '/public'));

const server = app.listen(8000);
const io = socketio(server);

io.on('connect', (socket) => {
  console.log(`Someone connected! ${ socket.id }`);

  socket.on(events.FLIP_ELEMENT, (data)=> {
    socket.broadcast.emit(events.FLIP_ELEMENT, data);
  });

  socket.on(events.MOVE_ELEMENT, (data)=> {
    socket.broadcast.emit(events.MOVE_ELEMENT, data);
  });

  socket.on(events.SET_ELEMENTS, (data)=> {
    socket.broadcast.emit(events.SET_ELEMENTS, data);
  });

  socket.on(events.GET_ELEMENTS, ()=> {
    socket.broadcast.emit(events.GET_ELEMENTS);
  });

  socket.on(events.ADD_ELEMENTS, (data)=> {
    socket.broadcast.emit(events.ADD_ELEMENTS, data);
  });
});
