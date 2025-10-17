# 💬 Firebase Chat Application

A modern real-time chat application built with Next.js 15, Firebase, and Tailwind CSS v4.

## ✨ Features

### 🔐 Authentication
- **Google Sign-In**: One-click authentication with Google
- **Email/Password**: Traditional signup and login
- **Secure Sessions**: Firebase authentication with persistent sessions

### 💬 Messaging (Full CRUD)
- **Create**: Send real-time messages to the chat
- **Read**: View all messages with real-time synchronization
- **Update**: Edit your own messages with edit indicator
- **Delete**: Remove your own messages with confirmation
- **Real-time Updates**: All changes sync instantly across all users

### 🎨 User Experience
- **Responsive Design**: Beautiful, mobile-friendly UI with Tailwind CSS
- **User Profiles**: Display user avatars and names in messages
- **Auto-scroll**: Automatically scroll to latest messages
- **Message Timestamps**: See when messages were sent and edited
- **Protected Routes**: Secure chat page accessible only to authenticated users
- **Edit Mode**: Inline editing with save/cancel options
- **Confirmation Dialogs**: Prevent accidental deletions

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Firebase (Authentication + Realtime Database)
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd firebase-chat/chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google providers)
   - Enable Realtime Database
   - Copy your Firebase configuration

4. Create a `.env.local` file in the `chat-app` directory:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DB_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MSG_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Firebase Setup

### Authentication
1. Go to Firebase Console → Authentication
2. Enable Email/Password sign-in method
3. Enable Google sign-in method
4. Add authorized domains if deploying

### Realtime Database
1. Go to Firebase Console → Realtime Database
2. Create a database (start in test mode for development)
3. **IMPORTANT**: Update security rules for CRUD operations

See [FIREBASE_SECURITY_RULES.md](./FIREBASE_SECURITY_RULES.md) for complete security rules that support:
- ✅ Users can only edit/delete their own messages
- ✅ Data validation for all fields
- ✅ Protection against unauthorized access

**Quick Rules** (for full rules, see FIREBASE_SECURITY_RULES.md):
```json
{
  "rules": {
    "messages": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$messageId": {
        ".write": "auth != null && (!data.exists() || data.child('userId').val() === auth.uid)"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth.uid === $uid"
      }
    }
  }
}
```

## 📁 Project Structure

```
chat-app/
├── src/
│   ├── app/
│   │   ├── chat/
│   │   │   └── page.tsx       # Chat interface
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   ├── signup/
│   │   │   └── page.tsx       # Signup page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout with AuthProvider
│   │   └── page.tsx           # Landing page
│   ├── contexts/
│   │   └── AuthContext.tsx    # Authentication context
│   └── lib/
│       └── firebase.ts        # Firebase configuration
├── .env.local                 # Environment variables (create this)
├── package.json
└── tailwind.config.js
```

## 🎨 Features Overview

### Landing Page
- Eye-catching gradient design
- Feature highlights
- Call-to-action buttons

### Authentication
- Email/Password signup and login
- Google Sign-In integration
- Form validation
- Error handling

### Chat Interface (Full CRUD Operations)
- **Create**: Send new messages in real-time
- **Read**: View all messages with live updates
- **Update**: Edit your own messages
  - Click "Edit" button on your messages
  - Inline editing with textarea
  - Save or cancel changes
  - Shows "(edited)" indicator
- **Delete**: Remove your own messages
  - Click "Delete" button on your messages
  - Confirmation dialog to prevent accidents
  - Instant removal from database
- Real-time message synchronization
- User avatars and names
- Message timestamps (sent and edited times)
- Smooth scrolling
- Responsive layout
- Logout functionality

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Make sure to:
- Set all environment variables
- Update Firebase authorized domains
- Enable necessary Firebase services

## 🔐 Security Considerations

- Never commit `.env.local` file
- Use proper Firebase security rules in production
- Enable App Check for additional security
- Implement rate limiting if needed

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for learning or production!

## 🆘 Troubleshooting

### Messages not appearing
- Check Firebase Database rules
- Verify authentication is working
- Check browser console for errors

### Authentication errors
- Verify Firebase config in `.env.local`
- Check if auth methods are enabled in Firebase Console
- For Google Sign-In, ensure authorized domains are configured

### Styling issues
- Clear Next.js cache: `rm -rf .next`
- Rebuild: `npm run build`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Built with ❤️ using Next.js, Firebase, and Tailwind CSS
