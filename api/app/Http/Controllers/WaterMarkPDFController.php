<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Helper;
use Dompdf\Dompdf;
use DB;
use File;
use Dompdf\Options;
use Barryvdh\DomPDF\Facade as PDF;
use setasign\Fpdi\Fpdi;
use FPDF;
use TCPDF;
use PDO;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpWord\Writer\PDF\DomPDF as PDFDomPDF;
use Barryvdh\DomPDF\Facade as PDFWaterMark;
use Barryvdh\DomPDF\PDF as DomPDFPDF;
use App\Services\CustomFPDF;  // Import the CustomFPDF class
use Illuminate\Support\Facades\Storage;

class WaterMarkPDFController extends Controller
{
    protected $frontend_url;
    protected $userid;



    // Add Watermark Function

    public function addWatermark(Request $request)
    {
        try {
            // Validate uploaded files, watermark text, and positions
            $request->validate([
                'files.*'               => 'required|mimes:pdf',
                'watermark_text.*'      => 'required|min:1',
                'watermarkOpacity.*'    => 'required',
                'watermarkFontSize.*'   => 'required',
                'watermark_position.*'  => 'required|in:top-left,top-right,bottom-left,bottom-right,center',
            ], [
                'files.*.required'              => 'A PDF file is required.',
                'files.*.mimes'                 => 'The file must be a PDF.',
                'watermark_text.*.required'     => 'Watermark text is required.',
                'watermark_text.*.min'          => 'Watermark text must be at least 1 character.',
                'watermarkOpacity.*.required'   => 'Watermark opacity is required.',
                'watermarkFontSize.*.required'  => 'Watermark font size is required.',
                'watermark_position.*.required' => 'Watermark position is required.',
                'watermark_position.*.in'       => 'The watermark position must be one of the following: top-left, top-right, bottom-left, bottom-right, center.',
            ]);
            // Get uploaded files, watermark texts, and positions
            $files                  = $request->file('files');
            $watermarkTexts         = $request->input('watermark_text');
            $watermarkPositions     = $request->input('watermark_position');
            $watermarkFontSize      = $request->input('watermarkFontSize') ?? 10;
            $watermarkOpacity       = $request->input('watermarkOpacity') ?? 0.2;

            //$watermarkedFilePaths = [];

            $watermarkedFilePaths = [];

            foreach ($files as $index => $file) {
                // Store the uploaded file temporarily
                $tempPath = $file->store('public/temp_pdfs');
                $fullPath = storage_path('app/' . $tempPath);

                // Initialize FPDI object
                $pdf = new PDF_Rotate();
                $pageCount = $pdf->setSourceFile($fullPath);

                // Process each page
                for ($pageNo = 1; $pageNo <= $pageCount; $pageNo++) {
                    $pdf->AddPage();
                    $tplIdx = $pdf->importPage($pageNo);
                    $pdf->useTemplate($tplIdx);
                    // Get watermark text and position
                    $watermarkText = $watermarkTexts[$index];
                    $position = $watermarkPositions[$index];
                    // Calculate position
                    list($x, $y) = $this->getWatermarkPosition($position, $pdf, $watermarkText);
                    // Add rotated watermark text with transparency effect
                    $this->AddRotatedText($pdf, $x, $y, $watermarkText, 45, $watermarkFontSize, $watermarkOpacity);
                }

                // Define new file path only if everything is successful
                $newFileName = 'watermarked_' . time() . '.pdf';
                $newFilePath = storage_path('app/public/pdfs/' . $newFileName);

                $pdf->Output($newFilePath, 'F'); // Save the watermarked file

                // Store the new file path for response
                $watermarkedFilePaths[] = 'pdfs/' . $newFileName;

                // Delete temporary file after processing
                Storage::delete($tempPath);
            }

            return response()->json([
                'download_link' => asset('storage/' . $watermarkedFilePaths[0])
            ]);
        } catch (\Exception $e) {
            // Catch any errors and return them in the response
            return response()->json([
                'error' => 'An error occurred while processing the file.',
                'message' => $e->getMessage(),
                'customMsg' => "It seems that your PDF file is not compatible with our system due to certain compression techniques. 
                 Please check if the file is in a supported format or try uploading a different one.",
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }



    // Calculate watermark position
    private function getWatermarkPosition($position, $pdf, $text = '')
    {
        $pageWidth = $pdf->GetPageWidth();
        $pageHeight = $pdf->GetPageHeight();
        // Set font for text width calculation
        $fontSize = 10;
        $pdf->SetFont('Arial', 'B', $fontSize);
        $textWidth = $pdf->GetStringWidth($text);
        $textHeight = $fontSize / 2;

        switch ($position) {
            case 'top-left':
                return [20, 30];
            case 'top-right':
                return [$pageWidth - $textWidth - 20, 30];
            case 'center':
                return [($pageWidth - $textWidth) / 2, ($pageHeight - $textHeight) / 2];
            case 'bottom-left':
                return [20, $pageHeight - 30];
            case 'bottom-right':
                return [$pageWidth - $textWidth - 20, $pageHeight - 30];
            default:
                return [20, 30];
        }
    }

    // Add rotated text for watermark
    private function AddRotatedText($pdf, $x, $y, $txt, $angle, $watermarkFontSize, $opacity = 1.0)
    {
        $opacity = (float)max(0, min(1, $opacity)); // Ensure opacity is a float
        $colorValue = (int)(255 * (1 - $opacity)); // Lower opacity = lighter color
        $pdf->SetFont('Arial', 'B', $watermarkFontSize);
        $pdf->SetTextColor($colorValue, $colorValue, $colorValue); // Light gray to black based on opacity
        // Rotate the text
        // $pdf->Rotate($angle, $x, $y);
        // Add the text to the PDF at the specified position
        $pdf->Text($x, $y, $txt);
        // Reset rotation
        $pdf->Rotate(0);
    }
}

// Custom FPDI class with rotation support
class PDF_Rotate extends FPDI
{
    var $angle = 0;

    function Rotate($angle, $x = -1, $y = -1)
    {
        if ($x == -1) {
            $x = $this->GetX();
        }
        if ($y == -1) {
            $y = $this->GetY();
        }
        if ($this->angle != 0) {
            $this->_out('Q');
        }
        $this->angle = $angle;
        if ($angle != 0) {
            $angle *= M_PI / 180;
            $c = cos($angle);
            $s = sin($angle);
            $cx = $x * $this->k;
            $cy = ($this->h - $y) * $this->k;
            $this->_out(sprintf(
                'q %.2F %.2F %.2F %.2F %.2F %.2F cm 1 0 0 1 %.2F %.2F cm',
                $c,
                $s,
                -$s,
                $c,
                $cx,
                $cy,
                -$cx,
                -$cy
            ));
        }
    }

    function _endpage()
    {
        if ($this->angle != 0) {
            $this->angle = 0;
            $this->_out('Q');
        }
        parent::_endpage();
    }
}
