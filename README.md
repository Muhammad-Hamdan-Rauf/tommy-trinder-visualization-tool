# Tommy Trinder Window Designer & Visualization Tool

A professional-grade window design and visualization application built for Tommy Trinder, enabling customers and sales representatives to configure custom windows with real-time preview capabilities.

## 🎯 Overview

This application provides a complete window configuration system similar to TommyTrinder.com, featuring:
- Interactive window drawing canvas
- Real-time window preview with dynamic rendering
- Comprehensive configuration options (Openers, Profile, Finish, Glass, Glazing, Hardware, Extras)
- Photo visualization for embedding designed windows onto customer photos

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

## ✨ Features

### 1. Product Setup
- **Product Type Selection**: Flush Casement, Standard Casement, Tilt & Turn
- **Location Input**: Customer location reference
- **Job Type**: Supply Only, Supply & Fit options

### 2. Window Drawing Canvas
- **Freehand Drawing**: Draw custom window shapes with multi-segment support
- **Real-time Synchronization**: Drawing instantly reflects in preview
- **Undo/Redo**: Full history management with granular undo per segment
- **Dimension Display**: Shows width/height with proper arrow annotations

### 3. Sidebar Configuration Tabs

#### OPENERS Tab
- Configure opener types per pane (TLO, TRO, TSLO, TSRO, Fixed, etc.)
- Visual opener icons with descriptions
- Click panes to assign openers

#### PROFILE Tab
- Profile style selection: Flush, Sculptured, Chamfered
- Dynamic preview updates based on selection

#### FINISH Tab
- **Frame/Sash/Cill Finishes**: Separate configuration for each part
- **Color Categories**: Foils, Sprayed, Standard
- **50+ Color Options**: Including White Grain, Anthracite Grey, Chartwell Green, etc.
- Real-time color preview on window

#### GLASS Tab
- **15 Realistic Glass Textures**:
  - Clear, Flemish, Autumn, Digital, Taffeta
  - Everglade, Cotswold, Arctic, Minster, Charcoal Sticks
  - Contora, Mayflower, Oak, Warwick, Sycamore
- CSS-based realistic patterns for each texture
- Apply to individual panes or all panes

#### GLAZING Tab
- **Glazing Types**: Astragal, Georgian, Leaded bars
- **Configurable Bar Counts**: Horizontal and vertical bars
- **Bar Profiles**: Standard Ovolo options
- Visual preview of glazing patterns

#### HARDWARE Tab
- **Handle Types**:
  - SAC Signature Antique Black
  - Teardrop Antique Black/Chrome/Gold
  - Connoisseur Antique Black/Chrome/Gold
  - Maxim Antique Black/Chrome/White
  - Ventiss Antique Black/Chrome
  - Ventiss Designer Antique Black/Chrome
- **Ventilation Options**: Trickle vents, night vents
- Dynamic handle rendering matching selection

#### EXTRAS Tab
- **Cill Options**: Stub (40mm), Standard (85mm), Large (150mm), Extra Large (225mm)
- **Cill Dimensions**: Length, left horn, right horn configuration
- **Head Drip**: Weather protection at top of frame
- **Weather Bar**: Additional seal at bottom of sash
- Visual previews for each extra

### 4. Live Window Preview
- **Dynamic Rendering**: Real-time updates as configurations change
- **Handle Styles**: 6 different SVG handle designs
- **Glass Textures**: Realistic CSS patterns
- **Profile Visualization**: Frame styling based on profile selection
- **Dimension Arrows**: Proper engineering-style dimension lines

### 5. Photo Visualization
- **Background Upload**: Add customer property photos
- **Window Overlay**: Position designed window on photos
- **Scale Control**: 10% - 200% scaling (default 85%)
- **Drag & Position**: Precise window placement
- **Window States**: Closed, half-open, open preview

---

## 🏗️ Architecture

### Technology Stack
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| Vite | Build Tool & Dev Server |
| Context + Reducer | State Management |
| CSS3 | Styling & Glass Textures |
| SVG | Handle Rendering |
| LocalStorage | Persistence |

### Project Structure
```
src/
├── components/
│   ├── WindowDesigner.js       # Main application controller
│   ├── WindowRenderer.js       # Dynamic window preview rendering
│   ├── VisualizationPreview.js # Photo visualization mode
│   ├── CanvasArea.js           # Drawing canvas container
│   ├── DrawingCanvas.js        # Freehand drawing implementation
│   ├── Controls.js             # Action buttons
│   ├── PhotoBank.js            # Photo management
│   ├── CompletedImages.js      # Saved visualizations
│   ├── ProductOverlay.js       # Draggable overlay component
│   ├── common/
│   │   └── UIComponents.js     # Reusable UI components
│   ├── layout/
│   │   └── LayoutComponents.js # Layout containers
│   ├── modals/
│   │   ├── ProductSetupModal.js    # Initial product setup
│   │   ├── DimensionModals.js      # Width/height configuration
│   │   ├── OpenerModal.js          # Opener selection
│   │   ├── FinishModals.js         # Finish & Extras configuration
│   │   ├── GlassModal.js           # Glass texture selection
│   │   ├── GlazingModal.js         # Glazing bars configuration
│   │   └── HardwareModal.js        # Handle & ventilation selection
│   └── panels/
│       └── TabPanels.js        # Sidebar panel components
├── context/
│   └── WindowContext.js        # Centralized state management
├── utils/
│   ├── coordinateUtils.js      # Coordinate conversion utilities
│   └── persistenceUtils.js     # Storage utilities
├── App.js                      # Root component
├── App.jsx                     # React entry point
├── App.css                     # Global styles (2400+ lines)
└── main.js                     # Application bootstrap
```

### State Structure
```javascript
{
  // Product Configuration
  productType: 'Flush Casement',
  location: '',
  jobType: 'Supply & Fit - Remove & replace',
  
  // Dimensions (mm)
  dimensions: { width, height, upperHeight, lowerHeight },
  
  // Pane Structure
  panes: [{ id, bounds, opener, glass }],
  
  // Finishes
  finish: {
    frame: { type, color, texture, colorHex },
    sash: { type, color, texture, colorHex },
    cill: { type, color, texture, colorHex },
  },
  
  // Glass Configuration
  glass: {
    default: { paneType, sealedUnit, texture, spacerBars },
    [paneId]: { ... } // Per-pane overrides
  },
  
  // Glazing Bars
  glazing: { type, barProfile, dimensions },
  
  // Hardware
  hardware: { handleType, ventilation },
  
  // Extras
  extras: {
    cill: { enabled, type, length, leftHorn, rightHorn },
    headDrip: boolean,
    weatherBar: boolean,
  },
  
  // Preview Settings
  preview: { backgroundImage, windowState, showDimensions },
  
  // Drawing State
  drawing: { isDrawing, currentPath, paths, tool },
}
```

---

## 📋 Traceability Matrix

### Requirements to Implementation Mapping

| Req ID | Requirement Description | Component(s) | Status |
|--------|------------------------|--------------|--------|
| **CORE FUNCTIONALITY** ||||
| REQ-001 | Product setup (type, location, job) | `ProductSetupModal.js`, `WindowContext.js` | ✅ Complete |
| REQ-002 | Window drawing canvas | `DrawingCanvas.js`, `CanvasArea.js` | ✅ Complete |
| REQ-003 | Multi-segment drawing support | `DrawingCanvas.js` | ✅ Complete |
| REQ-004 | Undo/Redo functionality | `WindowContext.js`, `Controls.js` | ✅ Complete |
| REQ-005 | Real-time preview synchronization | `WindowRenderer.js`, `WindowContext.js` | ✅ Complete |
| REQ-006 | Dimension display with arrows | `WindowRenderer.js` | ✅ Complete |
| **OPENERS** ||||
| REQ-010 | Opener type selection | `OpenerModal.js`, `OpenersPanel` | ✅ Complete |
| REQ-011 | Visual opener icons | `WindowRenderer.js` | ✅ Complete |
| REQ-012 | Per-pane opener assignment | `WindowContext.js` | ✅ Complete |
| **PROFILE** ||||
| REQ-020 | Profile style selection | `ProfilePanel` | ✅ Complete |
| REQ-021 | Flush/Sculptured/Chamfered options | `ProfilePanel` | ✅ Complete |
| **FINISH** ||||
| REQ-030 | Frame/Sash/Cill finish configuration | `FinishModals.js`, `FinishPanel` | ✅ Complete |
| REQ-031 | Foils/Sprayed/Standard categories | `FinishModal` | ✅ Complete |
| REQ-032 | 50+ color options | `FinishModal` | ✅ Complete |
| REQ-033 | Real-time color preview | `WindowRenderer.js` | ✅ Complete |
| **GLASS** ||||
| REQ-040 | Glass texture selection | `GlassModal.js`, `GlassPanel` | ✅ Complete |
| REQ-041 | 15 realistic glass textures | `GlassModal.js`, `App.css` | ✅ Complete |
| REQ-042 | Per-pane glass assignment | `WindowContext.js` | ✅ Complete |
| REQ-043 | Apply to all panes option | `GlassModal.js` | ✅ Complete |
| **GLAZING** ||||
| REQ-050 | Glazing type selection | `GlazingModal.js`, `GlazingPanel` | ✅ Complete |
| REQ-051 | Astragal/Georgian/Leaded options | `GlazingModal.js` | ✅ Complete |
| REQ-052 | Configurable bar counts | `GlazingModal.js` | ✅ Complete |
| REQ-053 | Visual glazing preview | `WindowRenderer.js` | ✅ Complete |
| **HARDWARE** ||||
| REQ-060 | Handle type selection | `HardwareModal.js`, `HardwarePanel` | ✅ Complete |
| REQ-061 | 6 handle style families | `HardwareModal.js` | ✅ Complete |
| REQ-062 | Dynamic handle SVG rendering | `WindowRenderer.js` | ✅ Complete |
| REQ-063 | Ventilation options | `HardwareModal.js` | ✅ Complete |
| **EXTRAS** ||||
| REQ-070 | Cill configuration | `FinishModals.js` (CillModal) | ✅ Complete |
| REQ-071 | Cill types (Stub/Standard/Large/XL) | `CillModal` | ✅ Complete |
| REQ-072 | Cill dimensions (length, horns) | `CillModal` | ✅ Complete |
| REQ-073 | Head Drip option | `CillModal` | ✅ Complete |
| REQ-074 | Weather Bar option | `CillModal` | ✅ Complete |
| **VISUALIZATION** ||||
| REQ-080 | Photo upload for background | `VisualizationPreview.js` | ✅ Complete |
| REQ-081 | Window overlay on photos | `VisualizationPreview.js` | ✅ Complete |
| REQ-082 | Scale control (10-200%) | `VisualizationPreview.js` | ✅ Complete |
| REQ-083 | Drag & position window | `VisualizationPreview.js` | ✅ Complete |
| REQ-084 | Default 85% scale | `VisualizationPreview.js` | ✅ Complete |
| **UI/UX** ||||
| REQ-090 | Tab-based sidebar navigation | `TabPanels.js`, `WindowDesigner.js` | ✅ Complete |
| REQ-091 | Modal-based detailed configuration | `modals/*.js` | ✅ Complete |
| REQ-092 | Brand green color scheme | `App.css` | ✅ Complete |
| REQ-093 | Responsive layout | `App.css`, `LayoutComponents.js` | ✅ Complete |

### Component to Feature Mapping

| Component | Features Implemented |
|-----------|---------------------|
| `WindowDesigner.js` | Main controller, view modes, modal management |
| `WindowRenderer.js` | Window preview, handles, glass, glazing, dimensions |
| `DrawingCanvas.js` | Freehand drawing, path management, undo support |
| `VisualizationPreview.js` | Photo overlay, scaling, positioning |
| `WindowContext.js` | State management, actions, reducers |
| `TabPanels.js` | All 7 sidebar panels (Openers to Extras) |
| `GlassModal.js` | 15 glass textures with CSS patterns |
| `GlazingModal.js` | Astragal/Georgian/Leaded with bar counts |
| `HardwareModal.js` | 6 handle families, ventilation options |
| `FinishModals.js` | Finish selection, CillModal (Extras) |

### Handle Style Implementation

| Handle Type | Render Function | Colors Available |
|-------------|-----------------|------------------|
| SAC Signature | `renderSACSignatureHandle()` | Antique Black |
| Teardrop | `renderTeardropHandle()` | Antique Black, Chrome, Gold |
| Connoisseur | `renderConnoisseurHandle()` | Antique Black, Chrome, Gold |
| Maxim | `renderMaximHandle()` | Antique Black, Chrome, White |
| Ventiss | `renderVentissHandle()` | Antique Black, Chrome |
| Ventiss Designer | `renderVentissDesignerHandle()` | Antique Black, Chrome |

### Glass Texture Implementation

| Texture Name | CSS Pattern Type | Visual Effect |
|--------------|------------------|---------------|
| Clear | Minimal gradient | Transparent appearance |
| Flemish | Repeating waves | Traditional wavy pattern |
| Autumn | Organic curves | Leaf-like patterns |
| Digital | Scattered rectangles | Modern geometric |
| Taffeta | Fine diagonal lines | Fabric texture |
| Everglade | Vertical lines | Forest-like pattern |
| Cotswold | Diamond pattern | Classic diamond grid |
| Arctic | Irregular lines | Ice crystal effect |
| Minster | Gothic arches | Cathedral inspired |
| Charcoal Sticks | Vertical bars | Bamboo-like |
| Contora | Horizontal waves | Ripple effect |
| Mayflower | Floral circles | Flower motifs |
| Oak | Wood grain | Natural wood pattern |
| Warwick | Diamond mesh | Leaded glass look |
| Sycamore | Leaf patterns | Botanical design |

---

## 🔧 Configuration

### Environment Variables
No environment variables required for basic operation.

### Customization Points
- **Colors**: Modify `App.css` CSS variables in `:root`
- **Glass Textures**: Add new patterns in `GlassModal.js` and `App.css`
- **Handle Styles**: Add new SVG renderers in `WindowRenderer.js`

---

## 🧪 Testing

```bash
npm run test        # Run unit tests
npm run test:e2e    # Run end-to-end tests
```

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

## 📈 Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0.0 | Jan 2026 | Complete window designer with all configuration tabs |
| 1.5.0 | Jan 2026 | Added dynamic handle styles, glass textures |
| 1.0.0 | Jan 2026 | Initial release with basic functionality |

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

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact Tommy Trinder development team

---

**Repository:** [github.com/Muhammad-Hamdan-Rauf/tommy-trinder-visualization-tool](https://github.com/Muhammad-Hamdan-Rauf/tommy-trinder-visualization-tool)

**Status:** ✅ Production Ready | **Version:** 2.0.0 | **Last Updated:** January 2026
