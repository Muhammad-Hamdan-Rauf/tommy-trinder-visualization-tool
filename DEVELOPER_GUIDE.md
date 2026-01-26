# Developer Quick Reference - Photo Visualizer

## Quick Start

### Accessing State
```javascript
import { useWindow } from './context/WindowContext.js';

function MyComponent() {
  const { state, actions } = useWindow();
  // state.photoBank, state.draftVisualization, etc.
}
```

---

## Common Operations

### 1. Add a Photo
```javascript
const photo = {
  id: generateUniqueId(),
  name: 'house.jpg',
  url: 'data:image/jpeg;base64,...',
  uploadedAt: new Date().toISOString()
};
actions.addPhoto(photo);
```

### 2. Add a Product Overlay
```javascript
const product = {
  name: 'window.png',
  url: 'data:image/png;base64,...',
  position: {
    x: 0.35,      // 35% from left
    y: 0.25,      // 25% from top
    width: 0.30,  // 30% of container width
    height: 0.30  // 30% of container height
  },
  transform: {
    rotation: 0,
    skewX: 0,
    skewY: 0,
    scale: 1
  }
};
actions.addProductToDraft(product);
```

### 3. Update Product Position
```javascript
const updatedProduct = {
  ...product,
  position: {
    x: 0.50,
    y: 0.40,
    width: 0.25,
    height: 0.25
  }
};
actions.updateProductInDraft(updatedProduct);
```

### 4. Save Visualization
```javascript
const visualization = {
  name: 'Customer Viz 1',
  backgroundPhotoId: selectedPhotoId,
  products: [...state.draftVisualization.products],
  thumbnail: selectedPhoto.url,
  attachedToQuote: false,
  locked: true
};
actions.saveVisualization(visualization);
```

---

## Coordinate Conversion

### Pixel to Normalized
```javascript
import { toNormalized } from './utils/coordinateUtils.js';

const normalized = toNormalized(
  { x: 100, y: 150, width: 200, height: 200 },
  { width: 800, height: 600 }
);
// Result: { x: 0.125, y: 0.25, width: 0.25, height: 0.333 }
```

### Normalized to Pixel
```javascript
import { toAbsolute } from './utils/coordinateUtils.js';

const absolute = toAbsolute(
  { x: 0.5, y: 0.5, width: 0.25, height: 0.25 },
  { width: 800, height: 600 }
);
// Result: { x: 400, y: 300, width: 200, height: 150 }
```

---

## State Access Patterns

### Read State
```javascript
const { state } = useWindow();

// Photos
const allPhotos = state.photoBank;
const selectedPhoto = state.photoBank.find(p => p.id === state.selectedPhotoId);

// Draft
const draftProducts = state.draftVisualization.products;
const hasUnsavedChanges = state.draftVisualization.isDirty;

// Completed
const allVisualizations = state.completedVisualizations;
const quoteAttached = state.completedVisualizations.filter(v => v.attachedToQuote);
```

### Dispatch Actions
```javascript
const { actions } = useWindow();

// Photos
actions.addPhoto(photo);
actions.deletePhoto(photoId);
actions.renamePhoto(photoId, newName);
actions.selectPhoto(photoId);

// Draft
actions.addProductToDraft(product);
actions.updateProductInDraft(product);
actions.deleteProductFromDraft(productId);
actions.clearDraft();

// Completed
actions.saveVisualization(viz);
actions.deleteVisualization(vizId);
actions.toggleQuoteAttachment(vizId);
actions.loadVisualizationToDraft(vizId);
```

---

## Component Patterns

### Container with Resize Tracking
```javascript
function MyCanvas() {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };
    
    const resizeObserver = new ResizeObserver(updateSize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => resizeObserver.disconnect();
  }, []);
  
  return <div ref={containerRef}>...</div>;
}
```

### Product Overlay Usage
```javascript
<ProductOverlay
  product={product}
  containerSize={containerSize}
  onUpdate={(updated) => actions.updateProductInDraft(updated)}
  onDelete={(id) => actions.deleteProductFromDraft(id)}
  editable={true}
/>
```

---

## Validation

### Validate Product
```javascript
import { isValidProduct } from './utils/persistenceUtils.js';

if (isValidProduct(product)) {
  actions.addProductToDraft(product);
} else {
  console.error('Invalid product structure');
}
```

### Validate Visualization
```javascript
import { isValidVisualization } from './utils/persistenceUtils.js';

if (isValidVisualization(viz)) {
  actions.saveVisualization(viz);
}
```

---

## Persistence

### Manual Save
```javascript
import { saveToLocalStorage } from './utils/persistenceUtils.js';

saveToLocalStorage(state);
```

### Manual Load
```javascript
import { loadFromLocalStorage } from './utils/persistenceUtils.js';

const savedState = loadFromLocalStorage();
if (savedState) {
  // Merge with initial state
}
```

### Export Visualization
```javascript
import { exportVisualizationAsJSON } from './utils/persistenceUtils.js';

exportVisualizationAsJSON(visualization);
// Downloads JSON file
```

### Import Visualization
```javascript
import { importVisualizationFromJSON } from './utils/persistenceUtils.js';

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'application/json';
fileInput.onchange = async (e) => {
  const file = e.target.files[0];
  try {
    const viz = await importVisualizationFromJSON(file);
    actions.saveVisualization(viz);
  } catch (err) {
    console.error('Import failed:', err);
  }
};
fileInput.click();
```

---

## Transforms

### Apply Transform
```javascript
import { createTransformString } from './utils/coordinateUtils.js';

const transformCSS = createTransformString({
  rotation: 45,
  skewX: 10,
  skewY: 5,
  scale: 1.2
});
// Result: "rotate(45deg) skew(10deg, 5deg) scale(1.2)"
```

### Default Transform
```javascript
import { createDefaultTransform } from './utils/coordinateUtils.js';

const transform = createDefaultTransform();
// { rotation: 0, skewX: 0, skewY: 0, scale: 1 }
```

---

## Business Rules

### Deleting Photos
```javascript
// Automatically clears draft if selected photo is deleted
actions.deletePhoto(photoId);
// state.draftVisualization.products will be empty if photoId was selected
```

### Saving Visualizations
```javascript
// Must have selected photo and products
if (selectedPhotoId && draftProducts.length > 0) {
  actions.saveVisualization(viz);
  // Automatically clears draft and sets isDirty = false
}
```

### Quote Attachments
```javascript
// Can only attach completed (locked) visualizations
if (viz.locked) {
  actions.toggleQuoteAttachment(viz.id);
}

// Cannot delete if attached
if (viz.attachedToQuote) {
  console.error('Detach from quote first');
  return;
}
actions.deleteVisualization(viz.id);
```

### Loading for Edit
```javascript
// Creates editable copy (non-destructive)
actions.loadVisualizationToDraft(vizId);
// Original remains in completedVisualizations
// Copy in draftVisualization has new UUIDs
```

---

## Debugging

### Log Current State
```javascript
const { state } = useWindow();
console.log('Current State:', JSON.stringify(state, null, 2));
```

### Monitor State Changes
```javascript
useEffect(() => {
  console.log('State updated:', state);
}, [state]);
```

### Track Dirty State
```javascript
const { state } = useWindow();
console.log('Has unsaved changes:', state.draftVisualization.isDirty);
```

---

## Common Pitfalls

### ❌ Don't mutate state directly
```javascript
// WRONG
state.photoBank.push(newPhoto);

// CORRECT
actions.addPhoto(newPhoto);
```

### ❌ Don't use absolute coordinates
```javascript
// WRONG
{ x: 100, y: 200, width: 150, height: 150 }

// CORRECT
{ position: { x: 0.125, y: 0.25, width: 0.1875, height: 0.25 } }
```

### ❌ Don't skip container size
```javascript
// WRONG
<ProductOverlay product={product} />

// CORRECT
<ProductOverlay product={product} containerSize={containerSize} />
```

### ❌ Don't modify completed visualizations
```javascript
// WRONG
completedViz.products.push(newProduct);

// CORRECT
actions.loadVisualizationToDraft(completedViz.id);
// Edit in draft, then save as new
```

---

## Performance Tips

1. **Memoize expensive calculations**
```javascript
const selectedPhoto = useMemo(
  () => state.photoBank.find(p => p.id === state.selectedPhotoId),
  [state.photoBank, state.selectedPhotoId]
);
```

2. **Debounce frequent updates**
```javascript
const debouncedUpdate = useMemo(
  () => debounce((product) => actions.updateProductInDraft(product), 100),
  []
);
```

3. **Use React.memo for pure components**
```javascript
const MemoizedOverlay = React.memo(ProductOverlay);
```

---

## Testing Helpers

### Mock Context
```javascript
const mockContext = {
  state: {
    photoBank: [],
    selectedPhotoId: null,
    draftVisualization: { products: [], isDirty: false },
    completedVisualizations: []
  },
  actions: {
    addPhoto: jest.fn(),
    deletePhoto: jest.fn(),
    // ... etc
  }
};

// Wrap component
<WindowContext.Provider value={mockContext}>
  <MyComponent />
</WindowContext.Provider>
```

### Test Coordinate Conversion
```javascript
import { toNormalized, toAbsolute } from './utils/coordinateUtils.js';

test('coordinates round-trip correctly', () => {
  const original = { x: 100, y: 200, width: 150, height: 150 };
  const container = { width: 800, height: 600 };
  
  const normalized = toNormalized(original, container);
  const converted = toAbsolute(normalized, container);
  
  expect(converted).toEqual(original);
});
```

---

## Resources

- **Architecture:** See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Summary:** See [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)
- **Context:** `src/context/WindowContext.js`
- **Utils:** `src/utils/coordinateUtils.js`, `src/utils/persistenceUtils.js`

---

## Need Help?

1. Check [ARCHITECTURE.md](ARCHITECTURE.md) for detailed explanations
2. Review [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md) for high-level overview
3. Look at existing components for usage examples
4. Check console for validation errors
