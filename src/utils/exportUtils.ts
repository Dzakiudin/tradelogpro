import type { Trade } from '../types';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './index';

export const exportTradesToExcel = (trades: Trade[]) => {
    const data = trades.map(t => ({
        'Date': t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleString('id-ID') : '',
        'Pair': t.asset,
        'Direction': t.type,
        'Setup': t.setup,
        'Entry Type': t.entryType || '-',
        'Lot Size': t.lotSize || '-',
        'Entry Price': t.entryPrice || '-',
        'Exit Price': t.exitPrice || '-',
        'Stop Loss': t.slPrice || '-',
        'Take Profit': t.tpPrice || '-',
        'Outcome': t.outcome,
        'Net P/L': t.amount,
        'P/L (%)': t.pnlPercent || '-',
        'R:R': t.rr,
        'Mood': t.mood,
        'Catatan': t.strategy
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trade History");
    XLSX.writeFile(workbook, `TradeLogPro_History_${new Date().toISOString().split('T')[0]}.xlsx`);
};

export const exportTradesToPDF = (trades: Trade[], currency: string) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    const pageW = doc.internal.pageSize.getWidth();

    // ── Colors ──
    const brandDark = [10, 15, 30] as const;
    const brandAccent = [99, 102, 241] as const;  // indigo
    const white = [255, 255, 255] as const;
    const lightGray = [248, 250, 252] as const;
    const textDark = [30, 41, 59] as const;
    const textMuted = [100, 116, 139] as const;
    const green = [16, 185, 129] as const;
    const red = [244, 63, 94] as const;

    // ── Header Banner ──
    doc.setFillColor(...brandDark);
    doc.rect(0, 0, pageW, 38, 'F');
    
    // Accent bar
    doc.setFillColor(...brandAccent);
    doc.rect(0, 38, pageW, 2, 'F');

    doc.setTextColor(...white);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('TRADELOGPRO', 14, 16);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Trade History Report', 14, 24);
    doc.text(`Generated: ${new Date().toLocaleString('id-ID')}`, 14, 31);
    
    // Right side stats on banner
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(`${trades.length}`, pageW - 14, 16, { align: 'right' });
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('TOTAL TRADES', pageW - 14, 23, { align: 'right' });

    // ── Summary Cards ──
    const wins = trades.filter(t => t.outcome === 'Profit').length;
    const losses = trades.filter(t => t.outcome === 'Loss').length;
    const totalPnL = trades.reduce((sum, t) => sum + (t.amount || 0), 0);
    const winRate = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(1) : '0';

    const cardY = 46;
    const cardH = 18;
    const cardW = (pageW - 14 * 2 - 8 * 3) / 4;
    const cards = [
        { label: 'WIN RATE', value: `${winRate}%`, color: brandAccent },
        { label: 'WINS', value: `${wins}`, color: green },
        { label: 'LOSSES', value: `${losses}`, color: red },
        { label: 'NET P/L', value: `${totalPnL >= 0 ? '+' : ''}${formatCurrency(Math.abs(totalPnL), currency)}`, color: totalPnL >= 0 ? green : red },
    ];

    cards.forEach((card, i) => {
        const x = 14 + i * (cardW + 8);
        // Card bg
        doc.setFillColor(...lightGray);
        doc.roundedRect(x, cardY, cardW, cardH, 2, 2, 'F');
        // Accent left border
        doc.setFillColor(...(card.color as [number, number, number]));
        doc.rect(x, cardY, 3, cardH, 'F');
        // Label
        doc.setTextColor(...textMuted);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text(card.label, x + 8, cardY + 7);
        // Value
        doc.setTextColor(...(card.color as [number, number, number]));
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(card.value, x + 8, cardY + 14.5);
    });

    // ── Table ──
    const tableColumn = ["Date", "Pair", "Side", "Setup", "Entry Type", "Lot", "Entry", "Exit", "SL", "TP", "Result", "Net P/L", "P/L %", "R:R", "Mood"];
    const tableRows: any[] = [];

    trades.forEach(t => {
        tableRows.push([
            t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
            t.asset,
            t.type,
            t.setup,
            t.entryType || '-',
            t.lotSize ?? '-',
            t.entryPrice ?? '-',
            t.exitPrice ?? '-',
            t.slPrice ?? '-',
            t.tpPrice ?? '-',
            t.outcome,
            `${t.outcome === 'Loss' ? '-' : '+'}${formatCurrency(Math.abs(t.amount), currency)}`,
            t.pnlPercent ? `${t.pnlPercent}%` : '-',
            `1:${t.rr}`,
            t.mood
        ]);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        theme: 'plain',
        styles: {
            fontSize: 7.5,
            cellPadding: { top: 3, bottom: 3, left: 4, right: 4 },
            textColor: textDark as any,
            lineColor: [226, 232, 240],
            lineWidth: 0.3,
            font: 'helvetica',
        },
        headStyles: {
            fillColor: brandDark as any,
            textColor: white as any,
            fontSize: 7,
            fontStyle: 'bold',
            halign: 'center',
            cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252] as any,
        },
        columnStyles: {
            0: { cellWidth: 28 },           // Date
            1: { fontStyle: 'bold' },        // Pair
            2: { halign: 'center' },         // Side
            3: { halign: 'center' },         // Setup
            4: { halign: 'center' },         // Entry Type
            5: { halign: 'center' },         // Lot
            6: { halign: 'right' },          // Entry
            7: { halign: 'right' },          // Exit
            8: { halign: 'right' },          // SL
            9: { halign: 'right' },          // TP
            10: { halign: 'center' },        // Result
            11: { halign: 'right', fontStyle: 'bold' },  // Net P/L
            12: { halign: 'center' },        // P/L %
            13: { halign: 'center' },        // R:R
            14: { halign: 'center' },        // Mood
        },
        didParseCell: (data: any) => {
            // Color Result column
            if (data.section === 'body' && data.column.index === 10) {
                if (data.cell.raw === 'Profit') {
                    data.cell.styles.textColor = green;
                    data.cell.styles.fontStyle = 'bold';
                } else if (data.cell.raw === 'Loss') {
                    data.cell.styles.textColor = red;
                    data.cell.styles.fontStyle = 'bold';
                }
            }
            // Color Net P/L column
            if (data.section === 'body' && data.column.index === 11) {
                const val = String(data.cell.raw);
                if (val.startsWith('+')) {
                    data.cell.styles.textColor = green;
                } else if (val.startsWith('-')) {
                    data.cell.styles.textColor = red;
                }
            }
            // Color Side column
            if (data.section === 'body' && data.column.index === 2) {
                if (data.cell.raw === 'Long') {
                    data.cell.styles.textColor = [59, 130, 246]; // blue
                } else if (data.cell.raw === 'Short') {
                    data.cell.styles.textColor = [249, 115, 22]; // orange
                }
            }
        },
    });

    // ── Footer ──
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageH = doc.internal.pageSize.getHeight();
        doc.setFillColor(...brandDark);
        doc.rect(0, pageH - 12, pageW, 12, 'F');
        doc.setTextColor(...textMuted);
        doc.setFontSize(7);
        doc.text('TradeLogPro — Professional Trading Journal', 14, pageH - 5);
        doc.text(`Page ${i} of ${pageCount}`, pageW - 14, pageH - 5, { align: 'right' });
    }

    doc.save(`TradeLogPro_History_${new Date().toISOString().split('T')[0]}.pdf`);
};
