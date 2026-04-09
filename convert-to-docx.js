const docx = require("docx");
const fs = require("fs");
const path = require("path");

const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  PageBreak, TabStopType, TabStopPosition, Header, Footer, ImageRun,
  TableLayoutType, VerticalAlign, convertInchesToTwip
} = docx;

// Color scheme
const COLORS = {
  primary: "1B4F72",
  primaryLight: "2980B9",
  primaryBg: "D6EAF8",
  accent: "E67E22",
  success: "27AE60",
  successBg: "D5F5E3",
  danger: "E74C3C",
  dangerBg: "FADBD8",
  warning: "F39C12",
  warningBg: "FEF9E7",
  dark: "2C3E50",
  gray: "7F8C8D",
  lightGray: "ECF0F1",
  white: "FFFFFF",
  tableHeader: "1B4F72",
  tableAlt: "EBF5FB",
};

function createTitlePage(title, subtitle) {
  return [
    new Paragraph({ spacing: { before: 3000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: "BETATICKETS", font: "Calibri Light", size: 32, color: COLORS.gray, characterSpacing: 300 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.primary, space: 20 } },
      children: [new TextRun({ text: title, font: "Calibri Light", size: 56, color: COLORS.primary, bold: true })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 600 },
      children: [new TextRun({ text: subtitle, font: "Calibri", size: 26, color: COLORS.gray, italics: true })],
    }),
    new Paragraph({ spacing: { before: 1200 } }),
    createInfoRow("Project", "BetaTicket - Movie Ticket Booking App"),
    createInfoRow("Auteur", "Adil Harhour"),
    createInfoRow("Datum", "09-04-2026"),
    createInfoRow("Versie", "1.0"),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 2400 },
      children: [new TextRun({ text: "BIT Academy - Jaar 3 Eindproject", font: "Calibri", size: 20, color: COLORS.gray })],
    }),
    new Paragraph({
      children: [new PageBreak()],
    }),
  ];
}

function createInfoRow(label, value) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 80 },
    children: [
      new TextRun({ text: `${label}: `, font: "Calibri", size: 22, color: COLORS.gray }),
      new TextRun({ text: value, font: "Calibri", size: 22, color: COLORS.dark, bold: true }),
    ],
  });
}

function createHeading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: COLORS.primary, space: 8 } },
    children: [new TextRun({ text, font: "Calibri Light", size: 36, color: COLORS.primary, bold: true })],
  });
}

function createHeading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 360, after: 160 },
    children: [
      new TextRun({ text: "\u2502 ", font: "Calibri", size: 30, color: COLORS.primaryLight, bold: true }),
      new TextRun({ text, font: "Calibri Light", size: 30, color: COLORS.dark, bold: true }),
    ],
  });
}

function createHeading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, font: "Calibri", size: 24, color: COLORS.primaryLight, bold: true })],
  });
}

function createHeading4(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_4,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, font: "Calibri", size: 22, color: COLORS.dark, bold: true, italics: true })],
  });
}

function createBodyText(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60 },
    children: parseInlineFormatting(text),
  });
}

function createStatusBadge(status) {
  let color, bgColor, icon;
  const s = status.toUpperCase();
  if (s.includes("GESLAAGD") && !s.includes("DEELS")) {
    color = COLORS.success; bgColor = COLORS.successBg; icon = "\u2713 ";
  } else if (s.includes("DEELS")) {
    color = COLORS.warning; bgColor = COLORS.warningBg; icon = "\u25CB ";
  } else if (s.includes("GEFAALD")) {
    color = COLORS.danger; bgColor = COLORS.dangerBg; icon = "\u2717 ";
  } else {
    color = COLORS.dark; bgColor = COLORS.lightGray; icon = "";
  }
  return [new TextRun({ text: icon + status, font: "Calibri", size: 20, color, bold: true })];
}

function createTable(headerCells, dataRows, options = {}) {
  const colCount = headerCells.length;
  const colWidth = Math.floor(9200 / colCount);
  const rows = [];

  // Header
  rows.push(new TableRow({
    tableHeader: true,
    height: { value: 440, rule: "atLeast" },
    children: headerCells.map(cell => new TableCell({
      shading: { type: ShadingType.SOLID, color: COLORS.tableHeader, fill: COLORS.tableHeader },
      verticalAlign: VerticalAlign.CENTER,
      width: { size: colWidth, type: WidthType.DXA },
      margins: { top: 60, bottom: 60, left: 100, right: 100 },
      children: [new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: cell, bold: true, color: COLORS.white, size: 20, font: "Calibri" })],
      })],
    })),
  }));

  // Data rows
  dataRows.forEach((row, idx) => {
    const cells = Array.isArray(row) ? row : [row];
    while (cells.length < colCount) cells.push("");

    rows.push(new TableRow({
      height: { value: 360, rule: "atLeast" },
      children: cells.slice(0, colCount).map((cell, colIdx) => {
        const isStatusCol = headerCells[colIdx] && headerCells[colIdx].toLowerCase().includes("status");
        const isResultCol = headerCells[colIdx] && (headerCells[colIdx].toLowerCase().includes("resultaat") || headerCells[colIdx].toLowerCase().includes("totaal"));
        const cellText = String(cell);

        let children;
        if ((isStatusCol || isResultCol) && /GESLAAGD|GEFAALD|DEELS/i.test(cellText)) {
          children = createStatusBadge(cellText);
        } else {
          children = parseInlineFormatting(cellText);
        }

        return new TableCell({
          shading: idx % 2 === 0 ? { type: ShadingType.SOLID, color: COLORS.tableAlt, fill: COLORS.tableAlt } : {},
          verticalAlign: VerticalAlign.CENTER,
          width: { size: colWidth, type: WidthType.DXA },
          margins: { top: 40, bottom: 40, left: 100, right: 100 },
          children: [new Paragraph({ children })],
        });
      }),
    }));
  });

  return new Table({
    rows,
    width: { size: 9200, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "BDC3C7" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "BDC3C7" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "BDC3C7" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "BDC3C7" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "D5D8DC" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "D5D8DC" },
    },
  });
}

function createCalloutBox(text, type = "info") {
  let bgColor, borderColor, icon;
  switch (type) {
    case "success": bgColor = COLORS.successBg; borderColor = COLORS.success; icon = "\u2713 "; break;
    case "warning": bgColor = COLORS.warningBg; borderColor = COLORS.warning; icon = "\u26A0 "; break;
    case "danger": bgColor = COLORS.dangerBg; borderColor = COLORS.danger; icon = "\u2717 "; break;
    default: bgColor = COLORS.primaryBg; borderColor = COLORS.primaryLight; icon = "\u2139 "; break;
  }
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    shading: { type: ShadingType.SOLID, color: bgColor, fill: bgColor },
    border: { left: { style: BorderStyle.SINGLE, size: 12, color: borderColor, space: 8 } },
    indent: { left: 200, right: 200 },
    children: [
      new TextRun({ text: icon, font: "Calibri", size: 22, color: borderColor }),
      ...parseInlineFormatting(text),
    ],
  });
}

function parseInlineFormatting(text) {
  const runs = [];
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  const regex = /(\*\*\*(.*?)\*\*\*|\*\*(.*?)\*\*|\*(.*?)\*|`(.*?)`|(\u2194|\u2713|\u2717|\u25CB)|([^*`\u2194\u2713\u2717\u25CB]+))/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match[2] !== undefined) {
      runs.push(new TextRun({ text: match[2], bold: true, italics: true, size: 22, font: "Calibri", color: COLORS.dark }));
    } else if (match[3] !== undefined) {
      runs.push(new TextRun({ text: match[3], bold: true, size: 22, font: "Calibri", color: COLORS.dark }));
    } else if (match[4] !== undefined) {
      runs.push(new TextRun({ text: match[4], italics: true, size: 22, font: "Calibri", color: COLORS.gray }));
    } else if (match[5] !== undefined) {
      runs.push(new TextRun({ text: ` ${match[5]} `, font: "Consolas", size: 19, color: COLORS.danger, shading: { type: ShadingType.SOLID, color: COLORS.lightGray, fill: COLORS.lightGray } }));
    } else {
      const t = match[6] || match[7];
      if (t) runs.push(new TextRun({ text: t, size: 22, font: "Calibri", color: COLORS.dark }));
    }
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text, size: 22, font: "Calibri", color: COLORS.dark }));
  }
  return runs;
}

function parseMarkdownToDocx(md, docTitle, docSubtitle) {
  const lines = md.split("\n");
  const elements = [...createTitlePage(docTitle, docSubtitle)];
  let i = 0;
  let skipFirstHeading = true;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "" || /^---+\s*$/.test(line.trim())) { i++; continue; }

    // Headings
    const headingMatch = line.match(/^(#{1,4})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      let text = headingMatch[2].replace(/\[.*?\]\(.*?\)/g, (m) => {
        const t = m.match(/\[(.*?)\]/);
        return t ? t[1] : m;
      });

      // Skip the first h1 (already on title page)
      if (level === 1 && skipFirstHeading) { skipFirstHeading = false; i++; continue; }

      if (level === 1) elements.push(createHeading1(text));
      else if (level === 2) elements.push(createHeading2(text));
      else if (level === 3) elements.push(createHeading3(text));
      else elements.push(createHeading4(text));
      i++;
      continue;
    }

    // Table detection
    if (line.includes("|") && i + 1 < lines.length && /\|[\s-:]+\|/.test(lines[i + 1])) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") {
        tableLines.push(lines[i]);
        i++;
      }
      const header = tableLines[0];
      const dataRows = tableLines.slice(2);
      const parseRow = (row) => row.split("|").map(c => c.trim()).filter(c => c !== "");
      const headerCells = parseRow(header);
      const data = dataRows.map(r => parseRow(r));
      elements.push(createTable(headerCells, data));
      elements.push(new Paragraph({ spacing: { before: 80, after: 80 } }));
      continue;
    }

    // Numbered list
    const listMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (listMatch) {
      elements.push(new Paragraph({
        spacing: { before: 40, after: 40 },
        indent: { left: 400 },
        children: [
          new TextRun({ text: `${listMatch[1]}.  `, bold: true, size: 22, font: "Calibri", color: COLORS.primaryLight }),
          ...parseInlineFormatting(listMatch[2]),
        ],
      }));
      i++;
      continue;
    }

    // Bullet list
    if (line.match(/^[-*]\s+/)) {
      const text = line.replace(/^[-*]\s+/, "");
      elements.push(new Paragraph({
        spacing: { before: 40, after: 40 },
        indent: { left: 400 },
        children: [
          new TextRun({ text: "\u25B8  ", size: 22, font: "Calibri", color: COLORS.primaryLight }),
          ...parseInlineFormatting(text),
        ],
      }));
      i++;
      continue;
    }

    // Callout boxes for special paragraphs
    const trimmed = line.trim();
    if (trimmed.startsWith("**Verwacht eindresultaat:**")) {
      elements.push(createCalloutBox(trimmed.replace("**Verwacht eindresultaat:**", "Verwacht eindresultaat:"), "info"));
      i++;
      continue;
    }
    if (trimmed.startsWith("**Resultaat:**")) {
      const result = trimmed.replace("**Resultaat:**", "").trim();
      let type = "info";
      if (/GESLAAGD/i.test(result) && !/DEELS/i.test(result)) type = "success";
      else if (/DEELS/i.test(result)) type = "warning";
      else if (/GEFAALD/i.test(result)) type = "danger";
      elements.push(createCalloutBox(`Resultaat: ${result}`, type));
      i++;
      continue;
    }
    if (trimmed.startsWith("**Opmerking:**")) {
      elements.push(createCalloutBox(trimmed.replace("**Opmerking:**", "Opmerking:"), "warning"));
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(createBodyText(line));
    i++;
  }

  return elements;
}

async function convertFile(inputPath, outputPath, title, subtitle) {
  const md = fs.readFileSync(inputPath, "utf-8");
  const elements = parseMarkdownToDocx(md, title, subtitle);

  const doc = new Document({
    creator: "Adil Harhour",
    title: title,
    description: subtitle,
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 22, color: COLORS.dark },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: { top: 1200, right: 1200, bottom: 1200, left: 1200 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: COLORS.primaryBg, space: 4 } },
            children: [
              new TextRun({ text: "BetaTickets", font: "Calibri Light", size: 18, color: COLORS.gray }),
              new TextRun({ text: "  |  ", font: "Calibri", size: 18, color: COLORS.lightGray }),
              new TextRun({ text: title, font: "Calibri Light", size: 18, color: COLORS.gray, italics: true }),
            ],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 2, color: COLORS.primaryBg, space: 4 } },
            children: [
              new TextRun({ text: "Adil Harhour  \u2022  BIT Academy  \u2022  2026", font: "Calibri", size: 16, color: COLORS.gray }),
            ],
          })],
        }),
      },
      children: elements,
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created: ${outputPath}`);
}

async function main() {
  const base = path.join(__dirname, "PortfolioFiles", "Files");

  await convertFile(
    path.join(base, "Testscenarios_BetaTickets.md"),
    path.join(base, "Testscenarios_BetaTickets.docx"),
    "Testscenario's",
    "Handmatige testscenario's voor de BetaTickets applicatie"
  );

  await convertFile(
    path.join(base, "Testrapport_BetaTickets.md"),
    path.join(base, "Testrapport_BetaTickets.docx"),
    "Testrapport",
    "Testresultaten en conclusie voor de BetaTickets applicatie"
  );

  console.log("\nDone! Both documents have been created with professional formatting.");
}

main().catch(console.error);
