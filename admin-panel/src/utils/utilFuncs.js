import { states } from "./constants";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


export function formatDate(date) {
  const options = { month: 'short', day: 'numeric', year: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}

export function formatDateTime(date) {
  const options = { month: 'short', day: 'numeric', year: '2-digit' };
  const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  const formattedDate = new Date(date).toLocaleDateString(undefined, options);
  const formattedTime = new Date(date).toLocaleTimeString(undefined, timeOptions);
  return `${formattedTime} - ${formattedDate}`;
}

export function calculateTax(price, country, state) {
  if (country === "Canada") {
    const province = states.find((s) => s.name === state);
    if (province)
      return (price * province.tax) / 100;
    else
      return (price * 0.05);
  }
  else
    return (price * 0.05);
}



const addLogoAndHeader = async (doc) => {
  const logoUrl = `${window.location.origin}/assets/images/logo.png`;
  const logo = await fetch(logoUrl)
    .then(res => res.blob())
    .then(blob => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    }));

  const logoWidth = 16;
  const logoHeight = 16;
  doc.addImage(logo, 'PNG', 14, 10, logoWidth, logoHeight);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Faithzy', 35, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('A subsidiary of Ramega', 35, 24);

  doc.setDrawColor(150);
  doc.line(14, 32, 196, 32);
};

// Generate Product Order Invoice
export const generateProductInvoice = async (order, subOrder = null, isBuyer = true) => {
  const doc = new jsPDF();
  
  await addLogoAndHeader(doc);

  // Invoice header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 14, 45);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 52);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 57);

  // Buyer and Seller information
  let yPos = 67;
  
  if (isBuyer) {
    // Buyer's view - show billing info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    yPos += 5;
    doc.text(`${order.billingInfo.firstName} ${order.billingInfo.lastName}`, 14, yPos);
    yPos += 5;
    doc.text(`${order.billingInfo.address}`, 14, yPos);
    yPos += 5;
    doc.text(`${order.billingInfo.city}, ${order.billingInfo.state} ${order.billingInfo.zipCode}`, 14, yPos);
    yPos += 5;
    doc.text(`${order.billingInfo.country}`, 14, yPos);
    yPos += 5;
    doc.text(`Email: ${order.billingInfo.email}`, 14, yPos);
    yPos += 5;
    doc.text(`Phone: ${order.billingInfo.phoneNumber}`, 14, yPos);
  } else {
    // Seller's view - show customer info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer:', 14, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    yPos += 5;
    doc.text(`${order.billingInfo.firstName} ${order.billingInfo.lastName}`, 14, yPos);
    yPos += 5;
    doc.text(`Email: ${order.billingInfo.email}`, 14, yPos);
    yPos += 5;
    doc.text(`Phone: ${order.billingInfo.phoneNumber}`, 14, yPos);
  }

  yPos += 10;

  // Order details table
  const products = subOrder ? [subOrder] : order.products;
  const tableData = products.map(product => [
    product.customOrderId || 'N/A',
    product.productId?.title || 'N/A',
    product.count,
    `$${(isBuyer ? product.buyerPaid.salesPrice : product.sellerToGet.salesPrice).toFixed(2)}`,
    `$${(isBuyer ? product.buyerPaid.shippingFees : product.sellerToGet.shippingFees).toFixed(2)}`,
    `$${((isBuyer ? product.buyerPaid.salesPrice : product.sellerToGet.salesPrice) * product.count + 
        (isBuyer ? product.buyerPaid.shippingFees : product.sellerToGet.shippingFees)).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Order ID', 'Product', 'Qty', 'Price', 'Shipping', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 10 }
  });

  // Summary
  yPos = doc.lastAutoTable.finalY + 10;
  const summaryX = 120;

  if (isBuyer) {
    const summary = subOrder ? {
      totalSalesPrice: subOrder.buyerPaid.salesPrice * subOrder.count,
      totalShipping: subOrder.buyerPaid.shippingFees,
      commission: subOrder.buyerPaid.commission,
      subtotal: subOrder.buyerPaid.subtotal,
      tax: subOrder.buyerPaid.tax,
      total: subOrder.buyerPaid.total
    } : order.summary.paidByBuyer;

    doc.setFontSize(10);
    doc.text('Subtotal:', summaryX, yPos);
    doc.text(`$${summary.totalSalesPrice.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 6;
    
    doc.text('Shipping:', summaryX, yPos);
    doc.text(`$${summary.totalShipping.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 6;
    
    doc.text('Service Fee:', summaryX, yPos);
    doc.text(`$${summary.commission.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 6;
    
    doc.text('Tax:', summaryX, yPos);
    doc.text(`$${summary.tax.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total Paid:', summaryX, yPos);
    doc.text(`$${summary.total.toFixed(2)}`, 185, yPos, { align: 'right' });
  } else {
    const summary = subOrder;
    
    doc.setFontSize(10);
    doc.text('Sales Price:', summaryX, yPos);
    doc.text(`$${(summary.sellerToGet.salesPrice * summary.count).toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 6;
    
    doc.text('Shipping:', summaryX, yPos);
    doc.text(`$${summary.sellerToGet.shippingFees.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 6;
    
    doc.text('Service Fee:', summaryX, yPos);
    doc.text(`-$${summary.sellerToGet.commission.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('You Earned:', summaryX, yPos);
    doc.text(`$${summary.sellerToGet.total.toFixed(2)}`, 185, yPos, { align: 'right' });
  }

  // Payment method
  yPos += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Payment Method: ${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}`, 14, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.text('This is a computer-generated invoice.', 105, 285, { align: 'center' });

  doc.save(`Invoice_${subOrder ? subOrder.customOrderId : order._id}.pdf`);
};

// Generate Service Order Invoice
export const generateServiceInvoice = async (order, isBuyer = true) => {
  const doc = new jsPDF();
  
  await addLogoAndHeader(doc);

  // Invoice header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 14, 45);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 52);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 57);
  doc.text(`Order ID: #${order.customOrderId}`, 14, 62);

  // Customer information
  let yPos = 72;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(isBuyer ? 'Bill To:' : 'Customer:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPos += 5;
  doc.text(`${order.buyerInfo.firstName} ${order.buyerInfo.lastName}`, 14, yPos);
  yPos += 5;
  doc.text(`${order.buyerInfo.country}`, 14, yPos);
  yPos += 5;
  doc.text(`Email: ${order.buyerInfo.email}`, 14, yPos);
  yPos += 5;
  doc.text(`Phone: ${order.buyerInfo.phoneNumber}`, 14, yPos);

  yPos += 10;

  // Service details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Service Details:', 14, yPos);
  yPos += 7;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Service: ${order.service.serviceId?.title || 'N/A'}`, 14, yPos);
  yPos += 5;
  doc.text(`Package: ${order.service.pkg.name} - ${order.service.pkg.title}`, 14, yPos);
  yPos += 5;
  
  if (order.service.pkg.type === "Questions and Answer Order") {
    doc.text(`Questions: ${order.service.pkg.numQuestions}`, 14, yPos);
    yPos += 5;
  } else if (order.service.pkg.deliveryDays) {
    doc.text(`Delivery Time: ${order.service.pkg.deliveryDays} days`, 14, yPos);
    yPos += 5;
  } else if (order.service.pkg.duration) {
    doc.text(`Duration: ${order.service.pkg.duration.hours}h ${order.service.pkg.duration.minutes}m`, 14, yPos);
    yPos += 5;
  }
  
  doc.text(`Status: ${order.service.crrStatus}`, 14, yPos);

  yPos += 10;

  // Financial summary
  const summaryX = 120;
  
  if (isBuyer) {
    doc.setFontSize(10);
    doc.text('Service Price:', summaryX, yPos);
    doc.text(`$${order.summary.paidByBuyer.salesPrice.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 6;
    
    doc.text('Service Fee:', summaryX, yPos);
    doc.text(`$${order.summary.paidByBuyer.commission.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 6;
    
    doc.text('Tax:', summaryX, yPos);
    doc.text(`$${order.summary.paidByBuyer.tax.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Total Paid:', summaryX, yPos);
    doc.text(`$${order.summary.paidByBuyer.total.toFixed(2)}`, 185, yPos, { align: 'right' });
  } else {
    doc.setFontSize(10);
    doc.text('Service Price:', summaryX, yPos);
    doc.text(`$${order.summary.sellerToGet.salesPrice.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 6;
    
    doc.text('Service Fee:', summaryX, yPos);
    doc.text(`-$${order.summary.sellerToGet.commission.toFixed(2)}`, 185, yPos, { align: 'right' });
    yPos += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('You Earned:', summaryX, yPos);
    doc.text(`$${order.summary.sellerToGet.total.toFixed(2)}`, 185, yPos, { align: 'right' });
  }

  // Payment method
  yPos += 15;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Payment Method: ${order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}`, 14, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text('Thank you for your business!', 105, 280, { align: 'center' });
  doc.text('This is a computer-generated invoice.', 105, 285, { align: 'center' });

  doc.save(`Invoice_${order.customOrderId}.pdf`);
};

// Generate Packing Slip
export const generatePackingSlip = async (order, subOrder) => {
  const doc = new jsPDF();
  
  await addLogoAndHeader(doc);

  // Packing slip header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('PACKING SLIP', 14, 45);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 52);
  doc.text(`Order ID: #${subOrder.customOrderId}`, 14, 57);

  let yPos = 67;

  // Shipping address
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ship To:', 14, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  yPos += 5;
  doc.text(`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`, 14, yPos);
  yPos += 5;
  doc.text(`${order.shippingAddress.address}`, 14, yPos);
  yPos += 5;
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`, 14, yPos);
  yPos += 5;
  doc.text(`${order.shippingAddress.country}`, 14, yPos);

  yPos += 15;

  // Product details
  const tableData = [[
    subOrder.productId?.title || 'N/A',
    subOrder.count,
    subOrder.productId?.category || 'N/A'
  ]];

  autoTable(doc, {
    startY: yPos,
    head: [['Product', 'Quantity', 'Category']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { fontSize: 10 }
  });

  yPos = doc.lastAutoTable.finalY + 15;

  // Tracking info (if available)
  if (subOrder.trackingDetails) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Tracking Information:', 14, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Tracking Number: ${subOrder.trackingDetails.trackingNumber}`, 14, yPos);
    yPos += 5;
    doc.text(`Tracking Link: ${subOrder.trackingDetails.link}`, 14, yPos);
    
    if (subOrder.trackingDetails.note) {
      yPos += 5;
      doc.text(`Note: ${subOrder.trackingDetails.note}`, 14, yPos);
    }
  }

  // Special note
  if (order.billingInfo.note) {
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Special Instructions:', 14, yPos);
    yPos += 7;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitNote = doc.splitTextToSize(order.billingInfo.note, 180);
    doc.text(splitNote, 14, yPos);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128);
  doc.text('Thank you for your order!', 105, 280, { align: 'center' });

  doc.save(`PackingSlip_${subOrder.customOrderId}.pdf`);
};