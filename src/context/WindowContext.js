import React, { createContext, useContext, useReducer } from 'react';

// Initial window configuration state
const initialWindowState = {
  // Product info
  productType: 'Flush Casement',
  location: '',
  jobType: 'Supply & Fit - Remove & replace',
  
  // Dimensions (in mm)
  dimensions: {
    width: 1200,
    height: 1500,
    upperHeight: 450,
    lowerHeight: 1050,
  },
  
  // Pane structure - grid of panes
  panes: [
    { id: 'A-upper', row: 0, col: 0, width: 600, height: 450 },
    { id: 'B-upper', row: 0, col: 1, width: 600, height: 450 },
    { id: 'A-lower', row: 1, col: 0, width: 600, height: 1050 },
    { id: 'B-lower', row: 1, col: 1, width: 600, height: 1050 },
  ],
  
  // Grid structure
  grid: {
    rows: 2,
    cols: 2,
    horizontalDividers: [450], // Y positions of horizontal dividers
    verticalDividers: [600],   // X positions of vertical dividers
  },
  
  // Opener configurations per pane
  openers: {
    'A-upper': { type: 'top-hung', hinge: 'left' },
    'B-upper': { type: 'top-hung', hinge: 'right' },
    'A-lower': { type: 'side-hung', hinge: 'left' },
    'B-lower': { type: 'side-hung', hinge: 'right' },
  },
  
  // Finish options
  finish: {
    frame: { type: 'Foils', color: 'White Grain', texture: 'wood-grain' },
    sash: { type: 'Foils', color: 'White Grain', texture: 'wood-grain' },
    cill: { type: 'Foils', color: 'White Grain', texture: 'wood-grain' },
  },
  
  // Glass options per pane
  glass: {
    default: {
      paneType: 'Double Glazed',
      sealedUnit: 'Double Glazed (Annealed)',
      texture: 'Clear',
      spacerBars: 'Black',
      solarControl: false,
      selfClean: false,
    },
  },
  
  // Glazing bars
  glazing: {
    type: null, // 'Astragal', 'Georgian', 'Leaded'
    barProfile: 'Standard Ovolo',
    backToBack: true,
    jointType: 'Soldered',
    leadColor: 'Standard Antique Soldered Lead',
    dimensions: [],
  },
  
  // Hardware
  hardware: {
    handleType: 'Connoisseur Antique Black',
    ventilation: null,
  },
  
  // Extras
  extras: {
    cill: {
      enabled: true,
      type: 'Standard', // Stub, Standard, Large, Extra Large
      length: 1300,
      leftHorn: 50,
      rightHorn: 50,
    },
    headDrip: false,
    weatherBar: false,
  },
  
  // Preview/Visualization
  preview: {
    backgroundImage: null,
    windowState: 'closed', // 'closed', 'half-open', 'open'
    showDimensions: true,
  },
  
  // Drawing state
  drawing: {
    isDrawing: false,
    currentPath: [],
    paths: [],
    tool: 'select', // 'select', 'draw', 'erase'
  },
  
  // UI state
  ui: {
    activeTab: 'OPENERS',
    selectedPane: null,
    showModal: null,
    modalData: null,
  },
};

// Action types
const ACTIONS = {
  SET_PRODUCT_INFO: 'SET_PRODUCT_INFO',
  SET_DIMENSIONS: 'SET_DIMENSIONS',
  SET_PANES: 'SET_PANES',
  SET_GRID: 'SET_GRID',
  ADD_VERTICAL_DIVIDER: 'ADD_VERTICAL_DIVIDER',
  ADD_HORIZONTAL_DIVIDER: 'ADD_HORIZONTAL_DIVIDER',
  SET_OPENER: 'SET_OPENER',
  SET_FINISH: 'SET_FINISH',
  SET_GLASS: 'SET_GLASS',
  SET_GLAZING: 'SET_GLAZING',
  SET_HARDWARE: 'SET_HARDWARE',
  SET_EXTRAS: 'SET_EXTRAS',
  SET_PREVIEW: 'SET_PREVIEW',
  SET_DRAWING: 'SET_DRAWING',
  SET_UI: 'SET_UI',
  RESET_WINDOW: 'RESET_WINDOW',
  LOAD_WINDOW: 'LOAD_WINDOW',
};

// Reducer function
function windowReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PRODUCT_INFO:
      return { ...state, ...action.payload };
      
    case ACTIONS.SET_DIMENSIONS:
      return { ...state, dimensions: { ...state.dimensions, ...action.payload } };
      
    case ACTIONS.SET_PANES:
      return { ...state, panes: action.payload };
      
    case ACTIONS.SET_GRID:
      return { ...state, grid: { ...state.grid, ...action.payload } };
      
    case ACTIONS.ADD_VERTICAL_DIVIDER: {
      const newVertDividers = [...state.grid.verticalDividers, action.payload.position].sort((a, b) => a - b);
      const newCols = newVertDividers.length + 1;
      return {
        ...state,
        grid: { ...state.grid, verticalDividers: newVertDividers, cols: newCols },
        panes: regeneratePanes(state.grid.rows, newCols, state.grid.horizontalDividers, newVertDividers, state.dimensions),
      };
    }
      
    case ACTIONS.ADD_HORIZONTAL_DIVIDER: {
      const newHorizDividers = [...state.grid.horizontalDividers, action.payload.position].sort((a, b) => a - b);
      const newRows = newHorizDividers.length + 1;
      return {
        ...state,
        grid: { ...state.grid, horizontalDividers: newHorizDividers, rows: newRows },
        panes: regeneratePanes(newRows, state.grid.cols, newHorizDividers, state.grid.verticalDividers, state.dimensions),
      };
    }
      
    case ACTIONS.SET_OPENER:
      return { ...state, openers: { ...state.openers, [action.payload.paneId]: action.payload.opener } };
      
    case ACTIONS.SET_FINISH:
      return { ...state, finish: { ...state.finish, [action.payload.part]: action.payload.finish } };
      
    case ACTIONS.SET_GLASS:
      return { ...state, glass: { ...state.glass, [action.payload.paneId || 'default']: action.payload.glass } };
      
    case ACTIONS.SET_GLAZING:
      return { ...state, glazing: { ...state.glazing, ...action.payload } };
      
    case ACTIONS.SET_HARDWARE:
      return { ...state, hardware: { ...state.hardware, ...action.payload } };
      
    case ACTIONS.SET_EXTRAS:
      return { ...state, extras: { ...state.extras, ...action.payload } };
      
    case ACTIONS.SET_PREVIEW:
      return { ...state, preview: { ...state.preview, ...action.payload } };
      
    case ACTIONS.SET_DRAWING:
      return { ...state, drawing: { ...state.drawing, ...action.payload } };
      
    case ACTIONS.SET_UI:
      return { ...state, ui: { ...state.ui, ...action.payload } };
      
    case ACTIONS.RESET_WINDOW:
      return { ...initialWindowState };
      
    case ACTIONS.LOAD_WINDOW:
      return { ...state, ...action.payload };
      
    default:
      return state;
  }
}

// Helper function to regenerate panes based on grid
function regeneratePanes(rows, cols, horizontalDividers, verticalDividers, dimensions) {
  const panes = [];
  const rowLabels = ['upper', 'middle', 'lower'];
  const colLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
  
  // Calculate row heights
  const rowHeights = [];
  let prevY = 0;
  for (let i = 0; i < rows; i++) {
    const nextY = i < horizontalDividers.length ? horizontalDividers[i] : dimensions.height;
    rowHeights.push(nextY - prevY);
    prevY = nextY;
  }
  
  // Calculate column widths
  const colWidths = [];
  let prevX = 0;
  for (let i = 0; i < cols; i++) {
    const nextX = i < verticalDividers.length ? verticalDividers[i] : dimensions.width;
    colWidths.push(nextX - prevX);
    prevX = nextX;
  }
  
  // Generate pane objects
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const rowLabel = rows === 1 ? '' : (rows === 2 ? (row === 0 ? 'upper' : 'lower') : rowLabels[row] || `row${row}`);
      const colLabel = colLabels[col] || `col${col}`;
      const id = rowLabel ? `${colLabel}-${rowLabel}` : colLabel;
      
      panes.push({
        id,
        row,
        col,
        width: colWidths[col],
        height: rowHeights[row],
      });
    }
  }
  
  return panes;
}

// Create context
const WindowContext = createContext();

// Provider component
function WindowProvider({ children }) {
  const [state, dispatch] = useReducer(windowReducer, initialWindowState);
  
  // Action creators
  const actions = {
    setProductInfo: (info) => dispatch({ type: ACTIONS.SET_PRODUCT_INFO, payload: info }),
    setDimensions: (dims) => dispatch({ type: ACTIONS.SET_DIMENSIONS, payload: dims }),
    setPanes: (panes) => dispatch({ type: ACTIONS.SET_PANES, payload: panes }),
    setGrid: (grid) => dispatch({ type: ACTIONS.SET_GRID, payload: grid }),
    addVerticalDivider: (position) => dispatch({ type: ACTIONS.ADD_VERTICAL_DIVIDER, payload: { position } }),
    addHorizontalDivider: (position) => dispatch({ type: ACTIONS.ADD_HORIZONTAL_DIVIDER, payload: { position } }),
    setOpener: (paneId, opener) => dispatch({ type: ACTIONS.SET_OPENER, payload: { paneId, opener } }),
    setFinish: (part, finish) => dispatch({ type: ACTIONS.SET_FINISH, payload: { part, finish } }),
    setGlass: (paneId, glass) => dispatch({ type: ACTIONS.SET_GLASS, payload: { paneId, glass } }),
    setGlazing: (glazing) => dispatch({ type: ACTIONS.SET_GLAZING, payload: glazing }),
    setHardware: (hardware) => dispatch({ type: ACTIONS.SET_HARDWARE, payload: hardware }),
    setExtras: (extras) => dispatch({ type: ACTIONS.SET_EXTRAS, payload: extras }),
    setPreview: (preview) => dispatch({ type: ACTIONS.SET_PREVIEW, payload: preview }),
    setDrawing: (drawing) => dispatch({ type: ACTIONS.SET_DRAWING, payload: drawing }),
    setUI: (ui) => dispatch({ type: ACTIONS.SET_UI, payload: ui }),
    resetWindow: () => dispatch({ type: ACTIONS.RESET_WINDOW }),
    loadWindow: (config) => dispatch({ type: ACTIONS.LOAD_WINDOW, payload: config }),
    
    // Convenience methods
    showModal: (modalType, data = null) => dispatch({ type: ACTIONS.SET_UI, payload: { showModal: modalType, modalData: data } }),
    hideModal: () => dispatch({ type: ACTIONS.SET_UI, payload: { showModal: null, modalData: null } }),
    selectPane: (paneId) => dispatch({ type: ACTIONS.SET_UI, payload: { selectedPane: paneId } }),
    setActiveTab: (tab) => dispatch({ type: ACTIONS.SET_UI, payload: { activeTab: tab } }),
  };
  
  return React.createElement(WindowContext.Provider, { value: { state, actions, dispatch } }, children);
}

// Hook to use window context
function useWindow() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindow must be used within a WindowProvider');
  }
  return context;
}

export { WindowProvider, useWindow, ACTIONS, initialWindowState };
