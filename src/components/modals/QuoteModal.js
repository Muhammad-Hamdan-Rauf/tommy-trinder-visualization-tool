import React, { useState, useRef } from 'react';
import { Modal, Button } from '../common/UIComponents.js';
import { generateQuote, formatPrice, getSpecificationsSummary } from '../../utils/pricingUtils.js';

/**
 * QuoteModal Component
 * Displays itemized quote with pricing breakdown and PDF download option
 */
function QuoteModal({ isOpen, onClose, windowState }) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const quoteRef = useRef(null);
  
  if (!isOpen || !windowState) return null;
  
  const quote = generateQuote(windowState);
  const specs = getSpecificationsSummary(windowState);
  
  // Group items by category for display
  const groupedItems = quote.items.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {});
  
  // Generate PDF using canvas approach
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Dynamic import of jspdf
      const { default: jsPDF } = await import('jspdf');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;
      
      // Helper to add text with word wrap
      const addText = (text, x, y, options = {}) => {
        const { fontSize = 10, fontStyle = 'normal', color = [0, 0, 0], maxWidth = pageWidth - 2 * margin } = options;
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        pdf.setTextColor(...color);
        
        if (maxWidth) {
          const lines = pdf.splitTextToSize(text, maxWidth);
          pdf.text(lines, x, y);
          return lines.length * (fontSize * 0.4);
        }
        pdf.text(text, x, y);
        return fontSize * 0.4;
      };
      
      // Header
      pdf.setFillColor(30, 58, 95);
      pdf.rect(0, 0, pageWidth, 45, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('WINDOW QUOTE', margin, 25);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Reference: ${quote.reference}`, margin, 35);
      pdf.text(`Date: ${quote.date}`, pageWidth - margin - 50, 35);
      
      yPos = 55;
      
      // Customer details (if provided)
      if (customerName || customerEmail || customerPhone) {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Customer Details', margin, yPos);
        yPos += 7;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        if (customerName) {
          pdf.text(`Name: ${customerName}`, margin, yPos);
          yPos += 5;
        }
        if (customerEmail) {
          pdf.text(`Email: ${customerEmail}`, margin, yPos);
          yPos += 5;
        }
        if (customerPhone) {
          pdf.text(`Phone: ${customerPhone}`, margin, yPos);
          yPos += 5;
        }
        yPos += 5;
      }
      
      // Project Details
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(30, 58, 95);
      pdf.text('Project Details', margin, yPos);
      yPos += 7;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Location: ${quote.project.location}`, margin, yPos);
      yPos += 5;
      pdf.text(`Product: ${quote.project.productType}`, margin, yPos);
      yPos += 5;
      pdf.text(`Job Type: ${quote.project.jobType}`, margin, yPos);
      yPos += 5;
      pdf.text(`Dimensions: ${specs.dimensions}`, margin, yPos);
      yPos += 5;
      pdf.text(`Area: ${specs.area}`, margin, yPos);
      yPos += 10;
      
      // Itemized costs table header
      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, yPos - 3, pageWidth - 2 * margin, 8, 'F');
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Description', margin + 2, yPos + 2);
      pdf.text('Amount', pageWidth - margin - 25, yPos + 2);
      yPos += 10;
      
      // Items by category
      pdf.setFont('helvetica', 'normal');
      Object.entries(groupedItems).forEach(([category, items]) => {
        // Check for page break
        if (yPos > pageHeight - 60) {
          pdf.addPage();
          yPos = margin;
        }
        
        // Category header
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 58, 95);
        pdf.text(category, margin + 2, yPos);
        yPos += 6;
        
        // Items
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        items.forEach(item => {
          if (yPos > pageHeight - 40) {
            pdf.addPage();
            yPos = margin;
          }
          
          const desc = pdf.splitTextToSize(item.description, pageWidth - 2 * margin - 35);
          pdf.text(desc, margin + 5, yPos);
          pdf.text(formatPrice(item.price), pageWidth - margin - 25, yPos);
          yPos += desc.length * 5 + 2;
        });
        
        yPos += 3;
      });
      
      // Totals section
      if (yPos > pageHeight - 50) {
        pdf.addPage();
        yPos = margin;
      }
      
      yPos += 5;
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;
      
      // Subtotal
      pdf.setFont('helvetica', 'normal');
      pdf.text('Subtotal (ex. VAT)', margin + 2, yPos);
      pdf.text(formatPrice(quote.subtotal), pageWidth - margin - 25, yPos);
      yPos += 6;
      
      // VAT
      pdf.text('VAT (20%)', margin + 2, yPos);
      pdf.text(formatPrice(quote.vat), pageWidth - margin - 25, yPos);
      yPos += 8;
      
      // Total
      pdf.setFillColor(30, 58, 95);
      pdf.rect(margin, yPos - 3, pageWidth - 2 * margin, 10, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('TOTAL', margin + 2, yPos + 4);
      pdf.text(formatPrice(quote.total), pageWidth - margin - 25, yPos + 4);
      yPos += 15;
      
      // Notes
      if (notes) {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Notes:', margin, yPos);
        yPos += 5;
        pdf.setFont('helvetica', 'normal');
        const noteLines = pdf.splitTextToSize(notes, pageWidth - 2 * margin);
        pdf.text(noteLines, margin, yPos);
        yPos += noteLines.length * 5 + 5;
      }
      
      // Footer
      pdf.setTextColor(128, 128, 128);
      pdf.setFontSize(8);
      pdf.text(`Quote valid until: ${quote.validUntil}`, margin, pageHeight - 15);
      pdf.text('This is an estimated quote. Final prices may vary.', margin, pageHeight - 10);
      
      // Save PDF
      pdf.save(`Window-Quote-${quote.reference}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    
    setIsGeneratingPDF(false);
  };
  
  return React.createElement(Modal, {
    title: 'Window Quote',
    isOpen,
    onClose,
    width: '800px'
  },
    React.createElement('div', { className: 'quote-modal', ref: quoteRef },
      // Quote Header
      React.createElement('div', { className: 'quote-header' },
        React.createElement('div', { className: 'quote-header-left' },
          React.createElement('h2', { className: 'quote-title' }, 'Quote Summary'),
          React.createElement('p', { className: 'quote-reference' }, `Reference: ${quote.reference}`),
          React.createElement('p', { className: 'quote-date' }, `Date: ${quote.date}`)
        ),
        React.createElement('div', { className: 'quote-header-right' },
          React.createElement('div', { className: 'quote-total-display' },
            React.createElement('span', { className: 'quote-total-label' }, 'Total'),
            React.createElement('span', { className: 'quote-total-amount' }, formatPrice(quote.total))
          )
        )
      ),
      
      // Customer Details (Optional)
      React.createElement('div', { className: 'quote-section customer-section' },
        React.createElement('h3', { className: 'section-title' }, 'Customer Details (Optional)'),
        React.createElement('div', { className: 'customer-form' },
          React.createElement('div', { className: 'form-row' },
            React.createElement('input', {
              type: 'text',
              placeholder: 'Customer Name',
              value: customerName,
              onChange: (e) => setCustomerName(e.target.value),
              className: 'quote-input'
            }),
            React.createElement('input', {
              type: 'email',
              placeholder: 'Email Address',
              value: customerEmail,
              onChange: (e) => setCustomerEmail(e.target.value),
              className: 'quote-input'
            })
          ),
          React.createElement('div', { className: 'form-row' },
            React.createElement('input', {
              type: 'tel',
              placeholder: 'Phone Number',
              value: customerPhone,
              onChange: (e) => setCustomerPhone(e.target.value),
              className: 'quote-input'
            })
          )
        )
      ),
      
      // Project Info
      React.createElement('div', { className: 'quote-section project-section' },
        React.createElement('h3', { className: 'section-title' }, 'Project Details'),
        React.createElement('div', { className: 'project-info-grid' },
          React.createElement('div', { className: 'project-info-item' },
            React.createElement('span', { className: 'info-label' }, 'Location'),
            React.createElement('span', { className: 'info-value' }, quote.project.location)
          ),
          React.createElement('div', { className: 'project-info-item' },
            React.createElement('span', { className: 'info-label' }, 'Product'),
            React.createElement('span', { className: 'info-value' }, quote.project.productType)
          ),
          React.createElement('div', { className: 'project-info-item' },
            React.createElement('span', { className: 'info-label' }, 'Job Type'),
            React.createElement('span', { className: 'info-value' }, quote.project.jobType)
          ),
          React.createElement('div', { className: 'project-info-item' },
            React.createElement('span', { className: 'info-label' }, 'Dimensions'),
            React.createElement('span', { className: 'info-value' }, specs.dimensions)
          ),
          React.createElement('div', { className: 'project-info-item' },
            React.createElement('span', { className: 'info-label' }, 'Area'),
            React.createElement('span', { className: 'info-value' }, specs.area)
          ),
          React.createElement('div', { className: 'project-info-item' },
            React.createElement('span', { className: 'info-label' }, 'Panes'),
            React.createElement('span', { className: 'info-value' }, specs.panes)
          )
        )
      ),
      
      // Itemized Costs
      React.createElement('div', { className: 'quote-section items-section' },
        React.createElement('h3', { className: 'section-title' }, 'Itemized Costs'),
        React.createElement('div', { className: 'quote-items-list' },
          Object.entries(groupedItems).map(([category, items]) => 
            React.createElement('div', { key: category, className: 'quote-category' },
              React.createElement('div', { className: 'category-header' }, category),
              items.map((item, idx) => 
                React.createElement('div', { key: idx, className: 'quote-item' },
                  React.createElement('span', { className: 'item-description' }, item.description),
                  React.createElement('span', { className: 'item-price' }, formatPrice(item.price))
                )
              )
            )
          )
        )
      ),
      
      // Totals
      React.createElement('div', { className: 'quote-totals' },
        React.createElement('div', { className: 'totals-row subtotal' },
          React.createElement('span', null, 'Subtotal (ex. VAT)'),
          React.createElement('span', null, formatPrice(quote.subtotal))
        ),
        React.createElement('div', { className: 'totals-row vat' },
          React.createElement('span', null, 'VAT (20%)'),
          React.createElement('span', null, formatPrice(quote.vat))
        ),
        React.createElement('div', { className: 'totals-row total' },
          React.createElement('span', null, 'Total'),
          React.createElement('span', null, formatPrice(quote.total))
        )
      ),
      
      // Notes
      React.createElement('div', { className: 'quote-section notes-section' },
        React.createElement('h3', { className: 'section-title' }, 'Notes'),
        React.createElement('textarea', {
          placeholder: 'Add any additional notes for this quote...',
          value: notes,
          onChange: (e) => setNotes(e.target.value),
          className: 'quote-notes',
          rows: 3
        })
      ),
      
      // Valid Until
      React.createElement('p', { className: 'quote-validity' },
        `This quote is valid until ${quote.validUntil}`
      ),
      
      // Actions
      React.createElement('div', { className: 'quote-actions' },
        React.createElement('button', {
          className: 'btn btn-secondary',
          onClick: onClose
        }, 'Close'),
        React.createElement('button', {
          className: `btn btn-primary ${isGeneratingPDF ? 'loading' : ''}`,
          onClick: handleDownloadPDF,
          disabled: isGeneratingPDF
        }, isGeneratingPDF ? 'Generating PDF...' : '📄 Download PDF')
      )
    )
  );
}

export default QuoteModal;
