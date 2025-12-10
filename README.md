# 📦 MOOD Inventory Management System

A modern, full-stack inventory management application built with cutting-edge web technologies. This system provides comprehensive tools for managing products, stock movements, deliveries, staff, and real-time notifications.

## 🌟 Overview

MOOD is a sophisticated inventory management platform designed for warehouse operations and logistics management. It features a responsive UI, real-time data synchronization, and an intuitive dashboard for monitoring inventory metrics.

**Repository:** [GitHub](https://github.com/SamirRamosSati/mood-inventory-system)

---

## ✨ Key Features

### 📊 Dashboard
- **Real-time Metrics**: Total products, low stock items, daily movements, pending deliveries
- **Recent Movements**: Track ARRIVAL, DELIVERY, and PICKUP operations with timestamps (up to 10 items)
- **Low Stock Alerts**: Monitor products below threshold (≤3 units) with SKU and category info
- **Quick Navigation**: Direct links to products, stock movements, and deliveries via clickable stat cards

### 📦 Inventory Management
- **Product Management**: Create, edit, and manage product catalog with SKU, category, and brand
- **Stock Movements**: Log arrivals, deliveries, and pickups with detailed tracking and date selection
- **Low Stock Alerts**: Automatic notifications when items fall below threshold
- **Advanced Filtering**: Filter by category, brand, and stock levels
- **Beautiful Calendar**: Custom-built calendar component with timezone-safe date handling

### 🚚 Delivery Management
- **Delivery Tracking**: Create and manage customer deliveries with detailed information
- **Status Management**: Track delivery status (Pending, Completed, Paid)
- **Delivery Items**: Associate multiple items per delivery with quantities
- **Customer Management**: Store customer phone and address information
- **Dynamic Data Loading**: Multi-user support with proper data isolation

### 👥 Staff Management
- **User Management**: Create and manage team members with roles
- **Role-Based Access**: Manager and Warehouse Worker roles with appropriate permissions
- **Invite System**: Invite new staff members via email with secure tokens
- **Activity Tracking**: Track who created/modified records with timestamps

### 🔔 Notifications
- **Real-time Alerts**: Stock alerts and system notifications
- **Notification Center**: Centralized notification management
- **Push Notifications**: Email notifications for important events

### 🔐 Authentication & Security
- **Secure Login**: Email/password authentication with Supabase Auth
- **Session Management**: Persistent user sessions with automatic refresh
- **Password Reset**: Secure password recovery flow with token validation
- **Protected Routes**: Role-based access control on all pages

### 📱 User Experience
- **Responsive Design**: Mobile-first approach with breakpoints for all devices
- **Beautiful Calendar**: Custom calendar component with timezone-aware date handling
- **Dark Mode Ready**: Tailwind CSS with light theme implementation
- **Loading States**: Smooth loading screens and transitions
- **Accessibility**: Semantic HTML and ARIA labels throughout
- **Toast Notifications**: User-friendly feedback with react-hot-toast

---

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) - React metaframework with SSR/SSG
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**:
  - [Lucide React](https://lucide.dev/) - Beautiful icon library
  - [React Calendar](https://reactcalendar.io/) - Flexible calendar component
- **Animations**: [Framer Motion](https://www.framer.com/motion/) - Production-ready animation library
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/) - Toast notifications

### Backend & Database
- **Backend**: [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- **Database**: [Supabase](https://supabase.com/) - PostgreSQL with real-time capabilities
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth)
- **ORM**: Supabase PostgreSQL Client

### Email & Integrations
- **Email Service**: [SendGrid](https://sendgrid.com/) - Transactional email delivery
- **Performance Monitoring**: [Vercel Speed Insights](https://vercel.com/analytics/speed-insights)

### Developer Tools
- **Package Manager**: npm
- **Linting**: [ESLint](https://eslint.org/) - JavaScript linter
- **Type Checking**: TypeScript compiler
- **Build Tool**: Webpack (via Next.js)

---

## 📋 Project Structure

```
mood-inventory-system/
├── app/
│   ├── (auth)/                 # Authentication pages
│   │   ├── login/
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── (app)/                  # Protected application pages
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── staff/
│   │   ├── deliveries/
│   │   ├── stockMovements/
│   │   ├── notifications/
│   │   └── account/
│   ├── api/                    # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   ├── products/           # Product CRUD operations
│   │   ├── deliveries/         # Delivery management
│   │   ├── stockMovements/     # Stock movement tracking
│   │   ├── staff/              # Staff management
│   │   └── notifications/      # Notification endpoints
│   ├── set-password/           # Password setup page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
│
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── DatePickerCalendar.tsx
│   │   ├── logoutButton.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── layout/                 # Layout components
│   │   ├── navBar.tsx
│   │   └── sideBar.tsx
│   ├── dashboard/              # Dashboard specific components
│   │   ├── Card.tsx
│   │   ├── recentMovements.tsx
│   │   └── lowStock.tsx
│   ├── products/               # Product components
│   │   ├── productActions.tsx
│   │   └── productsForm.tsx
│   ├── deliveries/             # Delivery components
│   │   ├── DeliveryForm.tsx
│   │   ├── DeliveryItemsInput.tsx
│   │   └── RowActions.tsx
│   ├── staff/                  # Staff components
│   │   ├── staffForm.tsx
│   │   └── staffTable.tsx
│   ├── stockMovements/         # Stock movement components
│   │   ├── customTabs.tsx
│   │   ├── RowActions.tsx
│   │   └── stockMovement-form.tsx
│   └── ...
│
├── contexts/
│   ├── authContext.tsx         # Authentication context
│   └── dialogContext.tsx        # Dialog/modal context
│
├── hooks/
│   └── useDialog.ts            # Custom dialog hook
│
├── lib/
│   ├── utils.ts                # Utility functions
│   ├── avatarUtils.ts          # Avatar generation
│   ├── auth/
│   │   └── validateRequest.ts  # Auth validation
│   └── supabase/               # Supabase client utilities
│       ├── client.ts
│       ├── server.ts
│       ├── admin.ts
│       └── queries.ts
│
├── types/
│   └── index.ts                # TypeScript type definitions
│
├── config/
│   └── stockMovementConfig.ts  # Configuration constants
│
├── public/                     # Static assets
│   └── images/
│
└── [Config Files]
    ├── next.config.ts
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── postcss.config.mjs
    └── eslint.config.mjs
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm
- Supabase account
- SendGrid account (for email functionality)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/SamirRamosSati/mood-inventory-system.git
cd mood-inventory-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Supabase Database**
- Create a new Supabase project
- Run the SQL migrations for tables:
  - `products` - Product catalog
  - `stock_movements` - Movement tracking (ARRIVAL, DELIVERY, PICKUP)
  - `deliveries` - Customer deliveries
  - `staff_profile` - Team members
  - `users` - User accounts (managed by Supabase Auth)
  - `notifications` - System notifications
  - `pending_invites` - Staff invitations

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Database Schema

### Key Tables

**products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category TEXT,
  brand TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**stock_movements**
```sql
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('ARRIVAL', 'DELIVERY', 'PICKUP')) NOT NULL,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  arrival_date DATE,
  delivery_date DATE,
  pickup_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);
```

**deliveries**
```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  delivery_address TEXT,
  scheduled_date DATE,
  status TEXT CHECK (status IN ('pending', 'completed', 'paid')) DEFAULT 'pending',
  items JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);
```

**staff_profile**
```sql
CREATE TABLE staff_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('manager', 'warehouse_worker')) DEFAULT 'warehouse_worker',
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔐 Authentication Flow

1. **Login**: User submits email/password → Validated against Supabase Auth
2. **Session**: JWT token stored in secure HTTP-only cookie
3. **Protected Routes**: `useAuth` hook checks session on page load
4. **Password Reset**: 
   - User requests reset → Email sent via SendGrid with reset token
   - User clicks link → Validates token → Sets new password
5. **Staff Invitation**:
   - Manager sends invite → Email with registration link
   - New staff sets password → Account created

---

## 🎨 UI/UX Highlights

### Design System
- **Color Palette**: 
  - Primary: #DFCDC1 (Warm Beige) - Used for CTAs and highlights
  - Secondary: #1F2937 (Dark Gray) - Text and borders
  - Accent: Various status colors (green for success, orange for warning, etc.)

### Responsive Breakpoints
- **Mobile**: < 640px (full width)
- **Tablet**: 640px - 1024px (optimized layout)
- **Desktop**: > 1024px (full multi-column layout)

### Custom Components
- **DatePickerCalendar**: Beautiful calendar with timezone-safe date handling using React Calendar
- **StatCard**: Dashboard metric cards with icons and hover effects
- **Table**: Reusable, type-safe table component with generic typing
- **LoadingScreen**: Full-page loading indicator
- **Dialog**: Modal dialog for forms and confirmations

---

## 📱 Features by Page

### Dashboard
- Real-time inventory metrics with animations
- Recent stock movements feed (limited to 10 items)
- Low stock product alerts (limited to 10 items)
- Quick-access navigation with clickable stat cards
- Responsive grid layout for different screen sizes

### Products
- Full product catalog with search/filter
- Pagination support (10 items per page)
- Edit/delete operations with modals
- Bulk actions
- SKU and inventory tracking

### Stock Movements
- Log arrivals, deliveries, and pickups
- Filter by movement type
- Beautiful calendar picker for dates
- User attribution tracking
- Product quantity updates with form validation

### Deliveries
- Customer delivery management
- Multi-item delivery support with detailed form
- Status workflow (Pending → Completed → Paid)
- Customer contact information
- Delivery date scheduling with calendar picker

### Staff
- Team member management
- Role-based access (Manager/Warehouse Worker)
- Invite system with email
- User status tracking
- Profile management

### Notifications
- Real-time notification center
- Mark as read/unread
- Notification filtering
- System alerts

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/complete-reset` - Complete password reset
- `POST /api/auth/validate-reset-token` - Validate reset token
- `GET /api/auth/session` - Get current session

### Products
- `GET /api/products` - List all products (with pagination)
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Stock Movements
- `GET /api/stockMovements` - List movements (with filters/pagination)
- `POST /api/stockMovements` - Log new movement
- `GET /api/stockMovements/{id}` - Get movement details

### Deliveries
- `GET /api/deliveries` - List deliveries (with status filter)
- `POST /api/deliveries` - Create delivery
- `PUT /api/deliveries/{id}` - Update delivery
- `POST /api/deliveries/{id}/mark-completed` - Mark as completed
- `POST /api/deliveries/{id}/mark-paid` - Mark as paid
- `DELETE /api/deliveries/{id}` - Delete delivery

### Staff
- `GET /api/staff` - List staff members
- `POST /api/staff` - Create staff member
- `POST /api/staff/invite` - Invite new staff
- `POST /api/staff/validate-token` - Validate invitation token
- `POST /api/staff/complete-invite` - Complete invitation signup

### Notifications
- `GET /api/notifications` - List user notifications
- `POST /api/notifications/{id}` - Mark notification as read

---

## 🧪 Testing & Validation

### Input Validation
- Client-side form validation with user feedback
- Server-side API validation
- Database constraints
- Type safety with TypeScript

### Error Handling
- Try-catch blocks on all API routes
- User-friendly error messages via toast
- Logging for debugging
- Graceful fallbacks

---

## 📈 Performance Optimizations

- **Next.js Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **SSR/SSG**: Server-side rendering for initial load
- **Caching**: Strategic caching of API responses
- **Lazy Loading**: Components load on demand
- **Bundle Analysis**: Optimized bundle size
- **Pagination**: Reduces data loading per page

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Vercel automatically builds and deploys on push

```bash
# Or deploy via CLI
vercel
```

### Build for Production

```bash
npm run build
npm start
```

---

## 🎯 Development Workflow

### Code Quality
```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

### Git Workflow
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-name`
- Conventional commits recommended

---

## 📝 Key Implementation Details

### State Management
- **React Context**: Authentication and dialog state
- **useState**: Component-level state
- **useEffect**: Side effects and data fetching
- **useRouter**: Client-side navigation

### Custom Hooks
- **useAuth**: Authentication state management
- **useDialog**: Dialog/modal management

### Form Handling
- Controlled components with React state
- Custom DatePickerCalendar for dates (timezone-safe)
- Validation before submission
- Toast notifications for feedback

### Component Patterns
- Generic typing for reusable components (Table<T>)
- Compound components for complex UIs
- Custom hooks for shared logic
- Context API for global state

---

## 🐛 Troubleshooting

### Common Issues

**Calendar shows wrong date**
- Solution: Uses `getFullYear()`, `getMonth()`, `getDate()` for timezone-safe handling

**Login redirect not working**
- Check: Session cookie is properly set
- Solution: Clear cookies and try again

**Images not loading**
- Check: Image URLs in Supabase storage
- Solution: Verify bucket permissions

**Email not sending**
- Check: SendGrid API key is valid
- Check: Email addresses are correct
- Solution: Check SendGrid dashboard for bounce logs

**Deliveries not showing for all users**
- Solution: The application now shows all deliveries across all users (removed userId filter for multi-user support)

---

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Guides](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 👨‍💻 Author

**Samir Ramos Sati**

GitHub: [@SamirRamosSati](https://github.com/SamirRamosSati)

---

## 📄 License

This project is licensed under the MIT License.

---

## 🎉 Acknowledgments

- Supabase for reliable database and authentication
- Vercel for excellent Next.js hosting
- Tailwind CSS for beautiful utility-first styling
- The React community for amazing libraries

---

## 📞 Support

For support, open an issue on GitHub or contact via email.

---

**Last Updated**: December 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
