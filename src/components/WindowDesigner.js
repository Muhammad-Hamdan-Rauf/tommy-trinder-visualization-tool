import React, { useState } from 'react';
import { useWindow } from '../context/WindowContext.js';
import { Header, TabNavigation, Footer } from './layout/LayoutComponents.js';
import WindowRenderer from './WindowRenderer.js';
import DrawingCanvas from './DrawingCanvas.js';
import VisualizationPreview from './VisualizationPreview.js';
import { OpenersPanel, ProfilePanel, FinishPanel, GlassPanel, GlazingPanel, HardwarePanel, ExtrasPanel } from './panels/TabPanels.js';

// Modals
import ProductSetupModal from './modals/ProductSetupModal.js';
import { DimensionsModal, InternalHeightsModal, GlazingDimensionsModal } from './modals/DimensionModals.js';
import OpenerModal from './modals/OpenerModal.js';
import { FinishModal, CillModal } from './modals/FinishModals.js';
import GlassModal from './modals/GlassModal.js';
import GlazingModal from './modals/GlazingModal.js';
import HardwareModal from './modals/HardwareModal.js';

/**
 * WindowDesigner Component
 * Main component that orchestrates the window design experience
 */
function WindowDesigner() {
  const { state, actions } = useWindow();
  
  // View modes: 'welcome', 'setup', 'draw', 'design', 'preview'
  const [viewMode, setViewMode] = useState('setup');
  
  // Modal state
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  
  // Handle modal opening
  const handleOpenModal = (modalType, data = null) => {
    setActiveModal(modalType);
    setModalData(data);
  };
  
  // Handle modal closing
  const handleCloseModal = () => {
    setActiveModal(null);
    setModalData(null);
  };
  
  // Handle product setup save
  const handleProductSetup = (productInfo) => {
    actions.setProductInfo({
      productType: productInfo.productType,
      location: productInfo.location,
      jobType: productInfo.jobType
    });
    setViewMode('draw');
  };
  
  // Handle dimension updates
  const handleDimensionsApply = (dims) => {
    actions.setDimensions(dims);
  };
  
  // Handle opener updates
  const handleOpenerApply = (paneId, opener) => {
    actions.setOpener(paneId, opener);
  };
  
  // Handle opener removal
  const handleOpenerRemove = (paneId) => {
    actions.setOpener(paneId, null);
  };
  
  // Handle finish updates
  const handleFinishApply = (part, finish) => {
    actions.setFinish(part, finish);
  };
  
  // Handle glass updates
  const handleGlassApply = (paneId, glass) => {
    actions.setGlass(paneId, glass);
  };
  
  // Handle glass apply to all
  const handleGlassApplyToAll = (glass) => {
    state.panes.forEach(pane => {
      actions.setGlass(pane.id, glass);
    });
    actions.setGlass('default', glass);
  };
  
  // Handle glazing updates
  const handleGlazingApply = (glazing) => {
    actions.setGlazing(glazing);
  };
  
  // Handle hardware updates
  const handleHardwareApply = (hardware) => {
    actions.setHardware(hardware);
  };
  
  // Handle extras updates
  const handleExtrasApply = (extras) => {
    actions.setExtras(extras);
  };
  
  // Render active tab panel
  const renderActivePanel = () => {
    switch (state.ui.activeTab) {
      case 'OPENERS':
        return React.createElement(OpenersPanel, { onOpenModal: handleOpenModal });
      case 'PROFILE':
        return React.createElement(ProfilePanel, { onOpenModal: handleOpenModal });
      case 'FINISH':
        return React.createElement(FinishPanel, { onOpenModal: handleOpenModal });
      case 'GLASS':
        return React.createElement(GlassPanel, { onOpenModal: handleOpenModal });
      case 'GLAZING':
        return React.createElement(GlazingPanel, { onOpenModal: handleOpenModal });
      case 'HARDWARE':
        return React.createElement(HardwarePanel, { onOpenModal: handleOpenModal });
      case 'EXTRAS':
        return React.createElement(ExtrasPanel, { onOpenModal: handleOpenModal });
      default:
        return null;
    }
  };
  
  // Render modals
  const renderModals = () => {
    return React.createElement(React.Fragment, null,
      // Product Setup Modal
      React.createElement(ProductSetupModal, {
        isOpen: viewMode === 'setup',
        onClose: () => {
          // If they have a location (adding new item), go back to design
          // If no location yet (initial setup), close modal but show welcome screen
          if (state.location) {
            setViewMode('design');
          } else {
            // For initial setup, just close the modal - they can reopen it
            setViewMode('welcome');
          }
        },
        onSave: handleProductSetup,
        productType: 'Flush Casement'
      }),
      
      // Dimensions Modal
      React.createElement(DimensionsModal, {
        isOpen: activeModal === 'dimensions',
        onClose: handleCloseModal,
        dimensions: state.dimensions,
        onApply: handleDimensionsApply
      }),
      
      // Internal Heights Modal
      React.createElement(InternalHeightsModal, {
        isOpen: activeModal === 'internal-heights',
        onClose: handleCloseModal,
        dimensions: state.dimensions,
        grid: state.grid,
        onApply: handleDimensionsApply
      }),
      
      // Opener Modal
      activeModal === 'opener' && React.createElement(OpenerModal, {
        isOpen: true,
        onClose: handleCloseModal,
        paneId: modalData?.paneId,
        currentOpener: state.openers[modalData?.paneId],
        onApply: handleOpenerApply,
        onRemove: handleOpenerRemove
      }),
      
      // Finish Modal
      activeModal === 'finish' && React.createElement(FinishModal, {
        isOpen: true,
        onClose: handleCloseModal,
        currentFinish: state.finish[modalData?.part],
        part: modalData?.part,
        onApply: handleFinishApply
      }),
      
      // Glass Modal
      activeModal === 'glass' && React.createElement(GlassModal, {
        isOpen: true,
        onClose: handleCloseModal,
        paneId: modalData?.paneId,
        currentGlass: state.glass[modalData?.paneId] || state.glass.default,
        onApply: handleGlassApply,
        onApplyToAll: handleGlassApplyToAll
      }),
      
      // Glazing Modal
      activeModal === 'glazing' && React.createElement(GlazingModal, {
        isOpen: true,
        onClose: handleCloseModal,
        currentGlazing: state.glazing,
        onApply: handleGlazingApply
      }),
      
      // Glazing Dimensions Modal
      React.createElement(GlazingDimensionsModal, {
        isOpen: activeModal === 'glazing-dimensions',
        onClose: handleCloseModal,
        dimensions: state.glazing.dimensions,
        onApply: (dims) => actions.setGlazing({ dimensions: dims })
      }),
      
      // Hardware Modal
      activeModal === 'hardware' && React.createElement(HardwareModal, {
        isOpen: true,
        onClose: handleCloseModal,
        currentHardware: state.hardware,
        onApply: handleHardwareApply
      }),
      
      // Cill Modal
      activeModal === 'cill' && React.createElement(CillModal, {
        isOpen: true,
        onClose: handleCloseModal,
        extras: state.extras,
        onApply: handleExtrasApply
      })
    );
  };
  
  // Welcome/Start screen
  if (viewMode === 'welcome') {
    return React.createElement('div', { className: 'window-designer welcome-mode' },
      React.createElement('div', { className: 'welcome-container' },
        React.createElement('div', { className: 'welcome-content' },
          React.createElement('h1', null, 'Window Designer'),
          React.createElement('p', null, 'Create custom window configurations with ease'),
          React.createElement('button', {
            className: 'btn btn-primary btn-large',
            onClick: () => setViewMode('setup')
          }, 'Start New Window Design')
        )
      ),
      renderModals()
    );
  }
  
  // Preview mode
  if (viewMode === 'preview') {
    return React.createElement('div', { className: 'window-designer preview-mode' },
      React.createElement(VisualizationPreview, {
        onBack: () => setViewMode('design')
      }),
      renderModals()
    );
  }
  
  // Draw mode
  if (viewMode === 'draw') {
    return React.createElement('div', { className: 'window-designer draw-mode' },
      React.createElement(Header, {
        onAddItem: () => {
          if (window.confirm('Start a new window? Current drawing will be cleared.')) {
            actions.resetWindow();
            setViewMode('setup');
          }
        },
        onClose: () => {
          if (window.confirm('Exit drawing mode? Your drawing will be lost.')) {
            actions.resetWindow();
            setViewMode('setup');
          }
        }
      }),
      
      React.createElement('div', { className: 'draw-mode-content' },
        React.createElement('div', { className: 'draw-instructions' },
          React.createElement('h2', null, 'Draw Your Window'),
          React.createElement('p', null, 'Draw a rectangle to create the window frame, then draw lines inside to create panes')
        ),
        React.createElement(DrawingCanvas, { 
          width: 700, 
          height: 500,
          onOpenDimensionsModal: () => handleOpenModal('dimensions')
        }),
        
        React.createElement('div', { className: 'draw-actions' },
          React.createElement('button', {
            className: 'btn btn-secondary',
            onClick: () => setViewMode('setup')
          }, '← Back'),
          React.createElement('button', {
            className: 'btn btn-success',
            onClick: () => setViewMode('design')
          }, 'Continue to Design →')
        )
      ),
      renderModals()
    );
  }
  
  // Design mode (main editor)
  return React.createElement('div', { className: 'window-designer design-mode' },
    React.createElement(Header, {
      onAddItem: () => setViewMode('setup'),
      onClose: () => {
        if (window.confirm('Are you sure you want to close? Any unsaved changes will be lost.')) {
          actions.resetWindow();
          setViewMode('setup');
        }
      }
    }),
    
    React.createElement(TabNavigation, {
      activeTab: state.ui.activeTab,
      onTabChange: actions.setActiveTab
    }),
    
    React.createElement('div', { className: 'designer-content' },
      // Left sidebar - options panel
      React.createElement('aside', { className: 'options-sidebar' },
        renderActivePanel()
      ),
      
      // Main area - window preview
      React.createElement('main', { className: 'window-preview-area' },
        // Dimension controls
        React.createElement('div', { className: 'dimension-controls' },
          React.createElement('button', {
            className: 'dimension-btn top',
            onClick: () => handleOpenModal('dimensions')
          },
            React.createElement('span', { className: 'dim-marker red' }),
            React.createElement('span', { className: 'dim-value' }, state.dimensions.width)
          ),
          
          React.createElement('button', {
            className: 'dimension-btn right',
            onClick: () => handleOpenModal('dimensions')
          },
            React.createElement('span', { className: 'dim-value blue' }, state.dimensions.height)
          ),
          
          state.grid.rows > 1 && React.createElement('button', {
            className: 'dimension-btn left-upper',
            onClick: () => handleOpenModal('internal-heights')
          },
            React.createElement('span', { className: 'dim-value green' }, state.dimensions.upperHeight)
          ),
          
          state.grid.rows > 1 && React.createElement('button', {
            className: 'dimension-btn left-lower',
            onClick: () => handleOpenModal('internal-heights')
          },
            React.createElement('span', { className: 'dim-value green' }, state.dimensions.lowerHeight)
          )
        ),
        
        // Window renderer
        React.createElement('div', { className: 'window-renderer-container' },
          React.createElement(WindowRenderer, {
            scale: 0.45,
            interactive: true
          })
        ),
        
        // Quick actions
        React.createElement('div', { className: 'quick-actions-bar' },
          React.createElement('button', {
            className: 'quick-action-btn',
            onClick: () => setViewMode('draw')
          }, '✏️ Edit Drawing'),
          React.createElement('button', {
            className: 'quick-action-btn preview',
            onClick: () => setViewMode('preview')
          }, '👁️ Preview on Photo')
        )
      )
    ),
    
    React.createElement(Footer, {
      currentItem: 1,
      totalItems: 1,
      onDelete: () => {
        if (window.confirm('Delete this window design?')) {
          actions.resetWindow();
          setViewMode('setup');
        }
      },
      onComplete: () => {
        alert('Window design saved!');
      },
      onChat: () => {}
    }),
    
    renderModals()
  );
}

export default WindowDesigner;
