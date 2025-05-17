import { Router } from 'express'

const messageRouter = Router()
// GET     /api/messages/               → Get all messages (or chat summary)
// GET     /api/messages/:userId        → Get messages between current user & userId
// POST    /api/messages/               → Send a message
// PUT     /api/messages/:id/read       → Mark message as read
// DELETE  /api/messages/:id            → Delete a message

messageRouter.get('/messages', (req, res) => {
  res.send({ title: 'get all messages' })
})
messageRouter.get('/messages/:userId', (req, res) => {
  const userId = req.params.userId
  res.send({ title: 'get messages with user', id: userId })
})
messageRouter.post('/messages', (req, res) => {
  res.send({ title: 'send message' })
})
messageRouter.put('/messages/:id/read', (req, res) => {
  const messageId = req.params.id
  res.send({ title: 'mark message as read', id: messageId })
})
messageRouter.delete('/messages/:id', (req, res) => {
  const messageId = req.params.id
  res.send({ title: 'delete message', id: messageId })
})
export default messageRouter
