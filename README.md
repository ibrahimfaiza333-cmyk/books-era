# 📚 Suleman Books — Full-Stack E-Commerce Bookstore

A fully-featured, production-ready e-commerce bookstore built with **Next.js 16** on the frontend and **Node.js / Express / MongoDB** on the backend.

---

## 🗂️ Project Structure

```
e-book-store/
├── backend/          # Node.js + Express REST API
└── frontend-next/    # Next.js 16 (App Router) Frontend
```

---

## ✨ Features

### 🛍️ Customer (User) Features
- Browse books by category, search, filters (price, rating, stock)
- Book detail pages with reviews and ratings
- Shopping Cart with coupon code support
- Checkout with COD / Online Payment
- Order tracking with status history
- Wishlist — save books for later
- User Profile & Multiple Delivery Addresses
- Forgot Password / Reset Password via Email
- Real-time Notifications (Bell icon) for:
  - Order placed / status updates (Confirmed, Shipped, Delivered, Cancelled)
  - Wishlist book back in stock
  - Wishlist book price drop
  - Admin broadcast announcements

### 🔧 Admin Features
- Full Dashboard with Stats (Revenue, Orders, Users, Low Stock)
- Sales Chart (Last 6 months)
- Manage Books (Add, Edit, Delete, Toggle Active, Image Upload)
- Manage Orders (View, Update Status)
- Manage Users (View, Ban/Unban, Delete)
- Manage Categories
- Coupon Management (Create, Toggle Active, Delete)
- Sales Reports
- Admin Broadcast — send announcements to all users
- Admin Notifications for:
  - New order placed
  - Low stock warning (stock ≤ 5)
  - New user registered
  - New review submitted

---

## 🧰 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express 5 | REST API Server |
| MongoDB + Mongoose | Database & ODM |
| JWT (Access + Refresh Tokens) | Authentication |
| Bcrypt | Password Hashing |
| Cloudinary + Multer | Image Upload & Storage |
| Nodemailer | Email (Forgot Password) |
| Helmet | HTTP Security Headers |
| express-rate-limit | Rate Limiting |
| CORS | Cross-Origin Request Handling |
| Morgan | HTTP Request Logging |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 (App Router) | React Framework |
| TypeScript | Type Safety |
| Redux Toolkit | Global State Management (Auth, Cart) |
| TanStack Query (React Query) | Server State & Data Fetching |
| Axios | HTTP Client |
| React Hook Form | Form Management |
| Embla Carousel | Hero/Book Sliders |
| Lucide React + React Icons | Icons |
| React Toastify | Toast Notifications |
| TailwindCSS 4 | Utility CSS |

---

## 🗄️ Database Models

| Model | Description |
|-------|-------------|
| `User` | Auth, profile, addresses, role (user/admin) |
| `Book` | Title, author, price, stock, images, category, reviews |
| `Category` | Book categories |
| `Cart` | User's active cart with items |
| `Order` | Order details, status, payment, shipping |
| `Review` | Book reviews (verified purchase only) |
| `Coupon` | Discount codes with expiry |
| `Notification` | In-app notifications for users & admins |

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### 👤 Users — `/api/v1/users`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | Login | ❌ |
| POST | `/logout` | Logout | ✅ |
| GET | `/current-user` | Get logged-in user | ✅ |
| PATCH | `/update-profile` | Update name, phone, username | ✅ |
| POST | `/change-password` | Change password | ✅ |
| POST | `/forgot-password` | Send reset email | ❌ |
| POST | `/reset-password/:token` | Reset password | ❌ |
| GET | `/addresses` | Get all addresses | ✅ |
| POST | `/addresses` | Add new address | ✅ |
| PATCH | `/addresses/:id` | Update address | ✅ |
| DELETE | `/addresses/:id` | Delete address | ✅ |
| PATCH | `/addresses/:id/set-default` | Set default address | ✅ |

### 📖 Books — `/api/v1/books`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all books (filters, search, pagination) | ❌ |
| GET | `/:id` | Get single book | ❌ |
| POST | `/` | Create book | 🔑 Admin |
| PUT | `/:id` | Update book | 🔑 Admin |
| DELETE | `/:id` | Delete book | 🔑 Admin |

### 🗂️ Categories — `/api/v1/categories`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get all categories | ❌ |
| POST | `/` | Create category | 🔑 Admin |
| PUT | `/:id` | Update category | 🔑 Admin |
| DELETE | `/:id` | Delete category | 🔑 Admin |

### 🛒 Cart — `/api/v1/cart`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user cart | ✅ |
| POST | `/add` | Add item to cart | ✅ |
| PATCH | `/update` | Update item quantity | ✅ |
| DELETE | `/remove/:bookId` | Remove item from cart | ✅ |
| DELETE | `/clear` | Clear cart | ✅ |

### 📦 Orders — `/api/v1/orders`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Place new order | ✅ |
| GET | `/my-orders` | Get user orders | ✅ |
| GET | `/:id` | Get single order | ✅ |
| PATCH | `/:id/cancel` | Cancel order | ✅ |
| GET | `/:id/track` | Track order | ✅ |

### ❤️ Wishlist — `/api/v1/wishlist`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get wishlist | ✅ |
| POST | `/add` | Add to wishlist | ✅ |
| DELETE | `/remove/:bookId` | Remove from wishlist | ✅ |

### ⭐ Reviews — `/api/v1/reviews`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/:bookId` | Add review (verified purchase only) | ✅ |
| GET | `/:bookId` | Get book reviews | ❌ |
| DELETE | `/:id` | Delete own review | ✅ |

### 🎟️ Coupons — `/api/v1/coupons`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/validate` | Validate a coupon | ✅ |
| POST | `/` | Create coupon | 🔑 Admin |
| GET | `/` | Get all coupons | 🔑 Admin |
| PATCH | `/:id/toggle` | Toggle coupon active | 🔑 Admin |
| DELETE | `/:id` | Delete coupon | 🔑 Admin |

### 🔔 Notifications — `/api/v1/notifications`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/` | Get user notifications | ✅ |
| PUT | `/:id/read` | Mark one as read | ✅ |
| PUT | `/read-all` | Mark all as read | ✅ |
| DELETE | `/:id` | Delete notification | ✅ |
| POST | `/broadcast` | Send to all users | 🔑 Admin |

### 🔑 Admin — `/api/v1/admin`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/stats` | Dashboard stats |
| GET | `/dashboard/sales-chart` | Sales chart data |
| GET | `/orders` | All orders |
| PATCH | `/orders/:id/status` | Update order status |
| GET | `/users` | All users |
| PATCH | `/users/:id/ban` | Ban/Unban user |
| DELETE | `/users/:id` | Delete user |
| PATCH | `/books/:id/toggle-active` | Toggle book active |
| GET | `/reviews` | All reviews |
| DELETE | `/reviews/:id` | Delete review |
| GET | `/sales-report` | Sales report |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- Gmail account (for password reset emails)

---

### 🔧 Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
```

Fill in your `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string

CORS_ORIGIN=http://localhost:3000
NODE_ENV=development

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=1d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

```bash
# 4. Start development server
npm run dev
# Server will run at http://localhost:5000
```

---

### 🎨 Frontend Setup

```bash
# 1. Navigate to frontend
cd frontend-next

# 2. Install dependencies
npm install

# 3. Create .env.local file
```

Create `frontend-next/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

```bash
# 4. Start development server
npm run dev
# App will run at http://localhost:3000

# 5. Build for production
npm run build

# 6. Start production server
npm start
```

---

## 📁 Frontend Pages

| Route | Description | Auth |
|-------|-------------|------|
| `/` | Homepage (Hero, Categories, Featured, Bestsellers) | ❌ |
| `/books` | All Books with filters & search | ❌ |
| `/books/[id]` | Book Detail + Reviews | ❌ |
| `/login` | Login | ❌ |
| `/register` | Register | ❌ |
| `/forgot-password` | Forgot Password | ❌ |
| `/reset-password/[token]` | Reset Password | ❌ |
| `/cart` | Shopping Cart | ✅ |
| `/checkout` | Checkout | ✅ |
| `/orders` | My Orders | ✅ |
| `/orders/[id]` | Order Detail & Tracking | ✅ |
| `/wishlist` | My Wishlist | ✅ |
| `/profile` | User Profile | ✅ |
| `/admin` | Admin Dashboard | 🔑 Admin |
| `/admin/books` | Manage Books | 🔑 Admin |
| `/admin/orders` | Manage Orders | 🔑 Admin |
| `/admin/users` | Manage Users | 🔑 Admin |
| `/admin/categories` | Manage Categories | 🔑 Admin |
| `/admin/coupons` | Manage Coupons | 🔑 Admin |
| `/admin/reports` | Sales Reports | 🔑 Admin |
| `/admin/broadcast` | Send Notifications to All | 🔑 Admin |

---

## 🔒 Security Features

- **JWT Authentication** with HttpOnly cookies
- **Refresh Token** rotation
- **Helmet** for secure HTTP headers
- **Rate Limiting** — 100 req/15min globally, 5 req/15min on auth routes
- **CORS** whitelist
- **bcrypt** password hashing (salt rounds: 10)
- **Verified Purchase** — only buyers can review books
- **Role-based Access** — `user` and `admin` roles

---

## 🌐 SEO

- Dynamic `generateMetadata` for every Book page (title, description, Open Graph image)
- Global Open Graph & Twitter Card metadata
- `robots.txt` — controls Google crawler access
- `sitemap.xml` — dynamic sitemap with all book URLs
- Semantic HTML tags (`<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`)
- Unique `<h1>` on every page

---

## 🔔 Notification Triggers

### User Gets Notified When:
| Trigger | Message |
|---------|---------|
| Order placed | "Your order #X has been placed successfully!" |
| Order confirmed | "✅ Your order #X has been confirmed." |
| Order processing | "📦 Your order #X is being packed." |
| Order shipped | "🚚 Your order #X is on its way!" |
| Order delivered | "🎉 Your order #X has been delivered!" |
| Order cancelled | "❌ Your order #X has been cancelled." |
| Wishlist restock | "Good news! [Book] is back in stock." |
| Wishlist price drop | "💸 Price Drop! [Book] is now Rs. X." |
| Admin broadcast | Any admin announcement |

### Admin Gets Notified When:
| Trigger | Message |
|---------|---------|
| New order | "New Order #X placed by [User] for Rs. Y." |
| Low stock | "⚠️ Low Stock: '[Book]' has only X left." |
| New user | "New User Registered: [Name] ([Email])." |
| New review | "New 5⭐ review for '[Book]' by [User]." |

---

## 👩‍💻 Author

**Faiza Ibrahim**  
Full-Stack Developer

---

## 📄 License

ISC License
