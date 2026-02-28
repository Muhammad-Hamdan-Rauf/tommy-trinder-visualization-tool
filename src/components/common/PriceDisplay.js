import React from 'react';
import { useWindow } from '../../context/WindowContext.js';
import { generateQuote, formatPrice } from '../../utils/pricingUtils.js';

/**
 * PriceDisplay Component
 * Shows real-time running total as user configures window
 */
function PriceDisplay({ compact = false, onClick }) {
  const { state } = useWindow();
  const quote = generateQuote(state);
  
  if (compact) {
    return React.createElement('div', { 
      className: 'price-display-compact',
      onClick: onClick,
      title: 'Click to see full quote'
    },
      React.createElement('span', { className: 'price-label' }, 'Est. Total'),
      React.createElement('span', { className: 'price-amount' }, formatPrice(quote.total))
    );
  }
  
  return React.createElement('div', { className: 'price-display' },
    React.createElement('div', { className: 'price-display-header' },
      React.createElement('span', { className: 'price-title' }, 'Estimated Total'),
      React.createElement('span', { className: 'price-vat-note' }, 'inc. VAT')
    ),
    React.createElement('div', { className: 'price-main' },
      React.createElement('span', { className: 'price-amount-large' }, formatPrice(quote.total))
    ),
    React.createElement('div', { className: 'price-breakdown-mini' },
      React.createElement('span', null, `Subtotal: ${formatPrice(quote.subtotal)}`),
      React.createElement('span', null, `VAT: ${formatPrice(quote.vat)}`)
    ),
    onClick && React.createElement('button', {
      className: 'view-quote-btn',
      onClick: onClick
    }, '📋 View Full Quote')
  );
}

/**
 * PriceBadge Component
 * Small badge showing price addition for an option
 */
function PriceBadge({ price, included = false }) {
  if (included || price === 0) {
    return React.createElement('span', { className: 'price-badge included' }, 'included');
  }
  
  const sign = price > 0 ? '+' : '';
  return React.createElement('span', { className: 'price-badge' }, 
    `${sign}${formatPrice(price)}`
  );
}

/**
 * Hook to get current quote data
 */
function useQuote() {
  const { state } = useWindow();
  return generateQuote(state);
}

export { PriceDisplay, PriceBadge, useQuote };
