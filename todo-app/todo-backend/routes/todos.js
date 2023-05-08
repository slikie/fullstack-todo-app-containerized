const express = require('express');
const { Todo } = require('../mongo')
const { setAsync, getAsync } = require('../redis/index')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  const currentCount = await getAsync('todo_count')
  const newCount = parseInt(currentCount || 0) + 1
  await setAsync('todo_count', newCount)
  res.send(todo);
});

router.get('/statistics', async (req, res) => {
  try {
    const todoCount = await getAsync('todo_count')
    res.json({ added_todos: parseInt(todoCount || 0) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/:id', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/:id', async (req, res) => {
  const { todo } = req;
  todo.text = req.body.text;
  todo.done = req.body.done;
  await todo.save();
  res.send(todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
