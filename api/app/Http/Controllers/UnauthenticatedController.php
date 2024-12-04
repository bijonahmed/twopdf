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
use App\Models\TorrentsTutorial;
use App\Models\UserRequestCount;
use Illuminate\Support\Str;
use App\Rules\MatchOldPassword;
use Illuminate\Support\Facades\Hash;
use DB;
use File;
use Dompdf\Dompdf;
use Dompdf\Options;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Smalot\PdfParser\Parser;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use Carbon\Carbon;
use PDO;
use Spatie\PdfToImage\Pdf;
use setasign\Fpdi\Tcpdf\Fpdi;
use PhpOffice\PhpPresentation\PhpPresentation;
use PhpOffice\PhpPresentation\Style\Alignment;
use PhpOffice\PhpPresentation\Slide\Background\Image as BackgroundImage;
use PhpOffice\PhpPresentation\Shape\TextBox;
use PhpOffice\PhpPresentation\Shape\RichText;
use PhpOffice\PhpPresentation\Style\Fill;
use PhpOffice\PhpPresentation\Style\Color;
use PhpOffice\PhpPresentation\Style\Font;
use Illuminate\Support\Facades\Storage;

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

        // Get the uploaded PDF file
        $file = $request->file('file');
        $pdfPath = $file->getPathname();

        try {
            // Parse the PDF and extract text
            $pdfParser = new Parser();
            $pdf = $pdfParser->parseFile($pdfPath);
            $pages = $pdf->getPages();

            // Create a new PowerPoint presentation
            $presentation = new PhpPresentation();

            // Ensure that if the PDF contains no pages, we handle it gracefully
            if (empty($pages)) {
                return response()->json(['error' => 'PDF contains no pages'], 500);
            }

            // Loop through each page in the PDF and create a corresponding slide
            foreach ($pages as $pageNumber => $page) {
                $pageText = $page->getText();
                $slide = $presentation->createSlide();

                // Create a RichText shape to hold the text
                $richText = $slide->createRichTextShape();
                $richText->setWidth(600);
                $richText->setHeight(400);

                // If no text was extracted from the page, add a fallback message
                if (empty($pageText)) {
                    $pageText = "No content available for this slide.";
                }

                // Add text to the RichText shape
                $textRun = $richText->createTextRun($pageText);
                $textRun->getFont()->setSize(12);  // Set font size
                $textRun->getFont()->setName('Arial');  // Set font name


                // Optional: Add background color to the text box
                $richText->getFill()->setFillType(Fill::FILL_SOLID);
                $richText->getFill()->setStartColor(new \PhpOffice\PhpPresentation\Style\Color('FFFFFF')); // White background

            }

            // Remove the first slide if it exists
            $slides = $presentation->getSlide();  // Get the slides collection
            if ($slides) {
                $presentation->removeSlideByIndex(0);  // Remove the first slide (index 0)
            }

            // Save the PPTX file
            $pptxFilePath = storage_path('app/temp/converted_ppt.pptx');
            $writer = \PhpOffice\PhpPresentation\IOFactory::createWriter($presentation, 'PowerPoint2007');
            $writer->save($pptxFilePath);

            // Return the PPTX file for download
            return response()->download($pptxFilePath)->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            // Handle errors
            return response()->json(['error' => 'Error during conversion. Please try again.'], 500);
        }
    }
}
