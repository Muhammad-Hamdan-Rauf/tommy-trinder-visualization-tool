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
  const [viewMode, setViewMode] = useState('welcome');
  
  // Modal state
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  
  // Canvas tools reference
  const [canvasTools, setCanvasTools] = useState(null);
  
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
    // Go directly to main design page with integrated canvas
    setViewMode('design');
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
        initialType: modalData?.type || state.glazing?.type || 'Astragal',
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
  
  // Design mode (main editor with integrated drawing)
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
      
      // Main area - split view with drawing canvas and live preview
      React.createElement('main', { className: 'canvas-area' },
        React.createElement('div', { className: 'canvas-split-view' },
          // Drawing Canvas on the left
          React.createElement('div', { className: 'drawing-section' },
            React.createElement('div', { className: 'section-label' }, 'Design Canvas'),
            React.createElement(DrawingCanvas, { 
              onOpenDimensionsModal: () => handleOpenModal('dimensions'),
              onToolsReady: (tools) => setCanvasTools(tools)
            })
          ),
          // Live Window Rendering on the right
          React.createElement('div', { className: 'preview-section' },
            React.createElement('div', { className: 'section-label' }, 'Live Preview'),
            React.createElement('div', { className: 'live-window-preview' },
              React.createElement(WindowRenderer, {
                scale: 1.0,
                interactive: true,
                showDimensions: true
              })
            )
          )
        )
      ),
      
      // Right side tools panel (separate from canvas)
      React.createElement('aside', { className: 'tools-sidebar' },
        React.createElement('button', {
          className: 'sidebar-tool-btn',
          onClick: () => setViewMode('preview'),
          title: 'Preview on Photo'
        }, '👁️'),
        
        React.createElement('div', { className: 'tools-divider' }),
        
        React.createElement('button', {
          className: 'sidebar-tool-btn',
          onClick: () => canvasTools?.handleDelete(),
          title: 'Delete'
        }, '🗑️'),
        React.createElement('button', {
          className: 'sidebar-tool-btn',
          onClick: () => canvasTools?.handleUndo(),
          title: 'Undo'
        }, '↶'),
        React.createElement('button', {
          className: `sidebar-tool-btn ${canvasTools?.tool === 'draw' ? 'active' : ''}`,
          onClick: () => canvasTools?.setTool('draw'),
          title: 'Draw'
        }, '✏️'),
        React.createElement('button', {
          className: `sidebar-tool-btn ${canvasTools?.tool === 'select' ? 'active' : ''}`,
          onClick: () => canvasTools?.setTool('select'),
          title: 'Select'
        }, '☐'),
        React.createElement('button', {
          className: `sidebar-tool-btn ${canvasTools?.tool === 'erase' ? 'active' : ''}`,
          onClick: () => canvasTools?.setTool('erase'),
          title: 'Eraser'
        }, '⌫'),
        React.createElement('button', {
          className: 'sidebar-tool-btn',
          onClick: () => handleOpenModal('dimensions'),
          title: 'Dimensions'
        }, '📏'),
        React.createElement('button', {
          className: 'sidebar-tool-btn',
          onClick: () => canvasTools?.handleAutoGrid(),
          title: 'Auto Grid'
        }, '⊞')
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
