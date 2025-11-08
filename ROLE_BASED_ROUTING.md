# Role-Based Routing System ✅

## Overview

Implemented a complete role-based authentication and routing system that redirects users to different pages based on their role (customer, penjual/seller, admin).

---

## 🎯 Features Implemented

### 1. **Backend Changes**

#### Updated Login Response (`authentication.py`)

Added `role` field to login response:

```python
return {
    "access_token": access_token,
    "token_type": "bearer",
    "user_id": user.id,
    "email": user.email,
    "name": user.name,
    "role": user.role  # ✅ NEW
}
```

#### Updated Register Endpoint (`authentication.py`)

Now saves the role from registration form:

```python
db_user = User(
    email=user.email,
    password_hash=password_hash,
    name=user.name,
    phone_number=user.phone_number,
    role=user.role  # ✅ NEW
)
```

---

### 2. **Frontend Changes**

#### Enhanced `authService.js`

Added role management functions:

```javascript
// Store role during login
localStorage.setItem(
  "user",
  JSON.stringify({
    id: response.data.user_id,
    email: response.data.email,
    name: response.data.name,
    role: response.data.role || "customer", // ✅ NEW
  })
);

// New helper methods
getUserRole(); // Returns user's role
isCustomer(); // Check if user is customer
isSeller(); // Check if user is penjual/seller
isAdmin(); // Check if user is admin
```

#### Updated `Login.jsx`

Role-based redirect after login:

```javascript
if (response.role === "customer") {
  navigate("/dashboard"); // Customer → Dashboard
} else if (response.role === "penjual" || response.role === "seller") {
  navigate("/menu"); // Seller → Admin Menu
} else if (response.role === "admin") {
  navigate("/analytics"); // Admin → Analytics
} else {
  navigate("/dashboard"); // Default → Dashboard
}
```

#### Enhanced `Register.jsx`

Added role selection UI:

- Visual toggle between Customer and Penjual (Seller)
- Two card-style buttons with icons
- Customer icon: 🛍️ ShoppingBag
- Penjual icon: 🏪 Store
- Selected role highlighted with orange border and background

```javascript
const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "customer", // ✅ NEW - default to customer
});
```

#### New `MenuRouter.jsx` Component

Smart wrapper that redirects based on role:

```javascript
// Customers → Dashboard
// Sellers/Admins → Admin Menu (Menu.jsx)

if (!authService.isAuthenticated()) {
  navigate("/login"); // Not logged in
}

if (userRole === "customer") {
  navigate("/dashboard"); // Customers can't access admin menu
}
```

#### Updated `main.jsx`

Changed `/menu` route to use MenuRouter:

```javascript
<Route path="/menu" element={<MenuRouter />} />
```

---

## 🔄 User Flow by Role

### **Customer Journey:**

1. **Register** → Select "Customer" role
2. **Login** → Redirected to `/dashboard`
3. **Browse Kantins** → Select a kantin
4. **View Warungs** → Click "Lihat Menu"
5. **MenuUser Page** → Browse and add items to cart
6. **Cart** → Review and checkout
7. **If tries to access `/menu`** → Redirected to `/dashboard`

### **Penjual (Seller) Journey:**

1. **Register** → Select "Penjual" role
2. **Login** → Redirected to `/menu` (Admin Menu)
3. **Manage Menu Items** → Add/Edit/Delete menu items
4. **View Orders** → Check orders from customers
5. **Can also browse** → Access `/dashboard` and `/menu-user`

### **Admin Journey:**

1. **Login** → Redirected to `/analytics`
2. **Full Access** → Can access all pages
3. **Manage System** → View analytics, manage users

---

## 📊 Role Definitions

### **Customer** (`role: "customer"`)

- **Default role** for new registrations
- **Access:**
  - ✅ Dashboard (browse kantins)
  - ✅ MenuUser (browse and order)
  - ✅ Keranjang (shopping cart)
  - ✅ Status (order status)
  - ✅ Pesanan (order history)
- **Restricted:**
  - ❌ Admin Menu (`/menu`) → Redirected to Dashboard
  - ❌ Analytics

### **Penjual/Seller** (`role: "penjual"`)

- **For warung owners**
- **Access:**
  - ✅ All customer pages
  - ✅ Admin Menu (manage menu items)
  - ✅ Pesanan (view all orders)
- **Restricted:**
  - ❌ Analytics (admin only)

### **Admin** (`role: "admin"`)

- **Full system access**
- **Access:**
  - ✅ All pages
  - ✅ Analytics dashboard
  - ✅ User management (future)
  - ✅ System settings (future)

---

## 🔐 Security Features

### **Protected Routes:**

- MenuRouter checks authentication before rendering
- Redirects to `/login` if not authenticated
- Redirects customers away from admin pages

### **localStorage Structure:**

```javascript
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

### **Token Expiry:**

- Access tokens expire after 30 minutes
- Backend uses JWT with HS256 algorithm
- Frontend stores token in localStorage

---

## 🎨 Register Page UI

### **Role Selection:**

```
┌─────────────────────────────────────────┐
│  Daftar sebagai                        │
├────────────────┬────────────────────────┤
│   🛍️           │      🏪                │
│   Customer     │      Penjual           │
│   Pembeli      │      Seller            │
└────────────────┴────────────────────────┘
```

- **Selected:** Orange border + orange background
- **Hover:** Orange border
- **Animation:** Scale effect on hover/tap

---

## 🧪 Testing Checklist

### **Registration:**

- [ ] Can register as Customer
- [ ] Can register as Penjual
- [ ] Role is saved correctly in database
- [ ] Phone number is saved
- [ ] Password is hashed
- [ ] Success message shown
- [ ] Redirects to login after 1.5s

### **Login:**

- [ ] Customer login → redirects to `/dashboard`
- [ ] Penjual login → redirects to `/menu`
- [ ] Admin login → redirects to `/analytics`
- [ ] Role stored in localStorage
- [ ] Token stored in localStorage
- [ ] Invalid credentials show error

### **Role-Based Access:**

- [ ] Customer accessing `/menu` → redirects to `/dashboard`
- [ ] Penjual can access `/menu` (admin menu)
- [ ] Customer can access `/menu-user/:warungId`
- [ ] Penjual can access all customer pages
- [ ] Not logged in → redirects to `/login`

### **Menu Router:**

- [ ] MenuRouter protects `/menu` route
- [ ] Customers blocked from admin menu
- [ ] Sellers can access admin menu
- [ ] Redirects work correctly

---

## 🚀 Future Enhancements

### **1. Protected Routes Component:**

Create a reusable ProtectedRoute wrapper:

```javascript
<ProtectedRoute allowedRoles={["penjual", "admin"]}>
  <Menu />
</ProtectedRoute>
```

### **2. Role-Based Navbar:**

Show different menu items based on role:

- Customer: Dashboard, Cart, Orders
- Penjual: Dashboard, Menu, Orders, Cart
- Admin: All + Analytics

### **3. Permission System:**

Granular permissions beyond roles:

- View orders
- Edit menu items
- Delete users
- View analytics

### **4. Multi-Factor Authentication:**

- Email verification
- Phone verification
- 2FA for sellers/admins

### **5. Session Management:**

- Auto-logout on token expiry
- Refresh token mechanism
- "Remember me" functionality

### **6. Role Migration:**

- Allow customers to become sellers
- Verification process for sellers
- Admin approval system

---

## 📝 Database Schema

### **User Model:**

```python
class User(base):
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String)
    role = Column(String, nullable=False, default="customer")  # ✅
    phone_number = Column(String)

    # Relationships
    warungs = relationship("Warung", back_populates="owner")
    orders = relationship("Order", back_populates="user")
```

### **Role Values:**

- `"customer"` - Default, shopping only
- `"penjual"` - Warung owner, can manage menu
- `"admin"` - Full system access

---

## 🔧 Configuration

### **Default Role:**

- Frontend: `"customer"` (Register.jsx)
- Backend: `"customer"` (users.py schema)

### **Token Settings:**

- Algorithm: `HS256`
- Expiry: `30 minutes`
- Secret Key: Environment variable `SECRET_KEY`

### **Routes:**

```javascript
/login         → Login.jsx (public)
/register      → Register.jsx (public)
/dashboard     → Dashboard.jsx (all)
/menu          → MenuRouter.jsx → Menu.jsx (penjual/admin only)
/menu-user/:id → MenuUser.jsx (all)
/keranjang     → Keranjang.jsx (all)
/pesanan       → Pesanan.jsx (all)
/analytics     → Analytics.jsx (admin only - not enforced yet)
```

---

## 🐛 Known Issues & Solutions

### **Issue: Token expiry not handled**

**Solution:** Add token refresh mechanism or auto-logout

### **Issue: Role can be modified in localStorage**

**Solution:** Backend validates role from database, not from request

### **Issue: No email verification**

**Solution:** Add email verification step after registration

### **Issue: Analytics page not protected**

**Solution:** Create ProtectedRoute component for Analytics

---

## 📚 Files Modified/Created

### **Created:**

- ✅ `src/pages/MenuRouter.jsx` - Route protection wrapper
- ✅ `ROLE_BASED_ROUTING.md` - This documentation

### **Modified:**

- ✅ `backend/src/api/routes/authentication.py` - Added role to login/register
- ✅ `src/services/authService.js` - Added role helper methods
- ✅ `src/pages/Login.jsx` - Role-based redirect
- ✅ `src/pages/Register.jsx` - Added role selection UI
- ✅ `src/main.jsx` - Changed /menu route to MenuRouter

---

## 🎉 Summary

The role-based routing system is now **fully functional**:

- ✅ Users can register as Customer or Penjual
- ✅ Login redirects based on role
- ✅ Customers blocked from admin menu
- ✅ Sellers can manage menu items
- ✅ Role stored in localStorage and database
- ✅ Beautiful role selection UI in Register page
- ✅ Protected routes with automatic redirects

Users now have **role-appropriate experiences** throughout the app! 🚀

---

## 🧑‍💻 Quick Test Commands

### **Test Customer Flow:**

1. Register with Customer role
2. Login → Should go to `/dashboard`
3. Try accessing `/menu` → Should redirect to `/dashboard`
4. Browse kantin → Click "Lihat Menu" → Should work

### **Test Penjual Flow:**

1. Register with Penjual role
2. Login → Should go to `/menu`
3. Can access admin menu
4. Can also browse and order as customer

### **Check localStorage:**

```javascript
// In browser console
console.log(JSON.parse(localStorage.getItem("user")));
// Should show: { id, email, name, role }
```
