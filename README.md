# BookReader Pro - Premium Book Reading App

A beautiful, feature-rich book reading application built with React Native (Expo) and FastAPI.

## ✨ Features

- 📚 **Multi-Format Support**: PDF, DOCX, ePub, and article reading
- 🎨 **Premium Design**: Clean minimalist theme with dark mode for private space
- 🔒 **Private Space**: PIN-protected area for private books
- ✨ **Highlights & Notes**: Create unlimited highlights with notes
- 📊 **Reading Analytics**: Track reading time, streaks, and progress
- 📅 **Reading Calendar**: Visualize your reading activity
- 🏷️ **Smart Tagging**: Auto-categorization and custom tags
- 🔍 **Search**: Find books by title or tags
- 📖 **Reading Sessions**: Auto-resume from last page
- 🎯 **Completely Free**: No tiers, no limits

## 🎨 Design System

### Main App Theme (Light)
- **Primary Color**: #007AFF (iOS Blue)
- **Background**: Pure white (#FFFFFF)
- **Typography**: SF Pro / System font
- **Style**: Clean, minimalist, Apple Books inspired

### Private Space Theme (Dark)
- **Primary Color**: #6366F1 (Indigo)
- **Background**: Rich black (#0A0A0B)
- **Style**: Modern dark, Kindle inspired

## 📁 Project Structure

```
bookreader_export/
├── frontend/           # React Native (Expo) app
│   ├── app/           # File-based routing (expo-router)
│   │   ├── (tabs)/    # Main tab navigation
│   │   │   ├── library.tsx
│   │   │   ├── highlights.tsx
│   │   │   ├── tags.tsx
│   │   │   └── settings.tsx
│   │   ├── reader/    # Document reader
│   │   │   └── [id].tsx
│   │   ├── private_books.tsx  # Private space screen
│   │   └── _layout.tsx
│   ├── constants/
│   │   └── theme.ts   # Color system & design tokens
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── package.json
│   └── app.json
│
├── backend/           # FastAPI server
│   ├── server.py      # Main API with all endpoints
│   └── requirements.txt
│
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=bookreader
```

5. Run the server:
```bash
python server.py
```

Backend will run on `http://localhost:8001`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create `.env` file:
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:8001
```

4. Start Expo:
```bash
npx expo start
```

5. Open in:
- **iOS Simulator**: Press `i`
- **Android Emulator**: Press `a`
- **Web Browser**: Press `w`
- **Physical Device**: Scan QR code with Expo Go app

## 📱 Main Screens

### 1. Library
- View all non-private books
- Search by title or tags
- Upload new documents (PDF, DOCX)
- Track reading progress
- Delete books

### 2. Highlights
- View daily highlights (Today, Yesterday, Day Before)
- Browse highlights by book
- Swipeable carousel interface
- Add notes to highlights

### 3. Tags
- View all tags
- Filter books by tags
- Auto-generated tags (PDF, eBook, etc.)

### 4. Settings
- Reading analytics dashboard
- Reading calendar
- Private space access (PIN protected)
- How to use guide
- Contact support
- Notification settings

### 5. Private Books
- Dark-themed secure space
- PIN-protected access
- Separate from main library
- All features available

### 6. Reader (Coming Soon)
- PDF/Document viewing
- Highlight text
- Add notes
- Reading session tracking
- Auto-resume

## 🔐 Private Space

The Private Space is a secure, PIN-protected area with a distinct dark theme:

1. **Setup**: Go to Settings → Private Space → Setup PIN
2. **Access**: Enter PIN to view private books
3. **Theme**: Automatic dark theme when inside private space
4. **Privacy**: Highlights from private books stay separate

## 📊 Analytics Features

- **Total Reading Time**: Cumulative minutes spent reading
- **Current Streak**: Days in a row with reading activity
- **Books Completed**: Number of finished books
- **Calendar View**: Visual heatmap of reading activity
- **Time per Book**: See which books you've spent most time on

## 🎯 API Endpoints

### Documents
- `GET /api/documents` - List all documents
- `POST /api/documents` - Upload new document
- `GET /api/documents/{id}` - Get single document
- `DELETE /api/documents/{id}` - Delete document

### Highlights
- `GET /api/highlights` - List all highlights
- `GET /api/highlights/daily` - Get last 3 days
- `POST /api/highlights` - Create highlight

### Reading Sessions
- `POST /api/reading_sessions/start` - Start session
- `POST /api/reading_sessions/{id}/end` - End session

### Analytics
- `GET /api/analytics` - Get reading stats
- `GET /api/analytics/calendar` - Get calendar data

### Private Space
- `GET /api/private-space/status` - Check if configured
- `POST /api/private-space/setup` - Setup/change PIN
- `POST /api/private-space/verify` - Verify PIN

### Tags
- `GET /api/tags` - List all unique tags

## 🎨 Customization

### Changing Colors

Edit `/frontend/constants/theme.ts`:

```typescript
export const Colors = {
  primary: '#007AFF',      // Main brand color
  accent: '#FF6B6B',       // Call-to-action color
  background: '#FFFFFF',   // Main background
  // ... more colors
};
```

### Adding New Features

1. **New Screen**: Create file in `/frontend/app/`
2. **New API Endpoint**: Add to `/backend/server.py`
3. **New Component**: Create in `/frontend/components/`

## 📦 Building for Production

### Web
```bash
cd frontend
npx expo export:web
```

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
npx expo start --clear
```

### Backend Not Starting
- Check MongoDB is running
- Verify `.env` file exists
- Check port 8001 is not in use

### App Not Loading
- Clear Expo cache
- Restart Metro bundler
- Check backend URL in `.env`

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

This is a personal project export, but feel free to fork and customize for your needs!

## 📧 Support

For issues or questions, create an issue in the repository or contact support.

## 🎉 Credits

Built with:
- [Expo](https://expo.dev)
- [React Native](https://reactnative.dev)
- [FastAPI](https://fastapi.tiangolo.com)
- [MongoDB](https://www.mongodb.com)
- [TypeScript](https://www.typescriptlang.org)

---

**Made with ❤️ for book lovers**
