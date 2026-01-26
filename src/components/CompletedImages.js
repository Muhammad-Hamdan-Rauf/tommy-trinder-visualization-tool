import React from 'react';

/**
 * CompletedImages Component
 * Displays saved visualizations and allows attaching them to quotes (simulated)
 * Completed visualizations are immutable (locked) unless explicitly edited
 */
function CompletedImages({ completedImages, onDelete, onToggleQuoteAttachment, onEdit }) {
  return React.createElement('div', { className: 'completed-images' },
    React.createElement('div', { className: 'completed-header' },
      React.createElement('h2', null, 'Completed Images'),
      React.createElement('span', { className: 'completed-count' }, 
        `${completedImages.length} saved`
      )
    ),
    
    completedImages.length === 0 
      ? React.createElement('div', { className: 'empty-message' },
          React.createElement('p', null, '📁 No completed visualizations yet'),
          React.createElement('p', { className: 'empty-hint' }, 
            'Create and save visualizations from the canvas to see them here'
          )
        )
      : React.createElement('div', { className: 'completed-grid' },
          completedImages.map((image) =>
            React.createElement('div', { 
              key: image.id, 
              className: `completed-item ${image.attachedToQuote ? 'attached-to-quote' : ''} ${image.locked ? 'locked' : ''}` 
            },
              // Thumbnail
              React.createElement('div', { className: 'completed-thumbnail' },
                React.createElement('img', { 
                  src: image.thumbnail, 
                  alt: image.name,
                  title: image.name 
                }),
                
                // Lock indicator
                image.locked && React.createElement('div', { 
                  className: 'lock-badge',
                  title: 'This visualization is locked and cannot be modified'
                }, '🔒'),
                
                // Quote attachment indicator
                image.attachedToQuote && React.createElement('div', { 
                  className: 'quote-badge',
                  title: 'Attached to quote'
                }, '✓')
              ),
              
              // Info and actions
              React.createElement('div', { className: 'completed-info' },
                React.createElement('span', { 
                  className: 'completed-name', 
                  title: image.name 
                }, image.name),
                
                React.createElement('div', { className: 'completed-meta' },
                  React.createElement('span', { className: 'product-count' },
                    `${image.products?.length || 0} product${(image.products?.length || 0) !== 1 ? 's' : ''}`
                  ),
                  image.createdAt && React.createElement('span', { className: 'created-date' },
                    new Date(image.createdAt).toLocaleDateString()
                  )
                ),
                
                React.createElement('div', { className: 'completed-actions' },
                  // Attach to quote button
                  React.createElement('button', {
                    className: `attach-btn ${image.attachedToQuote ? 'attached' : ''}`,
                    onClick: () => onToggleQuoteAttachment(image.id),
                    title: image.attachedToQuote ? 'Remove from quote' : 'Attach to quote'
                  }, image.attachedToQuote ? '✓ In Quote' : 'Add to Quote'),
                  
                  // Edit button (creates editable copy)
                  onEdit && React.createElement('button', {
                    className: 'edit-btn',
                    onClick: () => onEdit(image.id),
                    title: 'Load as editable draft'
                  }, '✏️ Edit'),
                  
                  // Delete button
                  React.createElement('button', {
                    className: 'delete-btn',
                    onClick: () => {
                      // Prevent deletion if attached to quote
                      if (image.attachedToQuote) {
                        alert('Cannot delete a visualization attached to a quote. Remove it from the quote first.');
                        return;
                      }
                      onDelete(image.id);
                    },
                    title: image.attachedToQuote ? 'Cannot delete while attached to quote' : 'Delete visualization',
                    disabled: image.attachedToQuote
                  }, '🗑️')
                )
              )
            )
          )
        )
  );
}

export default CompletedImages;
