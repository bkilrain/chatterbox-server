// YOUR CODE HERE:

var app = {};

app.server = 'http://127.0.0.1:3000';

app.friends = {};

app.rooms = { lobby: true };
app.currentRoom = 'lobby';

app.init = function () {

};

app.send = function (message) {
  $.ajax({
    url: app.server + '/send',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

};

app.fetch = function () {
  $.ajax({
    url: app.server + '/classes/messages',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      $('#chats').html('');
      var arr = data.results || [];
      for ( var i = 0; i < arr.length; i++) {
        if (app.rooms[arr[i].roomname] === undefined) {
          app.rooms[arr[i].roomname] = true;
          app.addRoom(arr[i].roomname);
        }
      }

      arr = arr.filter( function(x) {
        if ( app.currentRoom === 'lobby' || app.currentRoom === 'Lobby' || x.roomname === app.currentRoom) {
          return true;
        }
      });
      for ( var i = 0; i < arr.length; i++) {
        app.addMessage(arr[i]);
      }
      for ( var key in app.friends) {
        if (app.friends[key] ) {
          $('[data-username=' + key + ']').find('.username').toggleClass('friend');
        }
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });

};

app.clearMessages = function () {
  $('#chats').html('');

};

var timeSince = function(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 0) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
};


app.addMessage = function (message) {
  var date = new Date(message.createdAt);
  if ( $('.chat').length === 100 ) {
    $('.chat').first().remove();
  }
  var $newdiv = $('<div class= "chat">' + timeSince(date) + ' ago ' 
    + _.escape(message.roomname) + ' ' + '<a class="username">' 
    + _.escape(message.username) 
    + '</a>' + ': ' + _.escape(message.text) + '</div>');

  $newdiv.attr('data-username', _.escape(message.username));
  
  $('#chats').append($newdiv);

};

app.addRoom = function (room) {
  $('#roomSelect').append('<option id="room">' + room + '</option>');
};


app.handleSubmit = function() {
  // upon button click
  var message = {};
  message.username = decodeURI (window.location.search.slice(10));
  message.text = $('#message').val();
  message.roomname = app.currentRoom;
  app.send(message);
  $('#message').val('');
};


app.showOnlyFriend = function(people) {
  // $('#chats').children().hide();
  // for (var i = 0; i < people.length; i++) {
  //   console.log($('.' + people[i]).text());
  //   $('.' + people[i]).show();
  //   //$('.Chris .Desperado')
  // }
  // if (people.length === 0 ) {
  //   $('#chats').children().show();
  // }

};

$(document).ready(function () {
  $('form').on('submit', function(e) {
    e.preventDefault();
    app.handleSubmit();
  });

  app.fetch();

  $('#chats').on('click', '.username', function(node) {
    //app.addFriend($(this).text());
    var name = $(this).text();
    app.friends[JSON.stringify(name)] = !app.friends[JSON.stringify(name)];
    $('[data-username="' + name + '"]').find('.username').toggleClass('friend');
  });
  $('#roomSelect').on('change', function(e) {
    if ( this.value === 'Make new room') {
      var newRoom = prompt('Please enter a new room name');
      app.addRoom(newRoom);
      app.rooms[newRoom] = true;
      $('#roomSelect').val(newRoom);
      app.currentRoom = newRoom;
    } else {
      app.currentRoom = this.value;
    }


  });
  $('#roomSelect').val('lobby');
  // setInterval(app.fetch, 1000);
  
});

// Add friends section
// Add room selection
// Beautify (make timestamp smaller, don't show seconds so much)
// Extra credit - optimize (don't create a 100)

