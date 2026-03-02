# TaskFlow – Full-Stack Todo App

A clean, production-ready Todo application built with **React**, **Express**, **MongoDB**, and **Mongoose**.

---

## 📁 Project Structure

```
taskflow/
├── server/             # Node.js + Express backend
│   ├── models/
│   │   └── Todo.js     # Mongoose schema
│   ├── routes/
│   │   └── todos.js    # RESTful API routes
│   ├── index.js        # Server entry point
│   ├── .env.example    # Environment variable template
│   └── package.json
│
├── client/             # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js      # Main component (TodoItem + App)
│   │   ├── App.css     # Styles
│   │   ├── api.js      # Axios API layer
│   │   └── index.js    # React entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16+
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas/database) free tier)

---

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 2. Configure Environment

```bash
# In the server directory
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
# For Atlas: mongodb+srv://<user>:<password>@cluster.mongodb.net/taskflow
```

---

### 3. Start MongoDB

**Local:**
```bash
mongod
```

**Or use MongoDB Atlas** — update `MONGODB_URI` in `.env` with your connection string.

---

### 4. Run the App

**Terminal 1 – Backend:**
```bash
cd server
npm run dev     # development (nodemon)
# or
npm start       # production
```

**Terminal 2 – Frontend:**
```bash
cd client
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint         | Description            | Body                         |
|--------|------------------|------------------------|------------------------------|
| GET    | `/todos`         | Fetch all todos        | —                            |
| POST   | `/todos`         | Create a new todo      | `{ title: string }`          |
| PUT    | `/todos/:id`     | Update a todo          | `{ title?, completed? }`     |
| DELETE | `/todos/:id`     | Delete a todo          | —                            |

### Example Responses

**GET /api/todos**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64abc...",
      "title": "Build the Todo app",
      "completed": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

**POST /api/todos** `{ "title": "New task" }`
```json
{
  "success": true,
  "data": {
    "_id": "64def...",
    "title": "New task",
    "completed": false,
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
