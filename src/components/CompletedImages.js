import React from 'react';

/**
 * CompletedImages Component
 * Displays saved visualizations and allows attaching them to quotes (simulated)
 */
function CompletedImages({ completedImages, onDelete, onToggleQuoteAttachment }) {
  return React.createElement('div', { className: 'completed-images' },
    React.createElement('h2', null, 'Completed Images'),
    
    completedImages.length === 0 
      ? React.createElement('p', { className: 'empty-message' }, 'No completed visualizations yet')
      : React.createElement('div', { className: 'completed-grid' },
          completedImages.map((image) =>
            React.createElement('div', { key: image.id, className: 'completed-item' },
              React.createElement('img', { src: image.thumbnail, alt: image.name }),
              React.createElement('div', { className: 'completed-info' },
                React.createElement('span', { className: 'completed-name', title: image.name },
                  image.name
                ),
                React.createElement('div', { className: 'completed-actions' },
                  React.createElement('button', {
                    className: `attach-btn ${image.attachedToQuote ? 'attached' : ''}`,
                    onClick: () => onToggleQuoteAttachment(image.id)
                  }, image.attachedToQuote ? '✓ Attached' : 'Attach to Quote'),
                  React.createElement('button', {
                    className: 'delete-btn',
                    onClick: () => onDelete(image.id)
                  }, 'Delete')
                )
              )
            )
          )
        )
  );
}

export default CompletedImages;
