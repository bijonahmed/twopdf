<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Mpdf\Mpdf;

class ExcelPDFController extends Controller
{
    public function uploadExcel(Request $request)
    {
        // Validate file
        $request->validate([
            'file' => 'required|mimes:xlsx,xls'
        ]);

        // Store uploaded Excel file
        $file = $request->file('file');
        $filePath = $file->storeAs('uploads', uniqid() . '.' . $file->getClientOriginalExtension(), 'public');
        $storagePath = storage_path("app/public/{$filePath}");

        try {
            // Load Excel file
            $spreadsheet = IOFactory::load($storagePath);
            $sheets = $spreadsheet->getAllSheets();

            // Initialize PDF
            $mpdf = new Mpdf();
            $mpdf->SetAutoPageBreak(true, 10);

            foreach ($sheets as $sheetIndex => $sheet) {
                // Convert sheet to styled HTML
                $htmlContent = $this->convertSheetToStyledHtml($sheet);

                // Break the HTML content into smaller chunks if it's too large
                $this->addChunksToPDF($mpdf, $htmlContent, $sheetIndex);
            }

            // Define PDF file path
            $pdfFileName = 'excel_export_' . uniqid() . '.pdf';
            $pdfFilePath = storage_path("app/public/uploads/{$pdfFileName}");

            // Save PDF
            $mpdf->Output($pdfFilePath, 'F');

            // Delete the original Excel file
            Storage::delete("public/{$filePath}");

            return response()->json([
                'message' => 'Excel converted to PDF successfully with styles!',
                'file_path' => "uploads/{$pdfFileName}"
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to convert Excel to PDF: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Convert a single sheet to HTML with styles (Supports bold, italic, underline, and text alignment)
     */
    private function convertSheetToStyledHtml($sheet)
    {
        $htmlContent = '<h2 style="text-align:center; margin-bottom: 10px;">' . htmlspecialchars($sheet->getTitle()) . '</h2>';
        $htmlContent .= '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">';

        foreach ($sheet->getRowIterator() as $row) {
            $htmlContent .= '<tr>';
            foreach ($row->getCellIterator() as $cell) {
                $cellValue = htmlspecialchars($cell->getFormattedValue());

                // Get background color
                $bgColor = $cell->getStyle()->getFill()->getStartColor()->getARGB();
                $bgColor = ($bgColor == 'FFFFFFFF' || $bgColor == '') ? '#ffffff' : '#' . substr($bgColor, 2);

                // Get text color
                $textColor = $cell->getStyle()->getFont()->getColor()->getARGB();
                $textColor = ($textColor == 'FF000000' || $textColor == '') ? '#000000' : '#' . substr($textColor, 2);

                // Get bold style
                $bold = $cell->getStyle()->getFont()->getBold() ? 'font-weight: bold;' : '';

                // Get italic style
                $italic = $cell->getStyle()->getFont()->getItalic() ? 'font-style: italic;' : '';

                // Get underline style
                $underline = $cell->getStyle()->getFont()->getUnderline() != 'none' ? 'text-decoration: underline;' : '';

                // Get text alignment
                $align = $cell->getStyle()->getAlignment()->getHorizontal();
                $textAlign = $this->getAlignmentCSS($align);

                // Apply styles
                $htmlContent .= "<td style='background-color: {$bgColor}; color: {$textColor}; {$bold} {$italic} {$underline} text-align: {$textAlign}; padding: 5px; border: 1px solid black;'>{$cellValue}</td>";
            }
            $htmlContent .= '</tr>';
        }

        $htmlContent .= '</table>';
        return $htmlContent;
    }

    /**
     * Convert alignment code to CSS format
     */
    private function getAlignmentCSS($align)
    {
        switch ($align) {
            case 'CENTER':
                return 'center';
            case 'RIGHT':
                return 'right';
            case 'LEFT':
            default:
                return 'left';
        }
    }

    /**
     * Break large HTML content into smaller chunks and add them to the PDF
     */
    private function addChunksToPDF($mpdf, $htmlContent, $sheetIndex)
    {
        $chunkSize = 5000; // Define chunk size (in characters)

        // Split the HTML content into smaller chunks
        $chunks = str_split($htmlContent, $chunkSize);

        // Add the first chunk to the PDF
        if ($sheetIndex > 0) {
            $mpdf->AddPage(); // New page for each sheet
        }

        foreach ($chunks as $chunk) {
            $mpdf->WriteHTML($chunk);
        }
    }
}
