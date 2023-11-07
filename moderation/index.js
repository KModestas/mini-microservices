const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// this service is supposed to mimick a real moderation service where a human would manually review comments and update their status.
app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    // automatically reject comments with the word "orange"
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    // send the updated comment to the event bus so that it broadcasts it to all services that need it (commentsService) 
    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content
      }
    });
  }

  res.send({});
});

app.listen(4003, () => {
  console.log('Listening on 4003');
});
