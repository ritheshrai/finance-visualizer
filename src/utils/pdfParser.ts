import * as pdfjsLib from 'pdfjs-dist';

// Initialize the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
}

export const parseGooglePayPDF = async (file: File): Promise<ParsedTransaction[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const transactions: ParsedTransaction[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items as any[];
    
    // Simple heuristic parsing
    // This assumes lines are somewhat ordered. 
    // Google Pay PDFs are often complex. We'll look for patterns.
    // Pattern: Date (e.g., "Jan 01" or "01 Jan"), Description, Amount
    
    // Note: This is a basic implementation and might need adjustment based on the actual PDF layout.
    // We will collect text items and try to reconstruct lines.
    
    let currentY = -1;
    let currentLine: string[] = [];
    const lines: string[][] = [];

    // Group items by Y coordinate (rows)
    items.forEach(item => {
      // Allow some tolerance for Y coordinate
      if (Math.abs(item.transform[5] - currentY) > 5) {
        if (currentLine.length > 0) {
          lines.push(currentLine);
        }
        currentLine = [];
        currentY = item.transform[5];
      }
      currentLine.push(item.str);
    });
    if (currentLine.length > 0) lines.push(currentLine);

    // Process lines to find transactions
    // Example logic: specific to generic statement formats
    // We look for a date, some text, and a currency amount
    
    const datePattern = /(\w{3}\s\d{1,2},?\s?\d{4}|\d{1,2}\s\w{3},?\s?\d{4})/; // Matches "Jan 01, 2023" or "01 Jan 2023"
    const amountPattern = /[-+]?[₹$]?\s?[\d,]+\.\d{2}/;

    lines.forEach(line => {
      const fullText = line.join(' ');
      
      const dateMatch = fullText.match(datePattern);
      const amountMatch = fullText.match(amountPattern);

      if (dateMatch && amountMatch) {
        let amountStr = amountMatch[0].replace(/[^0-9.-]/g, '');
        let amount = parseFloat(amountStr);
        
        // Determine type based on context (often negative for expense, positive for income)
        // Or "Paid to" vs "Received from"
        let type: 'income' | 'expense' = 'expense';
        if (fullText.toLowerCase().includes('received from') || fullText.toLowerCase().includes('refund')) {
            type = 'income';
        } else if (amount < 0) {
            type = 'expense';
            amount = Math.abs(amount);
        }

        // Description is everything else (rough approximation)
        let description = fullText
            .replace(dateMatch[0], '')
            .replace(amountMatch[0], '')
            .trim();
        
        // Clean up description
        description = description.replace(/^(Paid to|Received from)\s+/i, '');

        if (description && !isNaN(amount)) {
            // Parse date to YYYY-MM-DD
            try {
                const date = new Date(dateMatch[0]);
                const formattedDate = date.toISOString().split('T')[0];
                
                transactions.push({
                    date: formattedDate,
                    description: description.substring(0, 50), // Limit length
                    amount,
                    type
                });
            } catch (e) {
                console.warn('Failed to parse date:', dateMatch[0]);
            }
        }
      }
    });
  }

  return transactions;
};
