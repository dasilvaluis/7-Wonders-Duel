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
  ADD_ELEMENTS: 'add_elements',
  BRING_ELEMENT: 'bring_element',
  SET_AGE: 'set_age',
  GET_AGE: 'get_age'
};

io.on('connect', (socket) => {
  socket.broadcast.emit(events.GET_ELEMENTS);
  socket.broadcast.emit(events.GET_AGE);

  Object.values(events).forEach((event) => {
    socket.on(event, (data)=> {
      socket.broadcast.emit(event, data);
    });
  });
});
