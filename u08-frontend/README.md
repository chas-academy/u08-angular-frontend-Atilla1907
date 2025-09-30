Todo App - Angular Frontend
A simple Angular application for managing todos with full CRUD functionality. Connects to a REST API backend.

App: https://stellular-torte-6385aa.netlify.app/todos
API: https://u05restfulapi.onrender.com

Features:
Create, read, update, delete todos
Responsive design (mobile + desktop)
Routing with lazy-loaded modules
TypeScript + RxJS for reactive state
Error handling and loading states

Installation:
git clone <repo-url>
cd u08-frontend
npm install
ng serve

API Base url:
https://u05restfulapi.onrender.com/api/v1/todos

Method	Endpoint	Description
GET	/todos	Get all todos
GET	/todos/:id	Get todo by ID
POST	/todos	Create todo
PUT	/todos/:id	Update todo
DELETE	/todos/:id	Delete todo