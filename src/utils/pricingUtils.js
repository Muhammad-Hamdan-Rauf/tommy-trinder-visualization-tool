/**
 * Pricing Configuration and Calculation Utilities
 * For generating window quotes based on design selections
 */

// ===== PRICING CONFIGURATION =====
// All prices in GBP (£)

export const PRICING_CONFIG = {
  // Base price per square meter (for standard window)
  basePricePerSqM: 450,
  
  // Minimum charge
  minimumCharge: 350,
  
  // Product type multipliers
  productTypes: {
    'Flush Casement': { multiplier: 1.0, name: 'Flush Casement Window' },
    'Sculptured': { multiplier: 1.05, name: 'Sculptured Window' },
    'Chamfered': { multiplier: 1.02, name: 'Chamfered Window' },
  },
  
  // Job type pricing
  jobTypes: {
    'Supply Only': { price: 0, description: 'Supply window only' },
    'Supply & Fit': { price: 150, description: 'Supply and fit new window' },
    'Supply & Fit - Remove & replace': { price: 250, description: 'Remove old window, supply & fit new' },
  },
  
  // Finish pricing
  finishes: {
    types: {
      'Foils': { price: 0, perSqM: 0, name: 'Foils (Wood Effect)' },
      'Spray': { price: 120, perSqM: 25, name: 'Spray Painted' },
      'Standard': { price: 0, perSqM: 0, name: 'Standard' },
    },
    // Premium color surcharges
    premiumColors: {
      'Winchester XC': 45,
      'Irish Oak': 45,
      'Rosewood': 55,
      'Mahogany': 55,
      'Walnut': 55,
      'Cherrywood': 60,
      'Anthracite Grey': 35,
      'Black Ash': 40,
      'Chartwell Green': 50,
    },
  },
  
  // Glass pricing
  glass: {
    paneTypes: {
      'Double Glazed': { price: 0, perSqM: 0, name: 'Double Glazed' },
      'Triple Glazed': { price: 85, perSqM: 45, name: 'Triple Glazed' },
    },
    sealedUnits: {
      'Double Glazed (Annealed)': { price: 0, name: 'Double Glazed (Annealed)' },
      'Double Glazed (Toughened)': { price: 35, name: 'Double Glazed (Toughened)' },
      'Triple Glazed (Annealed)': { price: 75, name: 'Triple Glazed (Annealed)' },
      'Triple Glazed (Toughened)': { price: 95, name: 'Triple Glazed (Toughened)' },
    },
    textures: {
      'Clear': { price: 0, name: 'Clear Glass' },
      'Frosted': { price: 45, name: 'Frosted/Obscure Glass' },
      'Patterned': { price: 55, name: 'Patterned Glass' },
      'Tinted': { price: 65, name: 'Tinted Glass' },
    },
    options: {
      solarControl: { price: 75, name: 'Solar Control Coating' },
      selfClean: { price: 95, name: 'Self-Cleaning Glass' },
    },
    spacerBars: {
      'Black': { price: 0, name: 'Black Spacer Bar' },
      'Silver': { price: 0, name: 'Silver Spacer Bar' },
      'Grey': { price: 15, name: 'Grey Spacer Bar' },
      'White': { price: 15, name: 'White Spacer Bar' },
      'Bronze': { price: 25, name: 'Bronze Spacer Bar' },
    },
  },
  
  // Opener pricing (per pane)
  openers: {
    'fixed': { price: 0, name: 'Fixed (Non-opening)' },
    'side-hung-left': { price: 85, name: 'Side Hung Left' },
    'side-hung-right': { price: 85, name: 'Side Hung Right' },
    'top-hung': { price: 95, name: 'Top Hung' },
    'tilt-turn': { price: 145, name: 'Tilt & Turn' },
    'dummy': { price: 45, name: 'Dummy Sash' },
  },
  
  // Glazing bars pricing
  glazing: {
    types: {
      'Astragal': { pricePerBar: 25, name: 'Astragal Bars' },
      'Georgian': { pricePerBar: 30, name: 'Georgian Bars' },
      'Leaded': { pricePerBar: 45, name: 'Leaded Effect' },
    },
    barProfiles: {
      'Standard Ovolo': { price: 0, name: 'Standard Ovolo' },
      'Slim Ovolo': { price: 15, name: 'Slim Ovolo' },
      'Georgian': { price: 20, name: 'Georgian Profile' },
    },
    jointTypes: {
      'Soldered': { price: 0, name: 'Soldered Joints' },
      'Welded': { price: 25, name: 'Welded Joints' },
    },
    backToBack: { price: 35, name: 'Back to Back Bars' },
  },
  
  // Hardware pricing
  hardware: {
    handles: {
      'Connoisseur Antique Black': { price: 0, name: 'Connoisseur Antique Black' },
      'Connoisseur Chrome': { price: 15, name: 'Connoisseur Chrome' },
      'Connoisseur White': { price: 0, name: 'Connoisseur White' },
      'Connoisseur Gold': { price: 25, name: 'Connoisseur Gold' },
      'Heritage Brass': { price: 45, name: 'Heritage Brass Handle' },
      'Heritage Black': { price: 35, name: 'Heritage Black Handle' },
      'Premium Chrome': { price: 55, name: 'Premium Chrome Handle' },
      'Traditional Pewter': { price: 65, name: 'Traditional Pewter Handle' },
    },
    ventilation: {
      'None': { price: 0, name: 'No Ventilation' },
      'Trickle Vent': { price: 35, name: 'Trickle Vent' },
      'Night Vent': { price: 55, name: 'Night Vent' },
      'Fire Escape': { price: 95, name: 'Fire Escape Restrictor' },
    },
  },
  
  // Extras pricing
  extras: {
    cill: {
      types: {
        'Stub': { price: 25, name: 'Stub Cill' },
        'Standard': { price: 55, name: 'Standard Cill' },
        'Large': { price: 85, name: 'Large Cill' },
        'Extra Large': { price: 115, name: 'Extra Large Cill' },
      },
      hornPrice: 15, // per horn
    },
    headDrip: { price: 35, name: 'Head Drip' },
    weatherBar: { price: 45, name: 'Weather Bar' },
  },
  
  // Additional pane charges
  additionalPanes: {
    pricePerPane: 75, // charge for each pane beyond the first
  },
  
  // VAT rate
  vatRate: 0.20, // 20% UK VAT
};

/**
 * Calculate window area in square meters
 */
export function calculateArea(dimensions) {
  const widthM = dimensions.width / 1000;
  const heightM = dimensions.height / 1000;
  return widthM * heightM;
}

/**
 * Calculate the price for the base window
 */
export function calculateBasePrice(dimensions, productType) {
  const area = calculateArea(dimensions);
  const productConfig = PRICING_CONFIG.productTypes[productType] || PRICING_CONFIG.productTypes['Flush Casement'];
  const basePrice = Math.max(
    area * PRICING_CONFIG.basePricePerSqM * productConfig.multiplier,
    PRICING_CONFIG.minimumCharge
  );
  return {
    price: Math.round(basePrice * 100) / 100,
    description: `${productConfig.name} (${dimensions.width}mm x ${dimensions.height}mm)`,
    area: Math.round(area * 100) / 100,
  };
}

/**
 * Calculate job type cost
 */
export function calculateJobTypeCost(jobType) {
  const job = PRICING_CONFIG.jobTypes[jobType] || PRICING_CONFIG.jobTypes['Supply Only'];
  return {
    price: job.price,
    description: job.description,
  };
}

/**
 * Calculate finish costs
 */
export function calculateFinishCosts(finish, dimensions) {
  const area = calculateArea(dimensions);
  const costs = [];
  
  ['frame', 'sash', 'cill'].forEach(part => {
    if (finish[part]) {
      const finishType = PRICING_CONFIG.finishes.types[finish[part].type];
      if (finishType && (finishType.price > 0 || finishType.perSqM > 0)) {
        const price = finishType.price + (finishType.perSqM * area);
        costs.push({
          price: Math.round(price * 100) / 100,
          description: `${part.charAt(0).toUpperCase() + part.slice(1)} - ${finishType.name}`,
        });
      }
      
      // Check for premium color surcharge
      const colorSurcharge = PRICING_CONFIG.finishes.premiumColors[finish[part].color];
      if (colorSurcharge) {
        costs.push({
          price: colorSurcharge,
          description: `${part.charAt(0).toUpperCase() + part.slice(1)} Color - ${finish[part].color}`,
        });
      }
    }
  });
  
  return costs;
}

/**
 * Calculate glass costs
 */
export function calculateGlassCosts(glass, panes) {
  const costs = [];
  
  // Use default glass settings if no pane-specific settings
  const defaultGlass = glass.default || {};
  
  // Check pane type (double/triple)
  const paneType = PRICING_CONFIG.glass.paneTypes[defaultGlass.paneType];
  if (paneType && paneType.price > 0) {
    costs.push({
      price: paneType.price,
      description: paneType.name,
    });
  }
  
  // Sealed unit upgrade
  const sealedUnit = PRICING_CONFIG.glass.sealedUnits[defaultGlass.sealedUnit];
  if (sealedUnit && sealedUnit.price > 0) {
    costs.push({
      price: sealedUnit.price,
      description: sealedUnit.name,
    });
  }
  
  // Glass texture
  const texture = PRICING_CONFIG.glass.textures[defaultGlass.texture];
  if (texture && texture.price > 0) {
    costs.push({
      price: texture.price,
      description: texture.name,
    });
  }
  
  // Solar control
  if (defaultGlass.solarControl && PRICING_CONFIG.glass.options.solarControl) {
    costs.push({
      price: PRICING_CONFIG.glass.options.solarControl.price,
      description: PRICING_CONFIG.glass.options.solarControl.name,
    });
  }
  
  // Self-clean
  if (defaultGlass.selfClean && PRICING_CONFIG.glass.options.selfClean) {
    costs.push({
      price: PRICING_CONFIG.glass.options.selfClean.price,
      description: PRICING_CONFIG.glass.options.selfClean.name,
    });
  }
  
  // Spacer bars
  const spacer = PRICING_CONFIG.glass.spacerBars[defaultGlass.spacerBars];
  if (spacer && spacer.price > 0) {
    costs.push({
      price: spacer.price,
      description: spacer.name,
    });
  }
  
  return costs;
}

/**
 * Calculate opener costs
 */
export function calculateOpenerCosts(openers, panes) {
  const costs = [];
  
  Object.entries(openers).forEach(([paneId, opener]) => {
    if (opener && opener.type && opener.type !== 'fixed') {
      const openerConfig = PRICING_CONFIG.openers[opener.type];
      if (openerConfig && openerConfig.price > 0) {
        costs.push({
          price: openerConfig.price,
          description: `${openerConfig.name} (Pane ${paneId})`,
        });
      }
    }
  });
  
  return costs;
}

/**
 * Calculate glazing bar costs
 */
export function calculateGlazingCosts(glazing) {
  const costs = [];
  
  if (!glazing || !glazing.type) return costs;
  
  const glazingType = PRICING_CONFIG.glazing.types[glazing.type];
  if (glazingType) {
    // Estimate number of bars based on dimensions array length
    const numBars = glazing.dimensions?.length || 4;
    const barCost = glazingType.pricePerBar * numBars;
    costs.push({
      price: barCost,
      description: `${glazingType.name} (${numBars} bars)`,
    });
  }
  
  // Bar profile
  const profile = PRICING_CONFIG.glazing.barProfiles[glazing.barProfile];
  if (profile && profile.price > 0) {
    costs.push({
      price: profile.price,
      description: profile.name,
    });
  }
  
  // Joint type
  const joint = PRICING_CONFIG.glazing.jointTypes[glazing.jointType];
  if (joint && joint.price > 0) {
    costs.push({
      price: joint.price,
      description: joint.name,
    });
  }
  
  // Back to back
  if (glazing.backToBack) {
    costs.push({
      price: PRICING_CONFIG.glazing.backToBack.price,
      description: PRICING_CONFIG.glazing.backToBack.name,
    });
  }
  
  return costs;
}

/**
 * Calculate hardware costs
 */
export function calculateHardwareCosts(hardware) {
  const costs = [];
  
  // Handle
  const handle = PRICING_CONFIG.hardware.handles[hardware.handleType];
  if (handle && handle.price > 0) {
    costs.push({
      price: handle.price,
      description: handle.name,
    });
  }
  
  // Ventilation
  if (hardware.ventilation) {
    const vent = PRICING_CONFIG.hardware.ventilation[hardware.ventilation];
    if (vent && vent.price > 0) {
      costs.push({
        price: vent.price,
        description: vent.name,
      });
    }
  }
  
  return costs;
}

/**
 * Calculate extras costs
 */
export function calculateExtrasCosts(extras) {
  const costs = [];
  
  // Cill
  if (extras.cill?.enabled) {
    const cillType = PRICING_CONFIG.extras.cill.types[extras.cill.type];
    if (cillType) {
      costs.push({
        price: cillType.price,
        description: cillType.name,
      });
      
      // Horn charges
      if (extras.cill.leftHorn > 0 || extras.cill.rightHorn > 0) {
        const numHorns = (extras.cill.leftHorn > 0 ? 1 : 0) + (extras.cill.rightHorn > 0 ? 1 : 0);
        costs.push({
          price: PRICING_CONFIG.extras.cill.hornPrice * numHorns,
          description: `Cill Horns (x${numHorns})`,
        });
      }
    }
  }
  
  // Head drip
  if (extras.headDrip) {
    costs.push({
      price: PRICING_CONFIG.extras.headDrip.price,
      description: PRICING_CONFIG.extras.headDrip.name,
    });
  }
  
  // Weather bar
  if (extras.weatherBar) {
    costs.push({
      price: PRICING_CONFIG.extras.weatherBar.price,
      description: PRICING_CONFIG.extras.weatherBar.name,
    });
  }
  
  return costs;
}

/**
 * Calculate additional pane charges
 */
export function calculatePaneCosts(panes) {
  const costs = [];
  const paneCount = panes?.length || 1;
  
  if (paneCount > 1) {
    const additionalPanes = paneCount - 1;
    costs.push({
      price: PRICING_CONFIG.additionalPanes.pricePerPane * additionalPanes,
      description: `Additional Panes (x${additionalPanes})`,
    });
  }
  
  return costs;
}

/**
 * Generate complete quote from window state
 */
export function generateQuote(windowState) {
  const quote = {
    reference: `QT-${Date.now().toString(36).toUpperCase()}`,
    date: new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    
    // Project info
    project: {
      location: windowState.location || 'Not specified',
      productType: windowState.productType,
      jobType: windowState.jobType,
    },
    
    // Line items
    items: [],
    
    // Totals
    subtotal: 0,
    vat: 0,
    total: 0,
  };
  
  // 1. Base window price
  const basePrice = calculateBasePrice(windowState.dimensions, windowState.productType);
  quote.items.push({
    category: 'Window',
    description: basePrice.description,
    price: basePrice.price,
  });
  
  // 2. Job type cost
  const jobCost = calculateJobTypeCost(windowState.jobType);
  if (jobCost.price > 0) {
    quote.items.push({
      category: 'Installation',
      description: jobCost.description,
      price: jobCost.price,
    });
  }
  
  // 3. Finish costs
  const finishCosts = calculateFinishCosts(windowState.finish, windowState.dimensions);
  finishCosts.forEach(cost => {
    quote.items.push({
      category: 'Finish',
      ...cost,
    });
  });
  
  // 4. Glass costs
  const glassCosts = calculateGlassCosts(windowState.glass, windowState.panes);
  glassCosts.forEach(cost => {
    quote.items.push({
      category: 'Glass',
      ...cost,
    });
  });
  
  // 5. Opener costs
  const openerCosts = calculateOpenerCosts(windowState.openers, windowState.panes);
  openerCosts.forEach(cost => {
    quote.items.push({
      category: 'Openers',
      ...cost,
    });
  });
  
  // 6. Glazing bar costs
  const glazingCosts = calculateGlazingCosts(windowState.glazing);
  glazingCosts.forEach(cost => {
    quote.items.push({
      category: 'Glazing Bars',
      ...cost,
    });
  });
  
  // 7. Hardware costs
  const hardwareCosts = calculateHardwareCosts(windowState.hardware);
  hardwareCosts.forEach(cost => {
    quote.items.push({
      category: 'Hardware',
      ...cost,
    });
  });
  
  // 8. Extras costs
  const extrasCosts = calculateExtrasCosts(windowState.extras);
  extrasCosts.forEach(cost => {
    quote.items.push({
      category: 'Extras',
      ...cost,
    });
  });
  
  // 9. Additional pane charges
  const paneCosts = calculatePaneCosts(windowState.panes);
  paneCosts.forEach(cost => {
    quote.items.push({
      category: 'Configuration',
      ...cost,
    });
  });
  
  // Calculate totals
  quote.subtotal = quote.items.reduce((sum, item) => sum + item.price, 0);
  quote.subtotal = Math.round(quote.subtotal * 100) / 100;
  quote.vat = Math.round(quote.subtotal * PRICING_CONFIG.vatRate * 100) / 100;
  quote.total = Math.round((quote.subtotal + quote.vat) * 100) / 100;
  
  return quote;
}

/**
 * Format price for display
 */
export function formatPrice(price) {
  return `£${price.toFixed(2)}`;
}

/**
 * Get window specifications summary
 */
export function getSpecificationsSummary(windowState) {
  return {
    dimensions: `${windowState.dimensions.width}mm W x ${windowState.dimensions.height}mm H`,
    area: `${calculateArea(windowState.dimensions).toFixed(2)} m²`,
    panes: windowState.panes?.length || 1,
    productType: windowState.productType,
    frameFinish: windowState.finish?.frame?.color || 'White Grain',
    sashFinish: windowState.finish?.sash?.color || 'White Grain',
    glassType: windowState.glass?.default?.paneType || 'Double Glazed',
    handle: windowState.hardware?.handleType || 'Standard',
  };
}
