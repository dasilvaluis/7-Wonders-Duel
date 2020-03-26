const path = require('path');
const express = require('express');
const app = express();
const socketio = require('socket.io');
require('dotenv').config();

app.use(express.static(path.join(__dirname, '../../build')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../build', 'index.html')));

const server = app.listen(process.env.PORT || 8080);

const io = socketio(server);

const events = {
  FLIP_ELEMENT: 'flip_element',
  MOVE_ELEMENT: 'move_element',
  GET_ELEMENTS: 'get_elements',
  SET_ELEMENTS: 'set_elements',
  ADD_ELEMENTS: 'add_elements'
};

io.on('connect', (socket) => {
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
