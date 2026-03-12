# 🧶 Soul Stitches - Handmade Crochet E-Commerce

A beautiful, full-stack e-commerce platform for Soul Stitches, a handmade crochet business. Built with React, Node.js, Express, and MongoDB.

---

## ✨ Features

- 🌸 **Beautiful UI** — Soft pastel aesthetic with cute animations
- 🛒 **Full Shopping Cart** — Add, remove, update quantities
- 💕 **Wishlist** — Save favourite items
- 📦 **Order System** — Complete checkout with order tracking
- 📧 **Email Confirmation** — Nodemailer order confirmation emails
- 👤 **User Authentication** — Register, login, profile management
- 🎛️ **Admin Dashboard** — Manage products, orders, inventory
- ⭐ **Reviews & Ratings** — Customer product reviews
- 📱 **Fully Responsive** — Mobile-first design
- 💰 **INR Currency** — All prices in Indian Rupees

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
# Install all dependencies
npm run install-all
```

### 2. Configure Environment

```bash
# Copy the example env file in /server
cp server/.env.example server/.env
```

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/soul-stitches
JWT_SECRET=your_super_secret_key_here

# Email (Gmail - enable App Passwords)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_char_app_password

CLIENT_URL=http://localhost:3000
```

### 3. Seed Admin User

```bash
cd server
npm install
node seed.js
```

**Admin credentials:**
- Email: `admin@soulstitches.in`
- Password: `admin123`

### 4. Start Development

```bash
# From root folder - starts both frontend and backend
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### 5. Seed Products

1. Login as admin at http://localhost:3000/login
2. Go to Admin Dashboard → click **"🌱 Seed Products"**
3. 12 sample crochet products will be added!

---

## 📁 Project Structure

```
soul-stitches/
├── client/                    # React Frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── layout/        # Navbar, Footer
│       │   ├── product/       # ProductCard
│       │   └── ui/            # Loading skeletons
│       ├── context/           # Auth, Cart, Wishlist contexts
│       └── pages/
│           ├── HomePage.js
│           ├── ShopPage.js
│           ├── ProductDetailPage.js
│           ├── CartPage.js
│           ├── CheckoutPage.js
│           ├── OrderSuccessPage.js
│           ├── OrderTrackPage.js
│           ├── LoginPage.js
│           ├── RegisterPage.js
│           ├── ProfilePage.js
│           ├── WishlistPage.js
│           └── admin/
│               ├── AdminDashboard.js
│               ├── AdminProducts.js
│               └── AdminOrders.js
└── server/                    # Node.js Backend
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   ├── Order.js
    │   └── Review.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── orders.js
    │   ├── cart.js
    │   ├── wishlist.js
    │   ├── reviews.js
    │   └── admin.js
    ├── middleware/
    │   └── auth.js
    ├── utils/
    │   └── email.js           # Nodemailer config
    ├── seed.js
    └── index.js
```

---

## 🛍️ Pages Overview

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Hero, featured products, categories, testimonials |
| Shop | `/shop` | All products with filters, search, pagination |
| Category | `/shop/:category` | Filtered by category |
| Product | `/product/:id` | Detail, gallery, add to cart, reviews |
| Cart | `/cart` | Shopping cart management |
| Checkout | `/checkout` | Customer info, address, payment |
| Order Success | `/order-success/:id` | Confirmation with order details |
| Track Order | `/track-order` | Enter order ID to track |
| Login | `/login` | User authentication |
| Register | `/register` | New user registration |
| Profile | `/profile` | User profile & order history |
| Wishlist | `/wishlist` | Saved products |
| Admin | `/admin` | Dashboard with stats |
| Admin Products | `/admin/products` | CRUD products |
| Admin Orders | `/admin/orders` | View & update orders |

---

## 🎛️ API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get profile
- `PUT /api/auth/profile` — Update profile

### Products
- `GET /api/products` — Get all (supports filters: category, search, sort, price range, featured, trending)
- `GET /api/products/:id` — Get single product
- `POST /api/products` — Create (admin)
- `PUT /api/products/:id` — Update (admin)
- `DELETE /api/products/:id` — Delete (admin)

### Orders
- `POST /api/orders` — Place order
- `GET /api/orders/my-orders` — User's orders
- `GET /api/orders/:orderId` — Track order by ID

### Reviews
- `GET /api/reviews/product/:id` — Get product reviews
- `POST /api/reviews` — Submit review

### Admin
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/orders` — All orders
- `PUT /api/admin/orders/:id` — Update order status
- `GET /api/admin/products` — All products
- `POST /api/admin/seed` — Seed sample products

---

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Google Account
2. Go to Google Account → Security → App Passwords
3. Generate a new app password for "Mail"
4. Use this 16-character password in `EMAIL_PASS`

---

## 🎨 Design System

- **Colors**: Blush pink, lavender, cream, sage
- **Fonts**: Playfair Display (headings), DM Sans (body), Dancing Script (accents)
- **Animations**: Float, fade-up, shimmer, bounce-soft
- **Currency**: Indian Rupees (₹ INR)

---

## 🌱 Sample Products Included

1. Cozy Cream Crochet Sweater — ₹1,299
2. Pink Boho Crochet Bag — ₹799
3. Lavender Crochet Scarf — ₹499
4. Cute Crochet Bear Plushie — ₹599
5. Rose Crochet Flower Bouquet — ₹899
6. Strawberry Crochet Keychain — ₹199
7. Pastel Rainbow Coaster Set — ₹349
8. Fluffy Winter Muffler — ₹649
9. Sunflower Crochet Hair Band — ₹249
10. Mini Crochet Flower Bunch — ₹399
11. Crochet Bunny Plushie — ₹699
12. Bohemian Crochet Tote Bag — ₹999

---

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
```bash
cd client && npm run build
# Deploy the /build folder
```

### Backend (Railway/Render/Heroku)
```bash
cd server
# Set environment variables in your hosting platform
# Start command: node index.js
```

### MongoDB Atlas
Replace `MONGODB_URI` with your Atlas connection string.

---

Made with 💕 for Soul Stitches | Handmade Crochet
