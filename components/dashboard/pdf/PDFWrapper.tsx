import React from 'react';
import { Font, Document, Page } from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';

import ModernLayout from './layouts/ModernLayout';
import ClassicLayout from './layouts/ClassicLayout';
import SignatureLayout from './layouts/SignatureLayout';
import EliteLayout from './layouts/EliteLayout';
import CasaConcretoLayout from './layouts/CasaConcretoLayout';

// Initialize a base Tailwind instance
export const tw = createTw({
  theme: {
    extend: {
      colors: {
        primary: "#ea580c",
      },
    },
  },
});

interface PDFWrapperProps {
  data: any;
  settings: any;
}

const PDFWrapper = ({ data, settings }: PDFWrapperProps) => {
  const layout = settings?.pdf?.layout || settings?.pdfConfig?.layout || 'Modern';
  const accentColor = settings?.pdf?.color || settings?.pdfConfig?.color || '#ea580c';

  // Memoize the customized tailwind instance
  const dynamicTw = React.useMemo(() => createTw({
    theme: {
      extend: {
        colors: {
          brand: accentColor,
        },
      },
    },
  }), [accentColor]);

  const reference = data?.bookingId || data?.reference || (data?.type || 'DOC').toUpperCase();
  const docTitle = `${reference} - ${(data?.clientName || 'GUEST').toUpperCase()}`;

  // CasaConcreto manages its own <Page> components internally (multi-page layout)
  if (layout === 'CasaConcreto') {
    return (
      <Document title={docTitle}>
        <CasaConcretoLayout data={data} settings={settings} tw={dynamicTw} />
      </Document>
    );
  }

  const renderLayout = () => {
    const props = { data, settings, tw: dynamicTw };
    switch (layout) {
      case 'Classic':
        return <ClassicLayout {...props} />;
      case 'Signature':
        return <SignatureLayout {...props} />;
      case 'Elite':
        return <EliteLayout {...props} />;
      case 'Modern':
      default:
        return <ModernLayout {...props} />;
    }
  };

  return (
    <Document title={docTitle}>
      <Page size="A4" style={{ padding: 0 }}>
        {renderLayout()}
      </Page>
    </Document>
  );
};

export default PDFWrapper;
