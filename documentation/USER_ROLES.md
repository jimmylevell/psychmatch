# User Roles and Profile Management

This document describes the new role-based access control and profile management features.

## Features

### 1. Email Attribute for Psychologists
- Psychologists now have an email field in their profile
- Email is used to link psychologist profiles with user accounts
- Email field is unique and required when creating new psychologist profiles

### 2. User Roles
Two roles are supported:
- **Administrator**: Full access to all features including:
  - User management (create, update, delete users and assign roles)
  - Psychologist management (create, update, delete any psychologist)
  - Document management
  
- **Psychologist**: Limited access to:
  - View their own psychologist profile (based on email)
  - Edit their own psychologist profile
  - Document management (existing functionality)

### 3. Profile Editing
- Psychologists can edit their own profile through the "My Profile" page
- Profile is matched based on the logged-in user's email address
- Psychologists cannot change their email through the profile editor
- Administrators can edit any psychologist profile through the "Psychologists" page

### 4. User Management (Administrators Only)
- Accessible through the "Users" page in the navigation
- Administrators can:
  - View all users and their roles
  - Create new users by specifying email and role
  - Update user roles
  - Delete users

## API Endpoints

### User Management
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/me` - Get current user info
- `POST /api/users` - Create or update user (admin only)
- `PUT /api/users/:id` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Psychologist Profile
- `GET /api/psychologists/profile/me` - Get current user's psychologist profile
- `PUT /api/psychologists/profile/me` - Update current user's psychologist profile

## Setup Instructions

### 1. Database Migration
No automatic migration is provided. To use the new features:

1. **Update existing psychologists with email addresses** (run in MongoDB):
```javascript
// First, manually set email addresses for existing psychologists
// Example for a specific psychologist:
db.psychologist.updateOne(
  { name: "Dr. Smith" },
  { $set: { email: "dr.smith@example.com" } }
)

// Note: Each psychologist must have a unique email address
// You need to update each psychologist individually with their actual email
```

2. **Create admin user** (run in MongoDB):
```javascript
db.user.insertOne({
  _id: ObjectId(),
  email: "admin@example.com",
  role: "administrator",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

3. **Create psychologist users** (run in MongoDB):
```javascript
db.user.insertOne({
  _id: ObjectId(),
  email: "psychologist@example.com",
  role: "psychologist",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### 2. Update Psychologist Emails
Through the admin interface:
1. Log in as an administrator
2. Navigate to "Psychologists"
3. Edit each psychologist to add their email address

### 3. Azure AD Configuration
The user's email is extracted from the JWT token claims:
- `preferred_username`
- `upn`
- `email`

Ensure your Azure AD application is configured to include these claims in the token.

## Security Considerations

1. **Role Assignment**: Only administrators can assign roles to users
2. **Profile Isolation**: Psychologists can only access and edit their own profile
3. **Email Validation**: Email is matched case-insensitively
4. **JWT Authentication**: All endpoints require valid JWT authentication
5. **Authorization**: Endpoints are protected with role-based middleware

### Known Security Limitations
1. **Rate Limiting**: The API endpoints do not currently implement rate limiting. This is a pre-existing condition affecting all routes in the application. Consider adding rate-limiting middleware (e.g., express-rate-limit) to prevent abuse:
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

## Frontend Pages

### New Pages
1. **My Profile** (`/my-profile`)
   - Shows current user information and psychologist profile
   - Allows psychologists to edit their own profile
   
2. **User Management** (`/users`)
   - Admin-only page for managing user roles
   - Create, update, and delete users

### Updated Pages
1. **Psychologists** (`/psychologists`)
   - Now includes email field in the editor
   - Administrators can manage all psychologist profiles
