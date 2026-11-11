# BookReader Pro - Technical Architecture

## System Overview

BookReader Pro is a full-stack mobile application for reading and managing books with advanced features like highlights, analytics, and a secure private space.

### Technology Stack

**Frontend:**
- React Native with Expo SDK
- TypeScript
- Expo Router (file-based routing)
- Axios (HTTP client)
- AsyncStorage (local data)
- date-fns (date formatting)

**Backend:**
- FastAPI (Python web framework)
- Motor (async MongoDB driver)
- Bcrypt (password hashing)
- Pydantic (data validation)

**Database:**
- MongoDB (NoSQL document database)

## Architecture Diagram

```
┌─────────────────┐
│   Mobile App    │
│  (React Native) │
│                 │
│  ┌───────────┐  │
│  │  Library  │  │
│  │Highlights │  │
│  │   Tags    │  │
│  │ Settings  │  │
│  └───────────┘  │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│   FastAPI       │
│   Backend       │
│  ┌──────────┐   │
│  │ REST API │   │
│  │Endpoints │   │
│  └────┬─────┘   │
└───────┼─────────┘
        │
┌───────▼─────────┐
│   MongoDB       │
│   Collections   │
│                 │
│  • documents    │
│  • highlights   │
│  • sessions     │
│  • private      │
└─────────────────┘
```

## Data Models

### Document
```typescript
{
  document_id: string (UUID)
  user_id: string
  title: string
  file_type: "pdf" | "epub" | "docx" | "article"
  file_data: string (base64)
  is_private: boolean
  is_pinned: boolean
  tags: string[]
  current_page: number
  total_pages: number
  last_read_at: datetime | null
  created_at: datetime
}
```

### Highlight
```typescript
{
  highlight_id: string (UUID)
  document_id: string
  user_id: string
  text: string
  note: string | null
  page_number: number
  color: string (hex color)
  created_at: datetime
}
```

### Reading Session
```typescript
{
  session_id: string (UUID)
  user_id: string
  document_id: string
  start_time: datetime
  end_time: datetime | null
  duration_minutes: number
}
```

### Private Space Config
```typescript
{
  user_id: string
  pin_hash: string (bcrypt)
  updated_at: datetime
}
```

## API Architecture

### Base URL
```
http://localhost:8001/api
```

### Authentication
Simple Bearer token authentication using user session ID:
```
Authorization: Bearer {session_token}
```

### Endpoints Structure

#### Documents
- `GET /api/documents` - List documents (with filters)
- `POST /api/documents` - Upload new document
- `GET /api/documents/{id}` - Get single document
- `DELETE /api/documents/{id}` - Delete document

#### Highlights
- `GET /api/highlights` - List all highlights
- `GET /api/highlights/daily` - Last 3 days
- `POST /api/highlights` - Create highlight

#### Analytics
- `GET /api/analytics` - Reading statistics
- `GET /api/analytics/calendar` - Calendar heatmap data

#### Private Space
- `GET /api/private-space/status` - Check if configured
- `POST /api/private-space/setup` - Create/change PIN
- `POST /api/private-space/verify` - Verify PIN

## Frontend Architecture

### Routing Structure (expo-router)

```
app/
├── _layout.tsx           # Root layout with auth
├── (tabs)/              # Tab navigation group
│   ├── _layout.tsx      # Tab bar configuration
│   ├── library.tsx      # Main library screen
│   ├── highlights.tsx   # Highlights screen
│   ├── tags.tsx         # Tags screen
│   └── settings.tsx     # Settings screen
├── reader/
│   └── [id].tsx        # Dynamic route for reader
└── private_books.tsx   # Private space (dark theme)
```

### State Management

**Context API:**
- `AuthContext` - User session and authentication

**Local State:**
- Component-level state with React hooks
- AsyncStorage for persistent data

### Theme System

Two complete theme sets defined in `/constants/theme.ts`:

**Light Theme (Main App):**
- Minimalist, clean design
- Primary: #007AFF
- Background: #FFFFFF
- High contrast

**Dark Theme (Private Space):**
- Rich, sophisticated
- Primary: #6366F1
- Background: #0A0A0B
- High contrast on dark

## Security Features

### PIN Protection
- **Algorithm**: BCrypt with salt
- **Storage**: Hashed in MongoDB
- **Validation**: Server-side verification

### Data Isolation
- Private documents filtered by `is_private` flag
- Separate navigation for private space
- Distinct UI theme for visual separation

### Session Management
- Client-side session tokens
- Stored in AsyncStorage (encrypted on device)
- Bearer token authentication

## Performance Optimizations

### Frontend
- **List Virtualization**: FlatList for large document lists
- **Lazy Loading**: Documents loaded on demand
- **Image Optimization**: Base64 with compression
- **Memoization**: React.memo for expensive components

### Backend
- **Async/Await**: Non-blocking I/O with Motor
- **Connection Pooling**: MongoDB connection reuse
- **Indexed Queries**: MongoDB indexes on user_id, document_id

### Database
```javascript
// Recommended indexes
db.documents.createIndex({ user_id: 1, is_private: 1 })
db.highlights.createIndex({ user_id: 1, created_at: -1 })
db.reading_sessions.createIndex({ user_id: 1, start_time: -1 })
```

## File Upload Flow

```
1. User selects document (PDF/DOCX)
   ↓
2. Expo DocumentPicker reads file
   ↓
3. Convert to Base64 (FileSystem.readAsStringAsync)
   ↓
4. Send to backend via multipart/form-data
   ↓
5. Backend stores in MongoDB
   ↓
6. Auto-extract metadata (tags, page count)
   ↓
7. Return document object to frontend
```

## Reading Analytics Pipeline

```
1. User opens book
   ↓
2. Start reading session (POST /reading_sessions/start)
   ↓
3. Update document.last_read_at
   ↓
4. User closes book
   ↓
5. End session with duration (POST /reading_sessions/{id}/end)
   ↓
6. Update current_page
   ↓
7. Aggregate sessions for analytics (GET /analytics)
```

## Deployment Architecture

### Development
```
Frontend: Expo Dev Server (port 3000)
Backend: Uvicorn (port 8001)
Database: MongoDB local (port 27017)
```

### Production
```
Frontend: Expo/EAS Build → App Store/Play Store
Backend: FastAPI → Docker → Cloud (AWS/GCP/Heroku)
Database: MongoDB Atlas (managed)
```

## Error Handling

### Frontend
```typescript
try {
  const response = await axios.get('/api/documents');
  setDocuments(response.data);
} catch (error) {
  if (error.response?.status === 404) {
    Alert.alert('Not Found', 'Document not found');
  } else {
    Alert.alert('Error', 'Something went wrong');
  }
}
```

### Backend
```python
@api_router.get("/documents/{document_id}")
async def get_document(document_id: str):
    document = await db.documents.find_one({"document_id": document_id})
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return document
```

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Expo testing tools
- **E2E Tests**: Detox (planned)

### Backend Testing
- **Unit Tests**: Pytest
- **API Tests**: TestClient (FastAPI)
- **Load Tests**: Locust (planned)

## Future Enhancements

### Planned Features
1. **PDF Viewer**: Native PDF rendering with react-native-pdf
2. **Google Drive Sync**: Backup highlights to cloud
3. **Push Notifications**: Daily highlight reminders
4. **Google Translate**: In-app translation
5. **Export Highlights**: PDF/Markdown export
6. **Book Sharing**: Share book recommendations
7. **Reading Goals**: Daily/weekly targets
8. **Dark Mode Toggle**: System-wide dark theme

### Technical Improvements
1. **Caching**: Redis for session management
2. **CDN**: CloudFront for static assets
3. **Real-time**: WebSocket for collaborative reading
4. **Search**: Elasticsearch for full-text search
5. **OCR**: Text extraction from images

## Troubleshooting Guide

### Common Issues

**1. App won't load**
- Clear Expo cache: `npx expo start --clear`
- Check backend is running
- Verify `.env` file

**2. Backend errors**
- Check MongoDB connection
- Verify Python dependencies
- Check logs: `tail -f logs/backend.log`

**3. Upload failures**
- Check file size (default 10MB limit)
- Verify file format support
- Check network connection

**4. PIN not working**
- Clear app data
- Recreate PIN
- Check backend logs for bcrypt errors

## Performance Benchmarks

### Target Metrics
- **App Launch**: < 2 seconds
- **Document List Load**: < 500ms
- **Highlight Creation**: < 100ms
- **API Response Time**: < 200ms
- **Database Query**: < 50ms

### Monitoring
- Backend: FastAPI built-in metrics
- Frontend: React Native Performance Monitor
- Database: MongoDB Atlas monitoring

## Contributors

Built with ❤️ for book lovers

## Version History

- **v1.0.0** (Current) - Initial release with core features
- **v0.9.0** - Beta release
- **v0.5.0** - Alpha release

---

*Last updated: 2024*
