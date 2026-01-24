import React, { useState } from 'react';
import { Modal, Button, Card, Tabs, Toggle } from '../common/UIComponents.js';

/**
 * GlazingModal Component
 * Modal for selecting glazing bar options (Astragal, Georgian, Leaded)
 */
function GlazingModal({ isOpen, onClose, currentGlazing, onApply }) {
  const [activeTab, setActiveTab] = useState(currentGlazing?.type || 'Astragal');
  const [backToBack, setBackToBack] = useState(currentGlazing?.backToBack ?? true);
  const [barProfile, setBarProfile] = useState(currentGlazing?.barProfile || 'Standard Ovolo');
  const [jointType, setJointType] = useState(currentGlazing?.jointType || 'Soldered');
  const [leadColor, setLeadColor] = useState(currentGlazing?.leadColor || 'Standard Antique Soldered Lead');
  
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
    });
    onClose();
  };
  
  const renderAstragalTab = () => {
    return React.createElement('div', { className: 'astragal-options' },
      React.createElement(Toggle, {
        label: 'Back to Back Spacer Bars',
        checked: backToBack,
        onChange: setBackToBack
      }),
      
      React.createElement('div', { className: 'bar-profile-grid' },
        barProfiles.map((profile) =>
          React.createElement(Card, {
            key: profile.id,
            selected: barProfile === profile.name,
            onClick: () => setBarProfile(profile.name),
            className: 'bar-profile-card'
          },
            React.createElement('div', { className: 'profile-preview' },
              // SVG representation of bar profile
              React.createElement('svg', {
                width: '100',
                height: '60',
                viewBox: '0 0 100 60'
              },
                React.createElement('rect', {
                  x: '20',
                  y: '10',
                  width: '20',
                  height: '40',
                  fill: '#f0f0f0',
                  stroke: '#333'
                }),
                React.createElement('rect', {
                  x: '60',
                  y: '10',
                  width: '20',
                  height: '40',
                  fill: '#f0f0f0',
                  stroke: '#333'
                }),
                React.createElement('line', {
                  x1: '0',
                  y1: '55',
                  x2: '100',
                  y2: '5',
                  stroke: '#999',
                  strokeWidth: '1'
                })
              )
            ),
            React.createElement('span', { className: 'profile-name' }, profile.name)
          )
        )
      )
    );
  };
  
  const renderGeorgianTab = () => {
    return React.createElement('div', { className: 'georgian-options' },
      React.createElement('p', { className: 'info-text' },
        'Georgian bars create a traditional multi-pane appearance with internal muntin bars.'
      ),
      React.createElement('div', { className: 'bar-profile-grid' },
        barProfiles.slice(0, 4).map((profile) =>
          React.createElement(Card, {
            key: profile.id,
            selected: barProfile === profile.name,
            onClick: () => setBarProfile(profile.name),
            className: 'bar-profile-card'
          },
            React.createElement('span', { className: 'profile-name' }, profile.name)
          )
        )
      )
    );
  };
  
  const renderLeadedTab = () => {
    return React.createElement('div', { className: 'leaded-options' },
      React.createElement('div', { className: 'joint-type-select' },
        React.createElement('label', null, 'Joint Type'),
        React.createElement('select', {
          className: 'select-field',
          value: jointType,
          onChange: (e) => setJointType(e.target.value)
        },
          jointTypes.map((type) =>
            React.createElement('option', { key: type, value: type }, type)
          )
        )
      ),
      
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
