# Photo Visualizer - Interactive Product Embedding Tool

A production-ready photo visualization and quoting system for embedding product images onto customer photos with precise positioning, transformations, and quote integration.

## 🎯 Features

### Core Functionality
- **Photo Bank**: Upload, manage, and select background photos
- **Product Embedding**: Add product images as overlays on photos
- **Interactive Controls**:
  - Drag to reposition
  - Resize with aspect ratio lock (Shift key)
  - Rotate using transform handle
  - Delete with confirmation
- **Real-Time Updates**: All changes reflected instantly
- **Draft System**: Work on visualizations with auto-save
- **Completed Visualizations**: Immutable saved states with quote integration
- **Persistence**: Auto-save to localStorage with import/export

### Technical Highlights
- ✅ **Normalized Coordinates**: Overlays maintain position across window resizes, zoom, and device changes
- ✅ **Centralized State**: Single source of truth using React Context + Reducer
- ✅ **Immutable Completed States**: Locked visualizations prevent accidental edits
- ✅ **UUID-based IDs**: Guaranteed uniqueness for all entities
- ✅ **Transform Support**: Rotation, skew, and scale with composable CSS transforms
- ✅ **ResizeObserver**: Automatic tracking of container dimensions
- ✅ **Quote Safeguards**: Cannot delete or modify visualizations attached to quotes

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

---

## 📖 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Comprehensive architecture documentation
- **[REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)** - Refactoring details and improvements
- **[DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)** - Quick reference for developers

---

## 🏗️ Architecture Overview

### State Management
Centralized state using `WindowContext`:
```javascript
{
  photoBank: [],                    // All uploaded photos
  selectedPhotoId: null,            // Currently active photo
  draftVisualization: {             // Working state (editable)
    products: [],                   // Product overlays
    isDirty: false                  // Unsaved changes flag
  },
  completedVisualizations: []       // Saved states (immutable)
}
```

### Coordinate System
Products use **normalized coordinates (0-1 range)** instead of absolute pixels:
```javascript
position: {
  x: 0.35,      // 35% from left
  y: 0.25,      // 25% from top
  width: 0.30,  // 30% of container width
  height: 0.30  // 30% of container height
}
```

**Benefits:**
- Overlays maintain exact position across viewport changes
- Works with different screen sizes and resolutions
- Survives zoom and device pixel ratio changes
- Portable and serializable

### State Machine
```
Draft (editable) → Save → Completed (locked) → Load to Draft (copy)
```

---

## 🎨 Usage

### 1. Upload a Background Photo
Click "Add Photo" in the Photo Bank sidebar to upload a background image.

### 2. Select Photo
Click on a photo in the Photo Bank to activate it on the canvas.

### 3. Add Product Overlays
Click "Add Product Image" to upload a product image that will overlay on your photo.

### 4. Position & Transform
- **Drag** the overlay to move it
- **Drag bottom-right handle** to resize (hold Shift for aspect ratio lock)
- **Drag top-right handle** to rotate
- **Click X button** to delete

### 5. Save Visualization
Click "Save Visualization" when satisfied. Your work becomes an immutable completed visualization.

### 6. Attach to Quote
In the Completed Images sidebar, click "Add to Quote" to attach the visualization to a customer quote.

---

## 🧪 Testing

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
```

---

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Context + Reducer** - State management
- **ResizeObserver API** - Container size tracking
- **LocalStorage** - Persistence layer
- **CSS3 Transforms** - Rotation, skew, scale
- **Crypto API** - UUID generation

---

## 📦 Project Structure

```
src/
├── components/
│   ├── CanvasArea.js           # Main canvas with overlays
│   ├── ProductOverlay.js       # Draggable/resizable overlay
│   ├── PhotoBank.js            # Photo management
│   ├── CompletedImages.js      # Saved visualizations
│   └── Controls.js             # Save/clear buttons
├── context/
│   └── WindowContext.js        # Centralized state management
├── utils/
│   ├── coordinateUtils.js      # Coordinate conversion
│   └── persistenceUtils.js     # Serialization/storage
├── App.js                      # Main application
└── App.css                     # Styles
```

---

## 🔧 Configuration

### Coordinate Conversion
```javascript
import { toNormalized, toAbsolute } from './utils/coordinateUtils.js';

// Convert pixels to normalized
const normalized = toNormalized(
  { x: 100, y: 150, width: 200, height: 200 },
  { width: 800, height: 600 }
);

// Convert normalized to pixels
const absolute = toAbsolute(normalized, containerSize);
```

### Persistence
```javascript
import { saveToLocalStorage, loadFromLocalStorage } from './utils/persistenceUtils.js';

// Auto-save (happens automatically)
saveToLocalStorage(state);

// Manual load
const savedState = loadFromLocalStorage();
```

---

## 🐛 Troubleshooting

### Overlays not positioning correctly
- Ensure container has valid dimensions (width > 0, height > 0)
- Check that normalized coordinates are in 0-1 range
- Verify ResizeObserver is active

### State not persisting
- Check localStorage is enabled (not in incognito mode)
- Verify localStorage quota not exceeded (~5-10MB)
- Check browser console for errors

### Transforms not working
- Verify CSS transform is applied
- Check transformOrigin is 'center center'
- Ensure transitions disabled during interaction

---

## 🚦 Deployment

### Build for Production
```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Netlify/Vercel
```bash
# Push to GitHub, connect repository
# Set build command: npm run build
# Set publish directory: dist
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🙏 Acknowledgments

- Built with React + Vite
- Inspired by professional visualization tools
- Designed for real customer sales scenarios

---

## 📞 Support

For questions or issues:
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for detailed explanations
- Review [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for code examples
- Open an issue on GitHub

---

**Status:** ✅ Production Ready | **Version:** 2.0.0 | **Last Updated:** January 2026
