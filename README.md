# Node.js + Express Project Setup 🚀

### Install & Setup  
```sh
git clone <repo-url> && cd <project-folder>  
npm install  
cp .env.example .env  # Update environment variables  
npx sequelize db:migrate  # Run database migrations  
npm start  # Start the server  


API Endpoints
POST /api/v1/auth/register → Register User
POST /api/v1/auth/login → Login & Get Token

GET /api/v1/auth/users → Get Users
GET /api/v1/auth/users/:id → Get User by ID
PUT /api/v1/auth/users/:id → Update User
DELETE /api/v1/auth/users/:id → Delete User
