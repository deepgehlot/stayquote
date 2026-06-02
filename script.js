const fs = require('fs');

function processPDFLayout() {
  let content = fs.readFileSync('components/dashboard/pdf/layouts/CasaConcretoLayout.tsx', 'utf8');
  
  // Add Font import
  content = content.replace(
    'import { View, Text, Image, Page } from "@react-pdf/renderer";',
    'import { View, Text, Image, Page, Font } from "@react-pdf/renderer";\n\nFont.register({\n  family: "Sweet Sans Pro",\n  fonts: [\n    { src: "/CasaConcreto/sweet/SweetSansProRegular.otf" },\n    { src: "/CasaConcreto/sweet/SweetSansProBold.otf", fontWeight: "bold" },\n    { src: "/CasaConcreto/sweet/SweetSansProItalic.otf", fontStyle: "italic" }\n  ]\n});'
  );

  // Add font family to page
  content = content.replace(
    '<Page size="A4" style={{ padding: 0, backgroundColor: bgMain, color: textMed }}>',
    '<Page size="A4" style={{ padding: 0, backgroundColor: bgMain, color: textMed, fontFamily: "Sweet Sans Pro" }}>'
  );

  // Logo gap
  content = content.replace('paddingRight: 45, alignItems: "flex-end"', 'paddingRight: 15, alignItems: "flex-end"');

  // Split into header and rest to only reduce fonts below header
  const parts = content.split('          <View style={{ paddingHorizontal: 50 }}>');
  let header = parts[0];
  let rest = parts.slice(1).join('          <View style={{ paddingHorizontal: 50 }}>');

  // Reduce paddingHorizontal below header
  rest = '<View style={{ paddingHorizontal: 20 }}>' + rest;
  rest = rest.replace(/<View style=\{\{ paddingHorizontal: 50 \}\}>/g, '<View style={{ paddingHorizontal: 20 }}>');

  // Reduce fonts in rest by ~15-20%
  rest = rest.replace(/fontSize: ([\d\.]+)/g, (match, p1) => {
    let size = parseFloat(p1);
    size = Math.round(size * 0.8 * 10) / 10; // Reduce by 20%
    return 'fontSize: ' + size;
  });

  fs.writeFileSync('components/dashboard/pdf/layouts/CasaConcretoLayout.tsx', header + rest);
  console.log('PDF layout updated');
}

function processHTMLPreview() {
  let content = fs.readFileSync('components/dashboard/modals/PDFPreviewModal.tsx', 'utf8');

  const fontStyle = `
          <style>
            {\`
              @font-face { font-family: "Sweet Sans Pro"; src: url("/CasaConcreto/sweet/SweetSansProRegular.otf") format("opentype"); font-weight: normal; font-style: normal; }
              @font-face { font-family: "Sweet Sans Pro"; src: url("/CasaConcreto/sweet/SweetSansProBold.otf") format("opentype"); font-weight: bold; font-style: normal; }
              @font-face { font-family: "Sweet Sans Pro"; src: url("/CasaConcreto/sweet/SweetSansProItalic.otf") format("opentype"); font-weight: normal; font-style: italic; }
            \`}
          </style>
  `.trim();

  // Inject styles inside return block
  content = content.replace(
    '          <div className="select-none font-sans" style={{ backgroundColor: bgMain, color: textMed, lineHeight: 1.3 }}>',
    '          <div className="select-none font-sans" style={{ backgroundColor: bgMain, color: textMed, lineHeight: 1.3, fontFamily: "\\\'Sweet Sans Pro\\\', sans-serif" }}>\n            ' + fontStyle
  );

  // Logo gap
  content = content.replace("paddingRight: '35pt'", "paddingRight: '15pt'");

  // Split content below header
  const parts = content.split("              <div style={{ paddingLeft: '35pt', paddingRight: '35pt' }}>");
  let header = parts[0];
  let rest = parts.slice(1).join("              <div style={{ paddingLeft: '35pt', paddingRight: '35pt' }}>");

  // Reduce padding below header
  rest = "              <div style={{ paddingLeft: '20pt', paddingRight: '20pt' }}>" + rest;
  rest = rest.replace(/paddingLeft: '35pt', paddingRight: '35pt'/g, "paddingLeft: '20pt', paddingRight: '20pt'");

  // Reduce fonts in rest by ~15-20%
  rest = rest.replace(/fontSize: '([\d\.]+)pt'/g, (match, p1) => {
    let size = parseFloat(p1);
    size = Math.round(size * 0.8 * 10) / 10; // Reduce by 20%
    return "fontSize: '" + size + "pt'";
  });

  fs.writeFileSync('components/dashboard/modals/PDFPreviewModal.tsx', header + rest);
  console.log('HTML preview updated');
}

processPDFLayout();
processHTMLPreview();
