import React, { useState, useEffect } from 'react';
import { Modal, Button, Card, Tabs, Toggle } from '../common/UIComponents.js';

/**
 * GlazingModal Component
 * Modal for selecting glazing bar options (Astragal, Georgian, Leaded)
 */
function GlazingModal({ isOpen, onClose, currentGlazing, initialType, onApply }) {
  const [activeTab, setActiveTab] = useState(initialType || currentGlazing?.type || 'Astragal');
  const [backToBack, setBackToBack] = useState(currentGlazing?.backToBack ?? true);
  const [barProfile, setBarProfile] = useState(currentGlazing?.barProfile || 'Standard Ovolo');
  const [jointType, setJointType] = useState(currentGlazing?.jointType || 'Soldered');
  const [leadColor, setLeadColor] = useState(currentGlazing?.leadColor || 'Standard Antique Soldered Lead');
  const [horizontalBars, setHorizontalBars] = useState(currentGlazing?.horizontalBars || 1);
  const [verticalBars, setVerticalBars] = useState(currentGlazing?.verticalBars || 1);
  const [pattern, setPattern] = useState(currentGlazing?.pattern || 'grid');
  
  // Update active tab when initialType changes
  useEffect(() => {
    if (initialType) {
      setActiveTab(initialType);
    }
  }, [initialType]);
  
  const tabs = [
    { id: 'Astragal', label: 'Astragal' },
    { id: 'Georgian', label: 'Georgian' },
    { id: 'Leaded', label: 'Leaded' },
  ];
  
  const barProfiles = [
    { id: 'standard-bevel', name: 'Standard Bevel', image: null },
    { id: 'standard-ovolo', name: 'Standard Ovolo', image: null },
    { id: 'standard-bevel-ovolo', name: 'Standard Bevel Out/Ovolo In', image: null },
    { id: 'standard-ovolo-bevel', name: 'Standard Ovolo Out/Bevel In', image: null },
    { id: 'large-bevel', name: 'Large Bevel', image: null },
    { id: 'large-ovolo', name: 'Large Ovolo', image: null },
  ];
  
  const jointTypes = ['Soldered', 'Welded', 'Crimped'];
  
  const leadColors = [
    { id: 'slim-antique', name: 'Slim Antique Soldered Lead', color: '#4a4a5a' },
    { id: 'standard-antique', name: 'Standard Antique Soldered Lead', color: '#555566' },
    { id: 'wide-antique', name: 'Wide Antique Soldered Lead', color: '#505060' },
    { id: 'slim-silver', name: 'Slim Silver Soldered Lead', color: '#8a8a8a' },
    { id: 'standard-silver', name: 'Standard Silver Soldered Lead', color: '#909090' },
    { id: 'wide-silver', name: 'Wide Silver Soldered Lead', color: '#888888' },
  ];
  
  const handleApply = () => {
    onApply({
      type: activeTab,
      backToBack,
      barProfile,
      jointType,
      leadColor,
      horizontalBars,
      verticalBars,
      pattern,
    });
    onClose();
  };
  
  const renderAstragalTab = () => {
    return React.createElement('div', { className: 'astragal-options' },
      // Description
      React.createElement('p', { className: 'glazing-description' },
        'Astragal bars are applied to the surface of the glass to create the appearance of smaller panes.'
      ),
      
      // Back to back toggle
      React.createElement('div', { className: 'glazing-option-section' },
        React.createElement(Toggle, {
          label: 'Back to Back Spacer Bars',
          checked: backToBack,
          onChange: setBackToBack
        }),
        React.createElement('p', { className: 'option-hint' }, 
          backToBack ? 'Bars on both sides of glass' : 'Bars on external side only'
        )
      ),
      
      // Bar count controls
      React.createElement('div', { className: 'bar-count-section' },
        React.createElement('div', { className: 'bar-count-control' },
          React.createElement('label', null, 'Horizontal Bars'),
          React.createElement('div', { className: 'count-input' },
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setHorizontalBars(Math.max(0, horizontalBars - 1))
            }, '−'),
            React.createElement('span', { className: 'count-value' }, horizontalBars),
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setHorizontalBars(Math.min(10, horizontalBars + 1))
            }, '+')
          )
        ),
        React.createElement('div', { className: 'bar-count-control' },
          React.createElement('label', null, 'Vertical Bars'),
          React.createElement('div', { className: 'count-input' },
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setVerticalBars(Math.max(0, verticalBars - 1))
            }, '−'),
            React.createElement('span', { className: 'count-value' }, verticalBars),
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setVerticalBars(Math.min(10, verticalBars + 1))
            }, '+')
          )
        )
      ),
      
      // Preview
      React.createElement('div', { className: 'glazing-preview' },
        React.createElement('div', { className: 'preview-label' }, 'Preview'),
        React.createElement('div', { className: 'preview-window' },
          renderGlazingPreview('Astragal')
        )
      ),
      
      // Bar profiles
      React.createElement('div', { className: 'bar-profile-section' },
        React.createElement('h4', null, 'Bar Profile'),
        React.createElement('div', { className: 'bar-profile-grid' },
          barProfiles.map((profile) =>
            React.createElement(Card, {
              key: profile.id,
              selected: barProfile === profile.name,
              onClick: () => setBarProfile(profile.name),
              className: 'bar-profile-card'
            },
              React.createElement('div', { className: 'profile-preview' },
                React.createElement('div', { 
                  className: 'profile-shape',
                  style: { 
                    background: profile.id.includes('ovolo') 
                      ? 'linear-gradient(180deg, #f5f5f5 0%, #d0d0d0 50%, #e8e8e8 100%)' 
                      : 'linear-gradient(135deg, #f0f0f0 0%, #d5d5d5 100%)',
                    borderRadius: profile.id.includes('ovolo') ? '6px' : '2px'
                  }
                })
              ),
              React.createElement('span', { className: 'profile-name' }, profile.name)
            )
          )
        )
      )
    );
  };
  
  // Render glazing bars preview
  const renderGlazingPreview = (type) => {
    const previewStyle = {
      width: '120px',
      height: '100px',
      background: 'linear-gradient(180deg, #4a90d9 0%, #87ceeb 50%, #e0f4ff 100%)',
      border: '4px solid #f0f0f0',
      borderRadius: '4px',
      position: 'relative',
      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1)'
    };
    
    const bars = [];
    const barColor = type === 'Leaded' ? '#555566' : '#f8f8f8';
    const barWidth = type === 'Leaded' ? 2 : 4;
    
    // Horizontal bars
    for (let i = 1; i <= horizontalBars; i++) {
      const y = (100 / (horizontalBars + 1)) * i;
      bars.push(
        React.createElement('div', {
          key: `h-${i}`,
          style: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${y}%`,
            height: `${barWidth}px`,
            background: barColor,
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            transform: 'translateY(-50%)'
          }
        })
      );
    }
    
    // Vertical bars
    for (let i = 1; i <= verticalBars; i++) {
      const x = (100 / (verticalBars + 1)) * i;
      bars.push(
        React.createElement('div', {
          key: `v-${i}`,
          style: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${x}%`,
            width: `${barWidth}px`,
            background: barColor,
            boxShadow: '1px 0 2px rgba(0,0,0,0.2)',
            transform: 'translateX(-50%)'
          }
        })
      );
    }
    
    return React.createElement('div', { style: previewStyle }, ...bars);
  };
  
  const renderGeorgianTab = () => {
    const georgianPatterns = [
      { id: 'grid', name: 'Grid', description: 'Standard grid pattern' },
      { id: '6-over-6', name: '6 over 6', description: 'Traditional colonial style' },
      { id: '4-over-4', name: '4 over 4', description: 'Classic 4x4 pattern' },
      { id: '2-over-2', name: '2 over 2', description: 'Simple 2x2 pattern' },
    ];
    
    return React.createElement('div', { className: 'georgian-options' },
      // Description
      React.createElement('p', { className: 'glazing-description' },
        'Georgian bars create a traditional multi-pane appearance with internal muntin bars dividing the glass.'
      ),
      
      // Pattern selection
      React.createElement('div', { className: 'pattern-section' },
        React.createElement('h4', null, 'Pattern Style'),
        React.createElement('div', { className: 'pattern-grid' },
          georgianPatterns.map((p) =>
            React.createElement(Card, {
              key: p.id,
              selected: pattern === p.id,
              onClick: () => {
                setPattern(p.id);
                // Set default bar counts for preset patterns
                if (p.id === '6-over-6') { setHorizontalBars(1); setVerticalBars(2); }
                else if (p.id === '4-over-4') { setHorizontalBars(1); setVerticalBars(1); }
                else if (p.id === '2-over-2') { setHorizontalBars(1); setVerticalBars(1); }
              },
              className: 'pattern-card'
            },
              React.createElement('span', { className: 'pattern-name' }, p.name),
              React.createElement('span', { className: 'pattern-desc' }, p.description)
            )
          )
        )
      ),
      
      // Custom bar count controls
      React.createElement('div', { className: 'bar-count-section' },
        React.createElement('div', { className: 'bar-count-control' },
          React.createElement('label', null, 'Horizontal Bars'),
          React.createElement('div', { className: 'count-input' },
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setHorizontalBars(Math.max(0, horizontalBars - 1))
            }, '−'),
            React.createElement('span', { className: 'count-value' }, horizontalBars),
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setHorizontalBars(Math.min(10, horizontalBars + 1))
            }, '+')
          )
        ),
        React.createElement('div', { className: 'bar-count-control' },
          React.createElement('label', null, 'Vertical Bars'),
          React.createElement('div', { className: 'count-input' },
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setVerticalBars(Math.max(0, verticalBars - 1))
            }, '−'),
            React.createElement('span', { className: 'count-value' }, verticalBars),
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setVerticalBars(Math.min(10, verticalBars + 1))
            }, '+')
          )
        )
      ),
      
      // Preview
      React.createElement('div', { className: 'glazing-preview' },
        React.createElement('div', { className: 'preview-label' }, 'Preview'),
        React.createElement('div', { className: 'preview-window' },
          renderGlazingPreview('Georgian')
        )
      ),
      
      // Bar profiles
      React.createElement('div', { className: 'bar-profile-section' },
        React.createElement('h4', null, 'Bar Profile'),
        React.createElement('div', { className: 'bar-profile-grid' },
          barProfiles.slice(0, 4).map((profile) =>
            React.createElement(Card, {
              key: profile.id,
              selected: barProfile === profile.name,
              onClick: () => setBarProfile(profile.name),
              className: 'bar-profile-card'
            },
              React.createElement('div', { className: 'profile-preview' },
                React.createElement('div', { 
                  className: 'profile-shape',
                  style: { 
                    background: profile.id.includes('ovolo') 
                      ? 'linear-gradient(180deg, #f5f5f5 0%, #d0d0d0 50%, #e8e8e8 100%)' 
                      : 'linear-gradient(135deg, #f0f0f0 0%, #d5d5d5 100%)',
                    borderRadius: profile.id.includes('ovolo') ? '6px' : '2px'
                  }
                })
              ),
              React.createElement('span', { className: 'profile-name' }, profile.name)
            )
          )
        )
      )
    );
  };
  
  const renderLeadedTab = () => {
    return React.createElement('div', { className: 'leaded-options' },
      // Description
      React.createElement('p', { className: 'glazing-description' },
        'Leaded glass features decorative lead strips (cames) that join pieces of glass together in elegant patterns.'
      ),
      
      // Joint type selection
      React.createElement('div', { className: 'joint-type-section' },
        React.createElement('label', null, 'Joint Type'),
        React.createElement('div', { className: 'joint-type-grid' },
          jointTypes.map((type) =>
            React.createElement(Card, {
              key: type,
              selected: jointType === type,
              onClick: () => setJointType(type),
              className: 'joint-card'
            }, type)
          )
        )
      ),
      
      // Bar count controls
      React.createElement('div', { className: 'bar-count-section' },
        React.createElement('div', { className: 'bar-count-control' },
          React.createElement('label', null, 'Horizontal Lines'),
          React.createElement('div', { className: 'count-input' },
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setHorizontalBars(Math.max(0, horizontalBars - 1))
            }, '−'),
            React.createElement('span', { className: 'count-value' }, horizontalBars),
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setHorizontalBars(Math.min(10, horizontalBars + 1))
            }, '+')
          )
        ),
        React.createElement('div', { className: 'bar-count-control' },
          React.createElement('label', null, 'Vertical Lines'),
          React.createElement('div', { className: 'count-input' },
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setVerticalBars(Math.max(0, verticalBars - 1))
            }, '−'),
            React.createElement('span', { className: 'count-value' }, verticalBars),
            React.createElement('button', { 
              className: 'count-btn',
              onClick: () => setVerticalBars(Math.min(10, verticalBars + 1))
            }, '+')
          )
        )
      ),
      
      // Preview
      React.createElement('div', { className: 'glazing-preview' },
        React.createElement('div', { className: 'preview-label' }, 'Preview'),
        React.createElement('div', { className: 'preview-window' },
          renderGlazingPreview('Leaded')
        )
      ),
      
      // Lead color selection
      React.createElement('div', { className: 'lead-color-section' },
        React.createElement('h4', null, 'Lead Colour'),
        React.createElement('div', { className: 'lead-color-grid' },
          leadColors.map((lead) =>
            React.createElement(Card, {
              key: lead.id,
              selected: leadColor === lead.name,
              onClick: () => setLeadColor(lead.name),
              className: 'lead-color-card'
            },
              React.createElement('div', {
                className: 'lead-preview',
                style: { backgroundColor: lead.color }
              }),
              React.createElement('span', { className: 'lead-name' }, lead.name)
            )
          )
        )
      )
    );
  };
  
  return React.createElement(Modal, {
    title: 'Change Glazing',
    isOpen,
    onClose,
    width: '650px'
  },
    React.createElement('div', { className: 'glazing-modal' },
      React.createElement(Tabs, {
        tabs,
        activeTab,
        onTabChange: setActiveTab
      }),
      
      React.createElement('div', { className: 'glazing-tab-content' },
        activeTab === 'Astragal' && renderAstragalTab(),
        activeTab === 'Georgian' && renderGeorgianTab(),
        activeTab === 'Leaded' && renderLeadedTab()
      ),
      
      React.createElement('div', { className: 'modal-actions' },
        React.createElement(Button, {
          variant: 'secondary',
          onClick: onClose
        }, 'Close'),
        React.createElement(Button, {
          variant: 'success',
          onClick: handleApply
        }, 'Apply')
      )
    )
  );
}

export default GlazingModal;
