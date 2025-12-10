import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- 1. BULK PDF GENERATOR ---
export const generateBulkPDF = (user, payments) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const themeColor = [19, 182, 236]; 

  // Header
  doc.setFillColor(...themeColor);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("StyleDecor", 14, 25);
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("STATEMENT OF ACCOUNT", pageWidth - 14, 25, { align: "right" });

  // Info Section
  const yStart = 55;
  doc.setTextColor(100);
  doc.setFontSize(10);
  doc.text("BILLED TO:", 14, yStart);
  
  doc.setTextColor(0);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(user?.displayName || "Customer", 14, yStart + 6);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(user?.email || "", 14, yStart + 12);
  doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, yStart + 18);

  const totalSpent = payments.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const currency = payments[0]?.currency?.toUpperCase() || "BDT";

  doc.setFillColor(245, 247, 250);
  doc.roundedRect(pageWidth - 85, yStart - 5, 70, 30, 2, 2, "F");

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Total Transactions:", pageWidth - 80, yStart + 5);
  doc.text("Total Amount Paid:", pageWidth - 80, yStart + 15);

  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text(`${payments.length}`, pageWidth - 20, yStart + 5, { align: "right" });
  
  doc.setTextColor(...themeColor);
  doc.setFontSize(12);
  doc.text(`${totalSpent} ${currency}`, pageWidth - 20, yStart + 15, { align: "right" });

  const tableColumn = ["#", "Service Description", "Trx ID", "Date", "Amount"];
  const tableRows = [];

  payments.forEach((payment, index) => {
    const paymentData = [
      index + 1,
      payment.service_name || "Unknown Service",
      payment.transactionId,
      new Date(payment.paidAt).toLocaleDateString(),
      `${payment.amount} ${payment.currency?.toUpperCase() || currency}`,
    ];
    tableRows.push(paymentData);
  });

  autoTable(doc, {
    startY: yStart + 35,
    head: [tableColumn],
    body: tableRows,
    theme: "striped",
    headStyles: { fillColor: themeColor, textColor: 255, fontStyle: 'bold', halign: 'center' },
    styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak' },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' }, 
      1: { cellWidth: 'auto' },
      2: { cellWidth: 55, font: 'courier', fontSize: 8 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
    foot: [['', '', '', 'GRAND TOTAL:', `${totalSpent} ${currency}`]],
    footStyles: { fillColor: [241, 245, 249], textColor: 0, fontStyle: 'bold', halign: 'right' }
  });

  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(200);
      doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.setFont("helvetica", "normal");
      doc.text("StyleDecor Inc. - Automated Payment Statement", 14, pageHeight - 12);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 14, pageHeight - 12, { align: "right" });
  }

  doc.save(`StyleDecor_Statement_${user?.displayName}.pdf`);
};

// --- 2. SINGLE RECEIPT PDF GENERATOR ---
export const generateSingleReceipt = (user, payment) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(245, 247, 250);
  doc.rect(0, 0, pageWidth, 50, "F");

  doc.setTextColor(19, 182, 236);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("StyleDecor", 15, 25);

  doc.setFontSize(16);
  doc.setTextColor(100);
  doc.text("PAYMENT RECEIPT", pageWidth - 15, 25, { align: "right" });
  
  doc.setFontSize(9);
  doc.text(`Receipt #: ${payment._id.slice(-6).toUpperCase()}`, pageWidth - 15, 35, { align: "right" });

  const yStart = 65;
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("BILLED TO:", 15, yStart);
  
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text(user?.displayName || "Valued Customer", 15, yStart + 7);
  doc.setFont("helvetica", "normal");
  doc.text(user?.email || "", 15, yStart + 13);

  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text("TRANSACTION DETAILS:", 110, yStart);

  doc.setTextColor(0);
  doc.setFontSize(9);
  doc.text("Payment Date:", 110, yStart + 7);
  doc.text(new Date(payment.paidAt).toLocaleString(), 150, yStart + 7);

  doc.text("Transaction ID:", 110, yStart + 14);
  const trxId = doc.splitTextToSize(payment.transactionId, 50);
  doc.setFont("courier", "normal");
  doc.text(trxId, 150, yStart + 14);

  const nextY = yStart + 14 + (trxId.length * 5); 
  doc.setFont("helvetica", "normal");
  doc.text("Tracking ID:", 110, nextY);
  doc.text(payment.trackingId || "N/A", 150, nextY);

  autoTable(doc, {
    startY: nextY + 15,
    head: [["Description", "Price", "Total"]],
    body: [[
        payment.service_name,
        `${payment.amount} ${payment.currency?.toUpperCase()}`,
        `${payment.amount} ${payment.currency?.toUpperCase()}`,
    ]],
    theme: "striped",
    headStyles: { fillColor: [19, 182, 236], textColor: 255 },
    columnStyles: { 0: { cellWidth: 100 }, 1: { halign: 'right' }, 2: { halign: 'right', fontStyle: 'bold' } },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setDrawColor(200);
  doc.line(120, finalY, pageWidth - 15, finalY);
  
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(19, 182, 236);
  doc.text("Total Paid:", 140, finalY + 10);
  doc.text(`${payment.amount} ${payment.currency?.toUpperCase() || "BDT"}`, pageWidth - 15, finalY + 10, { align: "right" });

  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(1.5);
  doc.roundedRect(15, finalY, 40, 14, 2, 2);
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(16);
  doc.text("PAID", 35, finalY + 9, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business! If you have any questions, please contact support@styledecor.com", pageWidth / 2, pageHeight - 10, { align: "center" });

  doc.save(`Receipt_${payment.transactionId}.pdf`);
};