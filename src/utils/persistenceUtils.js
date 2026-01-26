/**
 * Visualization Persistence Utilities
 * Handles serialization, deserialization, and storage of visualization state
 */

const STORAGE_KEY = 'photo-visualizer-state';
const STORAGE_VERSION = 1;

/**
 * Serialize visualization state for storage
 * @param {Object} state - Complete application state
 * @returns {string} - JSON string
 */
export function serializeState(state) {
  const serializable = {
    version: STORAGE_VERSION,
    timestamp: new Date().toISOString(),
    photoBank: state.photoBank,
    completedVisualizations: state.completedVisualizations,
    // Don't persist draft or UI state
  };
  
  return JSON.stringify(serializable);
}

/**
 * Deserialize visualization state from storage
 * @param {string} jsonString - JSON string
 * @returns {Object|null} - Deserialized state or null if invalid
 */
export function deserializeState(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    // Version check
    if (data.version !== STORAGE_VERSION) {
      console.warn('State version mismatch, skipping load');
      return null;
    }
    
    return {
      photoBank: data.photoBank || [],
      completedVisualizations: data.completedVisualizations || [],
    };
  } catch (e) {
    console.error('Failed to deserialize state:', e);
    return null;
  }
}

/**
 * Save state to localStorage
 * @param {Object} state - Application state
 */
export function saveToLocalStorage(state) {
  try {
    const serialized = serializeState(state);
    localStorage.setItem(STORAGE_KEY, serialized);
    console.log('State saved to localStorage');
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

/**
 * Load state from localStorage
 * @returns {Object|null} - Deserialized state or null
 */
export function loadFromLocalStorage() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    
    return deserializeState(serialized);
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
    return null;
  }
}

/**
 * Clear persisted state
 */
export function clearLocalStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('State cleared from localStorage');
  } catch (e) {
    console.error('Failed to clear localStorage:', e);
  }
}

/**
 * Export visualization data as JSON file
 * @param {Object} visualization - Completed visualization object
 */
export function exportVisualizationAsJSON(visualization) {
  const data = {
    version: STORAGE_VERSION,
    type: 'visualization',
    ...visualization,
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${visualization.name || 'visualization'}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Import visualization from JSON file
 * @param {File} file - JSON file
 * @returns {Promise<Object>} - Imported visualization object
 */
export function importVisualizationFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        if (data.type !== 'visualization') {
          reject(new Error('Invalid file type'));
          return;
        }
        
        if (data.version !== STORAGE_VERSION) {
          reject(new Error('Version mismatch'));
          return;
        }
        
        resolve(data);
      } catch (e) {
        reject(new Error('Failed to parse JSON'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Validate visualization object structure
 * @param {Object} visualization
 * @returns {boolean}
 */
export function isValidVisualization(visualization) {
  return (
    visualization &&
    typeof visualization.id === 'string' &&
    typeof visualization.name === 'string' &&
    typeof visualization.backgroundPhotoId === 'string' &&
    Array.isArray(visualization.products) &&
    visualization.products.every(isValidProduct)
  );
}

/**
 * Validate product object structure
 * @param {Object} product
 * @returns {boolean}
 */
export function isValidProduct(product) {
  return (
    product &&
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.url === 'string' &&
    product.position &&
    typeof product.position.x === 'number' &&
    typeof product.position.y === 'number' &&
    typeof product.position.width === 'number' &&
    typeof product.position.height === 'number' &&
    product.position.x >= 0 &&
    product.position.y >= 0 &&
    product.position.width > 0 &&
    product.position.height > 0
  );
}

/**
 * Create a quote-ready representation of visualizations
 * @param {Array} visualizations - Array of completed visualizations
 * @returns {Object} - Quote data structure
 */
export function createQuoteData(visualizations) {
  const attachedVizs = visualizations.filter(v => v.attachedToQuote && v.locked);
  
  return {
    visualizations: attachedVizs.map(v => ({
      id: v.id,
      name: v.name,
      thumbnail: v.thumbnail,
      productCount: v.products.length,
      createdAt: v.createdAt,
    })),
    totalProducts: attachedVizs.reduce((sum, v) => sum + v.products.length, 0),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate a shareable link or code for a visualization
 * @param {Object} visualization
 * @returns {string} - Base64 encoded visualization data
 */
export function generateShareableCode(visualization) {
  const data = {
    v: STORAGE_VERSION,
    n: visualization.name,
    p: visualization.products.map(p => ({
      n: p.name,
      u: p.url,
      pos: p.position,
      t: p.transform,
    })),
  };
  
  try {
    return btoa(JSON.stringify(data));
  } catch (e) {
    console.error('Failed to generate shareable code:', e);
    return null;
  }
}

/**
 * Parse a shareable code
 * @param {string} code - Base64 encoded string
 * @returns {Object|null} - Parsed visualization data
 */
export function parseShareableCode(code) {
  try {
    const json = atob(code);
    const data = JSON.parse(json);
    
    if (data.v !== STORAGE_VERSION) {
      return null;
    }
    
    return {
      name: data.n,
      products: data.p.map(p => ({
        name: p.n,
        url: p.u,
        position: p.pos,
        transform: p.t,
      })),
    };
  } catch (e) {
    console.error('Failed to parse shareable code:', e);
    return null;
  }
}
