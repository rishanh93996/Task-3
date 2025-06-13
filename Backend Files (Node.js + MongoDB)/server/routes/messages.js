const router = require('express').Router();
const Message = require('../models/message.model');

router.post('/', async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.status(201).json({ message: 'Message sent successfully' });
    }
    return res.status(400).json({ message: 'Failed to send message' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:chatId', async (req, res) => {
  try {
    const messages = await Message.find({
      users: {
        $all: [req.params.chatId],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === req.params.chatId,
        message: msg.message.text,
      };
    });

    res.status(200).json(projectedMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
