# Photo Visualizer - Architecture Documentation

## Overview
This document explains the refactored architecture of the Photo Visualization Tool, addressing state management, overlay positioning, and scalability concerns.

---

## Core Architectural Principles

### 1. **Centralized State Management**
All application state is managed through `WindowContext` using React's `useReducer` hook. This eliminates prop-drilling and ensures a single source of truth.

**State Structure:**
```javascript
{
  // Window designer state (existing)
  productType, location, jobType, dimensions, panes, grid, openers,
  finish, glass, glazing, hardware, extras, preview, drawing, ui
  
  // Photo visualization state (new)
  photoBank: [],                    // All uploaded photos
  selectedPhotoId: null,            // Currently selected photo
  draftVisualization: {             // Working state (editable)
    products: [],                   // Product overlays
    isDirty: false                  // Unsaved changes flag
  },
  completedVisualizations: []       // Saved visualizations (immutable)
}
```

### 2. **Normalized Coordinate System**
Product overlays use **normalized coordinates (0-1 range)** instead of absolute pixels.

**Benefits:**
- ✅ Overlays maintain position across container resizes
- ✅ Works correctly with different viewport sizes
- ✅ Survives zoom and device pixel ratio changes
- ✅ Serializable and portable

**Coordinate Utilities** (`src/utils/coordinateUtils.js`):
- `toNormalized(absolute, containerSize)` - Converts pixels to 0-1 range
- `toAbsolute(normalized, containerSize)` - Converts 0-1 range to pixels
- `constrainToBounds(normalized)` - Ensures coordinates stay within valid bounds

**Product Position Structure:**
```javascript
{
  position: {
    x: 0.35,        // 35% from left
    y: 0.25,        // 25% from top
    width: 0.30,    // 30% of container width
    height: 0.30    // 30% of container height
  },
  transform: {
    rotation: 0,    // Degrees
    skewX: 0,       // Degrees
    skewY: 0,       // Degrees
    scale: 1        // Multiplier
  }
}
```

### 3. **Draft vs Completed State Machine**

```
┌──────────────┐
│   Draft      │ ← Editable, can add/edit/delete products
│ Visualization│
└──────┬───────┘
       │ Save
       ↓
┌──────────────┐
│  Completed   │ ← Immutable, locked for integrity
│ Visualization│
└──────┬───────┘
       │ Load to Draft (creates editable copy)
       ↓
┌──────────────┐
│  New Draft   │
└──────────────┘
```

**Rules:**
- ✅ Draft visualizations are editable
- ✅ Completed visualizations are locked (immutable)
- ✅ Only completed visualizations can attach to quotes
- ✅ Loading a completed viz creates an editable copy in draft
- ✅ Cannot delete completed viz if attached to quote

### 4. **Unique ID Generation**
Uses `crypto.randomUUID()` for guaranteed uniqueness (fallback to timestamp + random for older browsers).

**Why not `Date.now()`?**
- ❌ Can create collisions if actions happen rapidly
- ❌ Not suitable for distributed systems
- ✅ UUIDs are globally unique

---

## Component Architecture

### **ProductOverlay** (`src/components/ProductOverlay.js`)
**Responsibilities:**
- Render product image at correct absolute position (converted from normalized)
- Handle drag, resize, and transform interactions
- Convert user actions back to normalized coordinates
- Support editable and locked (read-only) modes

**Key Features:**
- Drag handle: Move overlay
- Resize handle (bottom-right): Change dimensions
- Transform handle (top-right): Rotate
- Delete button (top-left): Remove overlay
- Maintains aspect ratio when Shift is held during resize

### **CanvasArea** (`src/components/CanvasArea.js`)
**Responsibilities:**
- Display background photo
- Track container size using ResizeObserver
- Render all product overlays with correct positioning
- Handle product uploads

**Key Features:**
- ResizeObserver monitors container size changes
- Passes containerSize to each ProductOverlay
- Only renders overlays when container has valid dimensions
- Shows helpful hints when empty

### **PhotoBank** (`src/components/PhotoBank.js`)
**Responsibilities:**
- Display uploaded photos
- Handle photo upload, rename, delete
- Indicate selected photo

**State Protection:**
- Warns before deleting selected photo with products

### **CompletedImages** (`src/components/CompletedImages.js`)
**Responsibilities:**
- Display saved visualizations
- Manage quote attachments
- Provide edit (load to draft) functionality
- Handle deletion with safeguards

**Business Rules:**
- Cannot delete if attached to quote
- Shows lock badge for immutable visualizations
- Shows checkmark for quote-attached items

---

## Data Flow

### **Adding a Product**
```
User uploads image
  ↓
CanvasArea converts to normalized coords (center position)
  ↓
actions.addProductToDraft()
  ↓
Reducer adds product with UUID, timestamps, default transform
  ↓
draftVisualization.isDirty = true
  ↓
ProductOverlay renders at normalized position
```

### **Dragging a Product**
```
User drags ProductOverlay
  ↓
ProductOverlay calculates new absolute position
  ↓
Convert to normalized coordinates
  ↓
actions.updateProductInDraft()
  ↓
Reducer updates product in draft
  ↓
Re-render with new position (maintains position on container resize)
```

### **Saving Visualization**
```
User clicks "Save Visualization"
  ↓
App.js creates visualization object
  ↓
actions.saveVisualization()
  ↓
Reducer:
  - Adds to completedVisualizations with UUID
  - Sets locked: true
  - Clears draftVisualization
  - Sets isDirty: false
  ↓
Auto-saved to localStorage
```

### **Loading for Edit**
```
User clicks "Edit" on completed visualization
  ↓
actions.loadVisualizationToDraft()
  ↓
Reducer:
  - Copies products to draft (new UUIDs)
  - Sets selectedPhotoId
  - Sets isDirty: false
  ↓
User can now edit the copy
```

---

## Persistence Layer

### **Auto-Save to LocalStorage**
- Triggered automatically when `photoBank` or `completedVisualizations` change
- Does NOT persist draft or UI state (intentional)
- Uses versioned format for future migrations

### **Manual Export/Import**
- Export visualization as JSON file
- Import from JSON file
- Generate shareable Base64 codes

**Functions** (`src/utils/persistenceUtils.js`):
- `saveToLocalStorage(state)`
- `loadFromLocalStorage()`
- `exportVisualizationAsJSON(viz)`
- `importVisualizationFromJSON(file)`
- `generateShareableCode(viz)`
- `parseShareableCode(code)`

---

## Quote Integration

### **Attaching to Quote**
Only completed (locked) visualizations can be attached to quotes.

```javascript
const quoteData = createQuoteData(completedVisualizations);
// Returns:
{
  visualizations: [
    { id, name, thumbnail, productCount, createdAt }
  ],
  totalProducts: 5,
  generatedAt: "2026-01-24T..."
}
```

**Safeguards:**
- ✅ Cannot delete visualization if attached to quote
- ✅ Must detach before deletion
- ✅ Visualization remains immutable while attached

---

## Scalability Considerations

### **Performance**
- Normalized coordinates have minimal computation overhead
- ResizeObserver efficiently tracks container changes
- Only re-renders affected components

### **Memory**
- Photos and overlays stored as base64 data URLs
- Consider moving to Blob URLs or server storage for production
- LocalStorage has ~5-10MB limit

### **Future Enhancements**
1. **Undo/Redo**: Easy to implement with reducer pattern
2. **Multi-select**: Extend ProductOverlay with selection state
3. **Snap-to-grid**: Add grid overlay and snapping logic
4. **Layers**: Add z-index management to products
5. **Templates**: Save/load common product arrangements
6. **Server Sync**: Replace localStorage with API calls
7. **Image Compression**: Reduce data URL sizes
8. **Collaborative Editing**: WebSocket + operational transforms

---

## Error Handling

### **Boundary Cases**
- Invalid container size → Skip rendering until valid
- Invalid normalized coords → Constrain to bounds
- Missing photo reference → Display placeholder
- Corrupted localStorage → Fallback to initial state

### **User Warnings**
- Unsaved changes before navigation
- Deleting photo with active products
- Loading visualization over unsaved work
- Attempting to delete quote-attached viz

---

## Testing Strategy

### **Unit Tests**
- Coordinate conversion functions
- State reducer actions
- Validation functions

### **Integration Tests**
- Product drag/resize/transform
- Save/load workflow
- Quote attachment logic
- Persistence round-trip

### **E2E Tests**
- Complete visualization creation flow
- Multi-product scenarios
- Container resize behavior
- Quote integration

---

## Migration Guide

If upgrading from old version:

1. **State Migration**
   ```javascript
   // Old: products with absolute coords
   { x: 100, y: 200, width: 150, height: 150 }
   
   // New: products with normalized coords
   { position: { x: 0.25, y: 0.30, width: 0.20, height: 0.20 } }
   ```

2. **Update Product Structure**
   - Add `transform` object
   - Replace `Date.now()` IDs with UUIDs
   - Add `createdAt` and `updatedAt` timestamps

3. **Context Migration**
   - Replace local state with `useWindow()` hook
   - Remove prop drilling
   - Use action creators

---

## API Reference

### **WindowContext Actions**

#### Photo Bank
- `addPhoto(photo)` - Add photo to bank
- `deletePhoto(photoId)` - Remove photo (clears draft if selected)
- `renamePhoto(photoId, newName)` - Update photo name
- `selectPhoto(photoId)` - Set active photo for canvas

#### Draft Visualization
- `addProductToDraft(product)` - Add product overlay
- `updateProductInDraft(product)` - Update position/transform
- `deleteProductFromDraft(productId)` - Remove product
- `clearDraft()` - Clear all products and selection

#### Completed Visualizations
- `saveVisualization(viz)` - Save draft as completed
- `deleteVisualization(vizId)` - Remove completed viz
- `toggleQuoteAttachment(vizId)` - Attach/detach from quote
- `loadVisualizationToDraft(vizId)` - Load for editing

---

## Troubleshooting

### **Overlays not positioning correctly**
✓ Check that containerSize is valid (width > 0, height > 0)
✓ Verify normalized coordinates are in 0-1 range
✓ Ensure ResizeObserver is active

### **State not persisting**
✓ Check localStorage is enabled
✓ Verify not in incognito mode
✓ Check localStorage quota not exceeded

### **Transforms not working**
✓ Verify CSS transform is applied correctly
✓ Check transformOrigin is set to 'center center'
✓ Ensure transition is disabled during interaction

---

## Summary

This refactored architecture provides:

✅ **Predictable State** - Single source of truth via WindowContext
✅ **Resilient Positioning** - Normalized coordinates survive resizes
✅ **Data Integrity** - Immutable completed visualizations
✅ **Scalability** - Clean separation of concerns
✅ **Persistence** - Auto-save with versioned format
✅ **Quote Integration** - Safeguards for production use

The system is now production-ready for customer sales scenarios with proper state management, error handling, and business rule enforcement.
