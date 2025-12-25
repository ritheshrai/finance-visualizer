import * as pdfjsLib from 'pdfjs-dist';

// Initialize the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  source: 'gpay' | 'hdfc' | 'manual' | 'unknown';
}

interface TextItem {
  str: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

// Helper to clean currency strings
const parseAmount = (str: string): number => {
  return parseFloat(str.replace(/[^0-9.-]/g, ''));
};

// Helper to format date to YYYY-MM-DD
const formatDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};

export const parsePDF = async (file: File): Promise<ParsedTransaction[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  const allItems: TextItem[] = [];
  
  // Extract text from all pages
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    // Process items to normalize coordinates (pdf.js y-axis is inverted)
    const viewport = page.getViewport({ scale: 1.0 });
    const pageItems = (textContent.items as any[]).map(item => ({
      str: item.str,
      x: item.transform[4],
      y: viewport.height - item.transform[5], // Normalize Y to top-down
      w: item.width,
      h: item.height
    }));
    
    allItems.push(...pageItems);
  }

  // Detect Bank/Format
  const fullText = allItems.map(i => i.str).join(' ').toLowerCase();
  
  if (fullText.includes('google pay') || fullText.includes('google payment')) {
    return parseGooglePay(allItems);
  } else if (fullText.includes('hdfc bank') || fullText.includes('statement of account')) {
    return parseHDFC(allItems);
  }
  
  throw new Error('Unsupported statement format. Currently supporting Google Pay and HDFC Bank.');
};

const parseGooglePay = (items: TextItem[]): ParsedTransaction[] => {
  const transactions: ParsedTransaction[] = [];
  
  // Sort items by Y (rows), then X (columns)
  items.sort((a, b) => {
    if (Math.abs(a.y - b.y) > 5) return a.y - b.y;
    return a.x - b.x;
  });

  // Group into lines
  const lines: TextItem[][] = [];
  let currentLine: TextItem[] = [];
  let currentY = -1;

  items.forEach(item => {
    if (Math.abs(item.y - currentY) > 5) {
      if (currentLine.length > 0) lines.push(currentLine);
      currentLine = [];
      currentY = item.y;
    }
    currentLine.push(item);
  });
  if (currentLine.length > 0) lines.push(currentLine);

  // Google Pay Logic
  // Pattern 1: Row based
  // Date | Description | ... | Amount
  // Pattern 2: Block based (Mobile export)
  // Look for dates and associated amounts

  const dateRegex = /^[A-Z][a-z]{2}\s\d{1,2},?\s\d{4}$/; // Jan 01, 2024
  const timeRegex = /\d{1,2}:\d{2}\s(?:AM|PM)/;
  const amountRegex = /^[-+]?[₹]?\s?[\d,]+\.\d{2}$/;

  for (let i = 0; i < lines.length; i++) {
    // Check for start of a transaction block (usually starts with Date)
    // Some formats have Date on one line, Description on next, Amount on right
    
    // Strategy: Look for lines containing a valid date
    // Then search subsequent lines for amount and description
    
    const dateMatch = lines[i].find(item => dateRegex.test(item.str.trim()));
    
    if (dateMatch) {
      // Potential transaction start
      const date = dateMatch.str;
      
      // Try to find amount in this line or next few lines
      let amount = 0;
      let type: 'income' | 'expense' = 'expense';
      let description = '';
      
      // Look ahead for amount
      let foundAmount = false;
      for (let j = i; j < Math.min(i + 4, lines.length); j++) {
        const rowAmount = lines[j].find(item => amountRegex.test(item.str.trim()));
        if (rowAmount) {
          let amountStr = rowAmount.str.replace(/[₹,\s]/g, '');
          // Handle negative/positive signs if present, though GPay often uses colors or separate columns
          // Heuristic: If it says "Received from" or "+", it's income
          
          if (amountStr.includes('+') || lines[j].map(x => x.str).join(' ').toLowerCase().includes('received')) {
            type = 'income';
          }
          
          amount = Math.abs(parseFloat(amountStr));
          foundAmount = true;
          break;
        }
      }

      if (foundAmount) {
        // Description is usually the text that isn't date or amount
        // Often in the line after date or same line
        const descLine = lines[i].map(x => x.str).join(' ').replace(date, '').trim();
        const nextLine = lines[i+1] ? lines[i+1].map(x => x.str).join(' ') : '';
        
        description = descLine || nextLine;
        
        // Cleanup description
        description = description
          .replace(amountRegex, '')
          .replace(timeRegex, '')
          .replace(/Paid to/i, '')
          .replace(/Received from/i, '')
          .trim();

        if (description === '' && lines[i+2]) {
           description = lines[i+2].map(x => x.str).join(' ').trim();
        }

        transactions.push({
          date: formatDate(date),
          description: description || 'Google Pay Transaction',
          amount,
          type,
          source: 'gpay'
        });
      }
    }
  }

  return transactions;
};

const parseHDFC = (items: TextItem[]): ParsedTransaction[] => {
  const transactions: ParsedTransaction[] = [];
  
  // Sort items by Y (rows), then X (columns)
  items.sort((a, b) => {
    if (Math.abs(a.y - b.y) > 5) return a.y - b.y;
    return a.x - b.x;
  });

  // Group into lines
  const lines: TextItem[][] = [];
  let currentLine: TextItem[] = [];
  let currentY = -1;

  items.forEach(item => {
    if (Math.abs(item.y - currentY) > 5) {
      if (currentLine.length > 0) lines.push(currentLine);
      currentLine = [];
      currentY = item.y;
    }
    currentLine.push(item);
  });
  if (currentLine.length > 0) lines.push(currentLine);

  // HDFC Format usually:
  // Date | Narration | Chq/Ref | Value Dt | Withdrawal | Deposit | Closing Balance
  
  const dateRegex = /^\d{2}\/\d{2}\/\d{2}$/; // 18/05/24
  
  // Identify columns based on header row (heuristic)
  // We'll scan for lines starting with a date
  
  lines.forEach(line => {
    // Check if first item is a date
    const firstItem = line[0];
    if (firstItem && dateRegex.test(firstItem.str.trim())) {
      // It's a transaction row
      
      const date = firstItem.str;
      
      // Assuming typical HDFC layout:
      // Col 1: Date
      // Col 2: Description (Narration)
      // ...
      // Col 5: Withdrawal (Debit)
      // Col 6: Deposit (Credit)
      
      // We can use item positions (X coords) to be more precise, but let's try finding amounts
      // The last few items usually contain numbers
      
      // Let's look at the items in the line
      // Filter out empty strings
      const rowItems = line.filter(i => i.str.trim() !== '');
      
      if (rowItems.length >= 3) {
        // Last item is usually balance
        // Item before that is Deposit (if present)
        // Item before that is Withdrawal (if present)
        
        // HDFC CSV/PDF often leaves empty columns for zero values
        // We need to check X positions or infer from number of items
        
        const description = rowItems[1].str; // Usually second item
        
        // Finding amounts
        // We look for numbers with 2 decimal places at the end of the list
        const potentialAmounts = rowItems.slice(2).filter(i => /[\d,]+\.\d{2}$/.test(i.str));
        
        let withdrawal = 0;
        let deposit = 0;
        
        // This is tricky without exact column mapping.
        // HDFC PDF: Withdrawal is usually around 60-70% width, Deposit around 70-80%
        // Let's guess based on column index if we assume explicit columns, 
        // but PDF parsing often merges columns.
        
        // heuristic: if 1 amount found before balance -> check if it's credit or debit
        // Often closing balance is the last number.
        // The number before it is the transaction amount.
        
        if (potentialAmounts.length >= 2) {
           // Last is balance, second to last is amount
           // We need to know if it's W or D. 
           // We can check the X position of the amount.
           // HDFC Page width is usually ~600 (A4) or ~800
           
           const amountItem = potentialAmounts[potentialAmounts.length - 2];
           
           // If amountItem X is closer to Balance X -> Deposit?
           // Withdrawal is left of Deposit.
           
           // A safer bet might be regex on narration? No.
           // Let's assume standard layout: Date, Narration, Ref, ValueDt, Debit, Credit, Bal
           // Debit is roughly col 5, Credit col 6.
           
           // Let's normalize X relative to page width (approx 600)
           // Debit x ~ 350-450
           // Credit x ~ 450-550
           
           if (amountItem.x < 450) {
             withdrawal = parseAmount(amountItem.str);
           } else {
             deposit = parseAmount(amountItem.str);
           }
        }
        
        if (withdrawal > 0) {
          transactions.push({
            date: formatDate(date.split('/').reverse().join('-')), // Convert DD/MM/YY to YYYY-MM-DD
            description: description,
            amount: withdrawal,
            type: 'expense',
            source: 'hdfc'
          });
        } else if (deposit > 0) {
           transactions.push({
            date: formatDate(date.split('/').reverse().join('-')),
            description: description,
            amount: deposit,
            type: 'income',
            source: 'hdfc'
          });
        }
      }
    }
  });

  return transactions;
};

