<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Helper;
use App\Models\Product;
use App\Models\Sliders;
use App\Models\RequestValidation;
use App\Models\Categorys;
use App\Models\InveterviewQandA;
use App\Models\Post;
use App\Models\VerifyEmail;
use App\Models\Setting;
use App\Models\ProductAdditionalImg;
use App\Models\SeoData;
use App\Models\TorrentsTutorial;
use App\Models\UserRequestCount;
use Illuminate\Support\Str;
use App\Rules\MatchOldPassword;
use Illuminate\Support\Facades\Hash;
use DB;
use File;
use Dompdf\Dompdf;
use Dompdf\Options;
use Barryvdh\DomPDF\Facade as PDFWaterMark;
use Barryvdh\DomPDF\PDF as DomPDFPDF;
use TCPDF;
use setasign\Fpdi\TcpdfFpdi;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Smalot\PdfParser\Parser;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PDFPasswordProtect;
use Carbon\Carbon;
use PDO;
use Spatie\PdfToImage\Pdf;
use setasign\Fpdi\Tcpdf\Fpdi;
use setasign\Fpdi\PdfReader;
use setasign\Fpdi\PdfParser\StreamReader;
use PhpOffice\PhpPresentation\PhpPresentation;
use PhpOffice\PhpPresentation\Style\Alignment;
use PhpOffice\PhpPresentation\Slide\Background\Image as BackgroundImage;
use PhpOffice\PhpPresentation\Shape\TextBox;
use PhpOffice\PhpPresentation\Shape\RichText;
use PhpOffice\PhpPresentation\Style\Fill;
use PhpOffice\PhpPresentation\Style\Color;
use PhpOffice\PhpPresentation\Style\Font;
use Illuminate\Support\Facades\Storage;
use Mpdf\Mpdf;
use Mpdf\Output\Destination;
use Owenoj\PDFPasswordProtect\Facade\PDFPasswordProtect as FacadePDFPasswordProtect;
use Owenoj\PDFPasswordProtect\PDFPasswordProtect as PDFPasswordProtectPDFPasswordProtect;
use Owenoj\PDFPasswordProtect\PDFPasswordProtectServiceProvider;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpWord\Writer\PDF\DomPDF as PDFDomPDF;

class UnauthenticatedController extends Controller
{
    protected $frontend_url;
    protected $userid;

    public function generatePDF(Request $request, $slug)
    {
        // Fetch HTML data for PDF generation
        $html = $this->fetchHtmlData($slug);

        // Generate PDF using dompdf
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true); // Enable HTML5 parsing
        $options->set('isPhpEnabled', true); // Enable embedded PHP code

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait'); // Paper size and orientation

        // Render the HTML as PDF
        $dompdf->render();

        // Output the generated PDF (inline or attachment)
        $output = $dompdf->output();

        // Example of sending the PDF as a response with headers
        return response($output, 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="interview_qa.pdf"');
    }

    //============================================================== Check Split PDF and Insert ===============================================================
    public function countPerDayValidationSplit(Request $request)
    {
        /*
        $limit        = Setting::where('id', 1)->first();
        $dailyLimit   = !empty($limit->pdf_daily_limit) ? $limit->pdf_daily_limit : 0;
        $ip           = $request->ip();
        $today        = Carbon::today();
        $requestCount = UserRequestCount::where('ip', $ip)->where('pdf_type', 'PDF_Split')->whereDate('created_at', $today)->count();
        if ($requestCount < $dailyLimit) {
            return response()->json(['message' => 'Request validated and inserted successfully.', 'responseStatus' => 1]);
        } else {
            return response()->json([
                'message' => 'Daily request limit reached.',
                'responseStatus'  => 0
            ]);
        }
        */
    }
    public function insertSplitData(Request $request)
    {
        $limit        = Setting::where('id', 1)->first();
        $dailyLimit   = !empty($limit->pdf_daily_limit) ? $limit->pdf_daily_limit : 0;
        $ip           = $request->ip();
        $today        = Carbon::today();
        $requestCount = UserRequestCount::where('ip', $ip)->where('pdf_type', 'PDF_Split')->whereDate('created_at', $today)->count();

        if ($requestCount < $dailyLimit) {
            $data['pdf_type'] = 'PDF_Split';
            $data['name']     = 'anonymous';
            $data['ip']       = $ip;
            UserRequestCount::create($data);
            return response()->json(['message' => 'Request validated and inserted successfully.', 'responseStatus' => 1]);
        } else {
            return response()->json([
                'message' => 'Daily request limit reached.',
                'responseStatus'  => 0
            ]);
        }
    }

    //============================================================== END Split PDF and Insert ===============================================================
    //============================================================== Check Merge PDF and Insert ===============================================================
    public function countPerDayValidation(Request $request)
    {
        /*
        $limit        = Setting::where('id', 1)->first();
        $dailyLimit   = !empty($limit->pdf_daily_limit) ? $limit->pdf_daily_limit : 0;
        $ip    = $request->ip();
        $today = Carbon::today();
        $requestCount = UserRequestCount::where('ip', $ip)->where('pdf_type', 'PDF_Merge')->whereDate('created_at', $today)->count();

        if ($requestCount < $dailyLimit) {
            UserRequestCount::create([
                'pdf_type' => 'PDF_Merge',
                'name'     => 'anonymous',
                'ip'       => $ip,
            ]);

            return response()->json(['message' => 'Request validated and inserted successfully.', 'responseStatus' => 1]);
        } else {
            return response()->json([
                'message' => 'Daily request limit reached.',
                'responseStatus'  => 0
            ]);
        }
        */
    }

    //============================================================== END Merge PDF and Insert ===============================================================

    //Convert to word
    public function convertToWord(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:pdf|max:50000', // Ensure it's a PDF and not larger than 5MB
        ]);

        $file = $request->file('file');
        $pdfPath = $file->getPathname();
        try {

            $pdfParser = new Parser();
            $pdf = $pdfParser->parseFile($pdfPath);
            $pdfText = $pdf->getText();

            if (empty($pdfText)) {
                return response()->json(['error' => 'No text found in the PDF'], 500);
            }
            $txtPath = storage_path('app/public/converted_file.txt');
            file_put_contents($txtPath, $pdfText);
            if (!file_exists($txtPath)) {
                return response()->json(['error' => 'Failed to create text file'], 500);
            }
            return response()->download($txtPath, 'converted_file.txt', [
                'Content-Type' => 'text/plain'
            ])->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error during conversion. Please try again.'], 500);
        }
    }

    public function convertToPowerPoint(Request $request)
    {
        // Validate the uploaded file (PDF)
        $request->validate([
            'file' => 'required|mimes:pdf|max:50000',  // Max size 50 MB
        ]);

        try {
            // Store the uploaded file
            $file = $request->file('file');
            $pdfPath = $file->store('temp'); // Store file in Laravel storage

            // Ensure the file was stored successfully
            if (!$pdfPath) {
                return response()->json(['error' => 'File upload failed.'], 500);
            }

            // Parse the PDF and extract text
            $pdfParser = new Parser();
            $pdf = $pdfParser->parseFile(storage_path('app/' . $pdfPath));
            $pages = $pdf->getPages();

            if (empty($pages)) {
                return response()->json(['error' => 'PDF contains no pages'], 500);
            }

            // Create a new PowerPoint presentation
            $presentation = new PhpPresentation();

            // Loop through each page and create slides
            foreach ($pages as $index => $page) {

                $pageText = trim($page->getText()) ?: "No content available for this slide.";
                $slide = $presentation->createSlide();

                // Add text shape to the slide
                $richText = $slide->createRichTextShape();
                $richText->setWidth(600);
                $richText->setHeight(400);
                $textRun = $richText->createTextRun($pageText);
                $textRun->getFont()->setSize(12);
                $textRun->getFont()->setName('Arial');

                // Set background color
                // Dynamically set background color based on some logic (e.g., using PDF page text)
                $backgroundColor = 'FFFFFF';  // Default to white

                // Example: Check for certain words or patterns in the text to dynamically set color
                if (strpos(strtolower($pageText), 'important') !== false) {
                    $backgroundColor = 'FF0000';  // Red if the page contains the word "important"
                } elseif (strpos(strtolower($pageText), 'note') !== false) {
                    $backgroundColor = 'FFFF00';  // Yellow for pages containing the word "note"
                }

                // Set the slide background color dynamically
                $richText->getFill()->setFillType(Fill::FILL_SOLID);
                $richText->getFill()->setStartColor(new \PhpOffice\PhpPresentation\Style\Color($backgroundColor));
            }

            // Remove the first slide after all slides are created
            // After creating all slides, remove the first slide (index 0)
            if ($presentation->getSlideCount() > 0) {
                $presentation->removeSlideByIndex(0); // Removes the first slide
            }


            // Save the PPTX file
            $pptxFileName = 'converted_ppt_' . time() . '.pptx';
            $pptxFilePath = storage_path('app/temp/' . $pptxFileName);

            // Ensure the temp directory exists
            Storage::makeDirectory('temp');

            $writer = \PhpOffice\PhpPresentation\IOFactory::createWriter($presentation, 'PowerPoint2007');
            $writer->save($pptxFilePath);

            // Delete the uploaded PDF after processing
            Storage::delete($pdfPath);

            // Return the PPTX file for download
            return response()->download($pptxFilePath)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error during conversion: ' . $e->getMessage()], 500);
        }
    }



    public function generateProtectedPdf(Request $request)
    {

        // dd($request->content);

        $request->validate([
            'content' => 'nullable|string|min:5',
            'password' => 'required|string|min:6', // Ensure password is at least 6 characters
        ]);
        /*
        // Generate the PDF content using Dompdf
        $dompdf = new Dompdf();
        $dompdf->loadHtml('<h1>Hello, this is a password-protected PDF!</h1>');
        $dompdf->render();

        // Save the PDF to a temporary location
        $pdfContent = $dompdf->output();
        $tempFile = storage_path('app/temp.pdf');
        file_put_contents($tempFile, $pdfContent);

        // Encrypt the PDF with a password
        $protectedPdfPath = storage_path('app/protected_pdf.pdf');
        FacadePDFPasswordProtect::encrypt($tempFile, $protectedPdfPath, $request->password);
        // Delete the temporary file
        unlink($tempFile);

        // Return the encrypted PDF as a download
        return response()->download($protectedPdfPath)->deleteFileAfterSend(true);
        */
        // Initialize Dompdf
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $dompdf = new Dompdf($options);
        $content = $request->content;
        $formattedContent = "<p>" . implode("</p><p>", explode("\r\n", $content)) . "</p>";
        $dompdf->loadHtml($formattedContent);
        $dompdf->render();

        $tempDir = public_path('pdf_protected/app/');
        $protectedDir = public_path('pdf_protected/');

        // Ensure directories exist
        if (!file_exists($tempDir)) {
            mkdir($tempDir, 0777, true);
        }
        if (!file_exists($protectedDir)) {
            mkdir($protectedDir, 0777, true);
        }
        // Save the PDF to a temporary file
        $pdfContent = $dompdf->output();
        $tempFile = $tempDir . 'temp.pdf';
        file_put_contents($tempFile, $pdfContent);

        $protectedPdfPath = $protectedDir . 'protected_pdf.pdf';
        // Encrypt and save the PDF in the public folder
        FacadePDFPasswordProtect::encrypt($tempFile, $protectedPdfPath, $request->password);

        // Check if the file was saved correctly
        if (file_exists($protectedPdfPath)) {
            Log::info('Encrypted PDF saved successfully at: ' . $protectedPdfPath);
        } else {
            Log::error('Failed to save encrypted PDF.');
        }

        // Generate the direct URL for downloading the file
        $downloadLink = url('pdf_protected/protected_pdf.pdf'); // URL for frontend

        return response()->json([
            'message' => 'PDF generated successfully.',
            'download_link' => $downloadLink
        ]);
    }


    public function addWatermark(Request $request)
    {
        // Validate the request
        $request->validate([
            'files.*' => 'required|mimes:pdf|max:2048',  // Ensure each file is a valid PDF
            'watermark_text.*' => 'required|string|min:3' // Ensure each watermark text is a valid string and at least 3 characters
        ]);

        // Retrieve the uploaded files and watermark text
        $files = $request->file('files');  // Files array
        $watermarkTexts = $request->input('watermark_text');  // Watermark text array

        // Array to hold download links
        $downloadLinks = [];

        // Process each file
        foreach ($files as $index => $file) {
            $watermarkText = $watermarkTexts[$index] ?? '';  // Get watermark text for this file

            if (empty($watermarkText)) {
                return response()->json([
                    'error' => 'Missing watermark text for one of the files.'
                ], 400);
            }

            // Store the uploaded PDF temporarily
            $originalPath = $file->store('temp');
            $filePath = storage_path("app/{$originalPath}");

            // Load the PDF file using DOMPDF
            $pdf = PDF::loadFile($filePath);

            // Add watermark text using custom CSS (DOMPDF does not have direct watermark method)
            $htmlContent = $this->addWatermarkToHtml($filePath, $watermarkText);
            $pdf->loadHTML($htmlContent);

            // Save the watermarked PDF
            $newFileName = 'watermarked_' . time() . '_' . $index . '.pdf';
            $newFilePath = storage_path("app/public/{$newFileName}");
            $pdf->save($newFilePath);

            // Store the link to the watermarked PDF
            $downloadLinks[] = asset("storage/{$newFileName}");
        }

        // Return the download links for all processed files
        return response()->json([
            'download_links' => $downloadLinks
        ]);
    }

    private function addWatermarkToHtml($filePath, $watermarkText)
    {
        // Read the PDF content and generate the HTML
        // NOTE: You would need to convert the PDF to HTML (this is a simplified example)

        $html = '<html>
                    <body style="position: relative;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 50px; color: rgba(255,0,0,0.5); transform: rotate(-45deg);">
                            ' . $watermarkText . '
                        </div>
                    </body>
                </html>';

        return $html;
    }



    public function checkSeoContent(Request $request)
    {
        // dd($request->all());
        $slug            = !empty($request->slug) ? $request->slug : "";
        $response['seo'] = SeoData::where('slug', $slug)->where('status', 1)->first();
        return response()->json($response, 200);
    }
}
