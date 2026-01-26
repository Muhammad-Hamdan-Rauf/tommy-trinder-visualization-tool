/**
 * Coordinate Transform Utilities
 * Handles conversion between absolute pixels and normalized coordinates (0-1 range)
 * Ensures overlay positioning survives re-renders, resizes, and zoom changes
 */

/**
 * Convert absolute pixel coordinates to normalized coordinates
 * @param {Object} absolute - { x, y, width, height } in pixels
 * @param {Object} containerSize - { width, height } of container in pixels
 * @returns {Object} - { x, y, width, height } in 0-1 range
 */
export function toNormalized(absolute, containerSize) {
  if (!containerSize.width || !containerSize.height) {
    console.warn('Invalid container size:', containerSize);
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  return {
    x: absolute.x / containerSize.width,
    y: absolute.y / containerSize.height,
    width: absolute.width / containerSize.width,
    height: absolute.height / containerSize.height,
  };
}

/**
 * Convert normalized coordinates to absolute pixel coordinates
 * @param {Object} normalized - { x, y, width, height } in 0-1 range
 * @param {Object} containerSize - { width, height } of container in pixels
 * @returns {Object} - { x, y, width, height } in pixels
 */
export function toAbsolute(normalized, containerSize) {
  return {
    x: normalized.x * containerSize.width,
    y: normalized.y * containerSize.height,
    width: normalized.width * containerSize.width,
    height: normalized.height * containerSize.height,
  };
}

/**
 * Create a transform matrix from individual transform properties
 * @param {Object} transform - { x, y, width, height, rotation, skewX, skewY, scale }
 * @returns {string} - CSS transform string
 */
export function createTransformString(transform) {
  const parts = [];
  
  if (transform.rotation) {
    parts.push(`rotate(${transform.rotation}deg)`);
  }
  
  if (transform.skewX || transform.skewY) {
    parts.push(`skew(${transform.skewX || 0}deg, ${transform.skewY || 0}deg)`);
  }
  
  if (transform.scale && transform.scale !== 1) {
    parts.push(`scale(${transform.scale})`);
  }
  
  return parts.length > 0 ? parts.join(' ') : 'none';
}

/**
 * Generate a unique ID for products/overlays
 * @returns {string} - Unique identifier
 */
export function generateUniqueId() {
  // Use crypto.randomUUID if available, fallback to timestamp + random
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Clamp a value between min and max
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if normalized coordinates are within valid bounds
 * @param {Object} normalized - { x, y, width, height }
 * @returns {boolean}
 */
export function isValidNormalized(normalized) {
  return (
    normalized.x >= 0 &&
    normalized.y >= 0 &&
    normalized.width > 0 &&
    normalized.height > 0 &&
    normalized.x + normalized.width <= 1 &&
    normalized.y + normalized.height <= 1
  );
}

/**
 * Constrain normalized coordinates to stay within bounds
 * @param {Object} normalized - { x, y, width, height }
 * @returns {Object} - Constrained normalized coordinates
 */
export function constrainToBounds(normalized) {
  const result = { ...normalized };
  
  // Ensure width and height are positive and not too large
  result.width = clamp(result.width, 0.05, 1);
  result.height = clamp(result.height, 0.05, 1);
  
  // Ensure position keeps entire element in bounds
  result.x = clamp(result.x, 0, 1 - result.width);
  result.y = clamp(result.y, 0, 1 - result.height);
  
  return result;
}

/**
 * Create default transform state for a new product
 * @returns {Object} - Default transform properties
 */
export function createDefaultTransform() {
  return {
    rotation: 0,
    skewX: 0,
    skewY: 0,
    scale: 1,
  };
}

/**
 * Serialize a transform state to a compact string (for storage)
 * @param {Object} transform
 * @returns {string}
 */
export function serializeTransform(transform) {
  return JSON.stringify({
    r: transform.rotation || 0,
    sx: transform.skewX || 0,
    sy: transform.skewY || 0,
    sc: transform.scale || 1,
  });
}

/**
 * Deserialize a transform state from string
 * @param {string} transformString
 * @returns {Object}
 */
export function deserializeTransform(transformString) {
  try {
    const data = JSON.parse(transformString);
    return {
      rotation: data.r || 0,
      skewX: data.sx || 0,
      skewY: data.sy || 0,
      scale: data.sc || 1,
    };
  } catch (e) {
    return createDefaultTransform();
  }
}
