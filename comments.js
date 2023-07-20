// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Use middleware for parsing JSON
app.use(bodyParser.json());
app.use(cors());

// Create comments object
const commentsByPostId = {};

// Get all comments for a given post
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

// Create a new comment
app.post('/posts/:id/comments', async (req, res) => {
    // Generate random ID
    const commentId = randomBytes(4).toString('hex');
    // Get content from request body
    const { content } = req.body;

    // Get comments for post
    const comments = commentsByPostId[req.params.id] || [];
    // Add new comment
    comments.push({ id: commentId, content, status: 'pending' });
    // Update comments
    commentsByPostId[req.params.id] = comments;

    // Emit event to event bus
    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending',
        },
    });

    // Send response
    res.status(201).send(comments);
});

// Receive events from event bus
app.post('/events', async (req, res) => {
    console.log('Event Received:', req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        // Get comments for post
        const comments = commentsByPostId[data.postId];

        // Find comment in comments array
        const comment = comments.find(comment => {
            return comment.id === data.id;
        });

        // Update comment status
        comment.status = data.status;

        // Emit event to event bus
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: {
                id: data.id,
                content: data.content,
                postId: data.postId,
                status: data.status,
            },
        });
    }

    // Send response
});
