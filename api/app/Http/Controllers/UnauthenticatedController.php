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
use Carbon\Carbon;
use PDO;
use PhpParser\Node\Stmt\TryCatch;
use function Ramsey\Uuid\v1;

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
}
