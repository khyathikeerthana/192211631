const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

class Node {
  constructor(data) {
    this.data = data;
    this.prev = null;
    this.next = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  insert(data) {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
  }

  delete(data) {
    let current = this.head;
    while (current) {
      if (current.data == data) {
        if (current.prev) current.prev.next = current.next;
        else this.head = current.next;

        if (current.next) current.next.prev = current.prev;
        else this.tail = current.prev;

        return true;
      }
      current = current.next;
    }
    return false;
  }

  toArray(forward = true) {
    const result = [];
    let current = forward ? this.head : this.tail;
    while (current) {
      result.push(current.data);
      current = forward ? current.next : current.prev;
    }
    return result;
  }
}

const list = new DoublyLinkedList();

app.post('/insert', (req, res) => {
  const { value } = req.body;
  list.insert(value);
  res.json({ status: 'Inserted', forward: list.toArray() });
});

app.post('/delete', (req, res) => {
  const { value } = req.body;
  const deleted = list.delete(value);
  if (deleted) {
    res.json({ status: 'Deleted', forward: list.toArray() });
  } else {
    res.json({ status: 'Not Found' });
  }
});

app.get('/forward', (req, res) => {
  res.json({ direction: 'forward', values: list.toArray(true) });
});

app.get('/backward', (req, res) => {
  res.json({ direction: 'backward', values: list.toArray(false) });
});

app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});