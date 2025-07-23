# Accounting Platform

A full-stack accounting platform built with React frontend and Express.js backend, using MySQL database.

## Features

- ✅ User Authentication (Register/Login)
- ✅ Beautiful Dashboard with Sidebar Navigation
- ✅ Business Management
- ✅ Client & Vendor Management
- ✅ Income & Expense Tracking
- ✅ Transaction Management
- ✅ Product & Inventory Management
- ✅ Real-time Financial Statistics
- ✅ Responsive Design

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MySQL 8.0
- JWT Authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL 8.0
- npm or yarn

### Database Setup

1. Install MySQL and create a database:
\`\`\`sql
CREATE DATABASE accounting_platform;
\`\`\`

2. Run the database scripts:
\`\`\`bash
# Run the create-database.sql script in your MySQL client
mysql -u root -p accounting_platform < scripts/create-database.sql

# Optional: Add sample data
mysql -u root -p accounting_platform < scripts/seed-sample-data.sql
\`\`\`

### Backend Setup

1. Navigate to the server directory:
\`\`\`bash
cd server
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the `.env` file with your database credentials:
\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=accounting_platform
JWT_SECRET=your-super-secret-jwt-key
PORT=3001
\`\`\`

5. Start the server:
\`\`\`bash
npm run dev
\`\`\`

The API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
\`\`\`bash
cd src
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Businesses
- `GET /api/businesses` - Get user's businesses
- `POST /api/businesses` - Create new business

### Dashboard
- `GET /api/dashboard/stats?business_id=1` - Get dashboard statistics

### Health Check
- `GET /api/health` - API health check

## Database Schema

The application uses the following main tables:
- `users` - User accounts
- `businesses` - Business entities
- `clients` - Customer information
- `vendors` - Supplier information
- `products` - Product catalog
- `income` - Income records
- `expenses` - Expense records
- `transactions` - All financial transactions
- `categories` - Categorization system
- `stock_movements` - Inventory tracking

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Create Business**: Add your business information
3. **Add Clients & Vendors**: Manage your business relationships
4. **Track Income & Expenses**: Record financial transactions
5. **Monitor Dashboard**: View real-time financial statistics
6. **Manage Products**: Handle inventory and product catalog

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection protection with prepared statements
- CORS configuration
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
