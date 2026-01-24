import React from 'react';
import { useWindow } from '../../context/WindowContext.js';

/**
 * Header Component
 * Main header with logo, location, product type, and actions
 */
function Header({ onAddItem, onClose }) {
  const { state } = useWindow();
  
  return React.createElement('header', { className: 'app-header' },
    // Logo
    React.createElement('div', { className: 'header-logo' },
      React.createElement('div', { className: 'logo-icon' },
        React.createElement('div', { className: 'logo-grid' },
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map(i =>
            React.createElement('div', {
              key: i,
              className: `logo-cell ${i <= 4 ? 'filled' : ''}`
            })
          )
        )
      ),
      React.createElement('div', { className: 'logo-text' },
        React.createElement('span', { className: 'logo-title' }, 'IMPRESSIVE'),
        React.createElement('span', { className: 'logo-subtitle' }, 'INSTALLER')
      )
    ),
    
    // Center info
    React.createElement('div', { className: 'header-center' },
      React.createElement('h1', { className: 'location-title' }, state.location || 'New Window'),
      state.location && React.createElement('span', { className: 'product-type' },
        state.productType,
        React.createElement('span', { className: 'info-icon' }, 'ⓘ')
      )
    ),
    
    // Actions
    React.createElement('div', { className: 'header-actions' },
      React.createElement('button', {
        className: 'add-item-btn',
        onClick: onAddItem
      }, 'Add Item +'),
      React.createElement('button', {
        className: 'close-btn',
        onClick: onClose
      }, '✕')
    )
  );
}

/**
 * TabNavigation Component
 * Main tab navigation for window options
 */
function TabNavigation({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'OPENERS', label: 'OPENERS' },
    { id: 'PROFILE', label: 'PROFILE' },
    { id: 'FINISH', label: 'FINISH' },
    { id: 'GLASS', label: 'GLASS' },
    { id: 'GLAZING', label: 'GLAZING' },
    { id: 'HARDWARE', label: 'HARDWARE' },
    { id: 'EXTRAS', label: 'EXTRAS' },
  ];
  
  return React.createElement('nav', { className: 'tab-navigation' },
    tabs.map((tab) =>
      React.createElement('button', {
        key: tab.id,
        className: `nav-tab ${activeTab === tab.id ? 'active' : ''}`,
        onClick: () => onTabChange(tab.id)
      }, tab.label)
    )
  );
}

/**
 * Footer Component
 * Bottom bar with item navigation and action buttons
 */
function Footer({ currentItem = 1, totalItems = 1, onDelete, onComplete, onChat }) {
  return React.createElement('footer', { className: 'app-footer' },
    // Left side - settings
    React.createElement('div', { className: 'footer-left' },
      React.createElement('button', { className: 'footer-btn settings-btn' }, '⚙'),
      React.createElement('button', { className: 'footer-btn keyboard-btn' }, '⌨')
    ),
    
    // Center - item navigation
    React.createElement('div', { className: 'footer-center' },
      React.createElement('span', { className: 'item-counter' },
        `Item ${currentItem} of ${totalItems}`
      )
    ),
    
    // Right side - actions
    React.createElement('div', { className: 'footer-right' },
      React.createElement('button', {
        className: 'footer-action-btn delete-btn',
        onClick: onDelete
      }, '🗑'),
      React.createElement('button', {
        className: 'footer-action-btn complete-btn',
        onClick: onComplete
      }, '✓'),
      React.createElement('button', {
        className: 'footer-action-btn chat-btn',
        onClick: onChat
      }, '💬')
    )
  );
}

export { Header, TabNavigation, Footer };
