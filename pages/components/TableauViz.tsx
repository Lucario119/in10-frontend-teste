import Script from 'next/script';
import React, { useEffect, useRef, useState } from 'react';

const TableauEmbedViz: React.FC = () => {
  const [tableauViz, setTableauViz] = useState<any>(null);
  const [isVizLoading, setIsVizLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<{ pdf: boolean; csv: boolean }>({ pdf: false, csv: false });
  const vizRef = useRef<any>(null);

  useEffect(() => {
    const initializeTableau = () => {
      const vizElement = vizRef.current;
      if (vizElement) {
        setTableauViz(vizElement);

        vizElement.addEventListener("firstinteractive", () => {
      
          setIsVizLoading(false);
        });

        vizElement.addEventListener("vizloaderror", (error: any) => {
          console.error('Viz Load Error:', error);
          setIsVizLoading(false);
        });
      }
    };

    initializeTableau();
  }, []);

  const exportToPDF = async () => {
    if (!tableauViz) return;

    setIsExporting((prevState) => ({ ...prevState, pdf: true }));

    const publishedSheetsInfo = tableauViz.workbook.publishedSheetsInfo;
    const selectedWorkbookSheetsForExport = Array.from(publishedSheetsInfo, (publishedSheetInfo: any) => publishedSheetInfo.name);
    const exportPDFOptions = {
      scaling: 'automatic',
      pageSize: 'letter',
      orientation: 'portrait',
    };

    tableauViz.exportPDFAsync(selectedWorkbookSheetsForExport, exportPDFOptions).then(() => {
   
      setIsExporting((prevState) => ({ ...prevState, pdf: false }));
    }).catch(() => {
      setIsExporting((prevState) => ({ ...prevState, pdf: false }));
    });
  };

  const exportToCSV = async () => {
    if (!tableauViz) return;

    setIsExporting((prevState) => ({ ...prevState, csv: true }));

    const activeSheet = tableauViz.workbook.activeSheet;
    const worksheets = activeSheet.worksheets;
    const attritionDetailWorksheet = worksheets.find((item: any) => item.name === 'Attrition Detail');

    if (!attritionDetailWorksheet) return;

    tableauViz.exportCrosstabAsync(attritionDetailWorksheet.name, 'csv').then(() => {
      setIsExporting((prevState) => ({ ...prevState, csv: false }));
    }).catch(() => {
      setIsExporting((prevState) => ({ ...prevState, csv: false }));
    });
  };

  return (
    <>
      <Script
        src="https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js"
        strategy="afterInteractive"
        type='module'
        onLoad={() => {
          const event = new Event('tableauScriptLoaded');
          window.dispatchEvent(event);
        }}
      />
      <tableau-viz
        ref={vizRef}
        src="https://public.tableau.com/views/HRAttritionDashboardRWFD_16570446563570/viz?:language=pt-BR&:sid=&:display_count=n&:origin=viz_share_link"
        device="desktop"
        hide-tabs
        toolbar="bottom"
        className="w-full h-[600px]"
      ></tableau-viz>
      {!isVizLoading && (
        <div className="mt-4 flex justify-end">
          <button
            id="exportPDF"
            onClick={exportToPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
            disabled={isExporting.pdf}
          >
            {isExporting.pdf ? 'Exporting PDF...' : 'Exportar PDF'}
          </button>
          <button
            id="exportCSV"
            onClick={exportToCSV}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={isExporting.csv}
          >
            {isExporting.csv ? 'Exporting CSV...' : 'Exportar CSV'}
          </button>
        </div>
      )}
    </>
  );
};

export default TableauEmbedViz;
