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

    private function fetchHtmlData($slug)
    {


        $category = Category::where('slug', $slug)->where('status', 1)->firstOrFail();
        $qAndA = InveterviewQandA::where('category_id', $category->id)->where('status', 1)->get();

        // Prepare data for HTML table with watermark
        $html = '<html>';
        $html .= '<head>';
        $html .= '<style>';
        $html .= '.watermark {
        position: fixed;
        top: 45%;
        left: 60%;
        position: fixed;
        top: 50%;
        left: 60%;
        transform: translate(-50%, -50%) rotate(-45deg);
        font-size: 38px;
        color: rgba(0, 0, 0, 0.2);
        z-index: -1;
        text-align: center; 
    }';
        $html .= 'table {
        width: 100%;
        border-collapse: collapse;
    }';
        $html .= 'th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }';
        $html .= '@page {
        margin: 100px 25px;
    }';
        $html .= 'header {
        position: fixed;
        top: -60px;
        left: 0px;
        right: 0px;
        height: 50px;
        background-color: #f2f2f2;
        text-align: center;
         
    }';
        $html .= 'footer {
        position: fixed;
        bottom: -60px;
        left: 0px;
        right: 0px;
        height: 50px;
        background-color: #f2f2f2;
        text-align: center;
        line-height: 35px;
    }';
        $html .= 'body {
        font-family: Arial, sans-serif;
    }';
        $html .= 'table, th, td {
        border: 1px solid #CCCCCC;
        border-collapse: collapse;
        padding: 8px;
    }';
        $html .= 'th {
        background-color: #f2f2f2;
    }';
        $html .= 'td.question {
        background-color: #e0e0e0;
    }';
        $html .= '</style>';
        $html .= '</head>';
        $html .= '<body>';

        $categoryDesc = !empty($category->description) ? $category->description : "";
        $html .= '<header>'.$categoryDesc.'</header>';
        $html .= '<footer>Provided by <a href="https://w3programmer.net" target="_blank">w3programmer.net</a></footer>';
        // Watermark overlay
        $html .= '<div class="watermark">w3programmer.net</div>';

        // Table with interview questions and answers
        $html .= '<table style="font-size: 13px;">';
        $html .= '<thead>';
        $html .= '<tr>';
        $html .= '<th>SL</th>';
        $html .= '<th>Question</th>';
        $html .= '<th>Answer</th>';
        $html .= '</tr>';
        $html .= '</thead>';
        $html .= '<tbody>';

        foreach ($qAndA as $index => $qa) {
            $html .= '<tr>';
            $html .= '<td>' . ($index + 1) . '</td>';
            $html .= '<td class="question">Q. ' . $qa->question . '</td>';
            $html .= '<td style="text-align:justify">A. ' . $qa->answer . '</td>';
            $html .= '</tr>';
        }

        $html .= '</tbody>';
        $html .= '</table>';
        $html .= '</body>';
        $html .= '</html>';

        return $html;

    }


    public function getTorrentTutorial(Request $request){
        //============================================= Pagination ========================================
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 30);
        // Get search query from the request
        $searchQuery = $request->searchQuery;
        
        // Start building the query
        $query = TorrentsTutorial::where('status', 1);
        
        if ($searchQuery !== null) {
            $query->where('torrenttutorial.name', 'like', '%' . $searchQuery . '%');
        }
        
        // Apply pagination to the query
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        
        // Modify the collection
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id'            => $item->id,
                'name'          => $item->name,
                'site_name'     => $item->site_name,
                'download_link' => $item->download_link,
                'description'   => strip_tags($item->description),
                'thumnail_img'  =>  !empty($item->thumnail_img) ? url($item->thumnail_img) : "", //$item->thumnail_img,
                
            ];
        });


        $data = [
            'data'          => $modifiedCollection,
            'pagination' => [
            'total' => $paginator->total(),
            'per_page' => $paginator->perPage(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ],
        ];
        return response()->json($data, 200);




    }



    public function getTechnology(Request $request)
    {

        $slug       = !empty($request->slug) ? $request->slug : ""; 
        $category   = Category::where('slug', $slug)->where('status', 1)->firstOrFail();
        $qAndA      = InveterviewQandA::where('category_id', $category->id)->where('status', 1)->get();

        $firstArray     = Category::where('parent_id', $category->id)->where('status', 1)->pluck('id')->toArray();
        $secondArray    = Category::where('status', 1)->pluck('id')->toArray();

        //============================================= Pagination ========================================
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);
        // Get search query from the request
        $searchQuery = $request->searchQuery;
        
        // Start building the query
        $query = InveterviewQandA::where('category_id', $category->id)->where('status', 1);
        
        if ($searchQuery !== null) {
            $query->where('interview_questions.question', 'like', '%' . $searchQuery . '%');
        }
        
        // Apply pagination to the query
        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);
        
        // Modify the collection
        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id' => $item->id,
                'language' => $item->language,
                'question' => $item->question,
                'answer' => $item->answer,
                'category_id' => $item->category_id,
            ];
        });

     
        $filteredCategories = Category::whereNotIn('id', $firstArray)
            ->select('id','name','slug')
            ->whereIn('id', $secondArray)
            ->limit(50)
            ->where('parent_id', '!=', 0)  // Adding the condition here
            ->get();

        $data = [
            'cateName' => !empty($category->name) ? $category->name : "",
            'tags'     => $filteredCategories,
            //Pagination
            'data'          => $modifiedCollection,
                'pagination' => [
            'total' => $paginator->total(),
            'per_page' => $paginator->perPage(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ],
        ];
        return response()->json($data, 200);




    }

    public function getAllChildCaegorys()
    {
        $rows = Category::where('status', 1)->where('parent_id', '!=', 0)->get();

        $result = $rows->map(function ($category) {
            return [
                'id'       => $category->id,
                'name'     => $category->name,
                'file'     => !empty($category->file) ? url($category->file) : "",
                'slug'     => $category->slug,
            ];
        });
        $data['result']         = $result;
        return response()->json($data, 200);
    }


    public function countPerDayValidation(Request $request)
    {
      //RequestValidation
      $ip = $request->ip(); // Get the IP address of the request
      $today = Carbon::today(); // Get the current date
      // Count the number of requests from the specific IP address today
      $requestCount = UserRequestCount::where('ip', $ip)
          ->whereDate('created_at', $today)
          ->count();

      if ($requestCount < 10) {
          // Insert the request since the limit has not been reached
          UserRequestCount::create([
              'name' => 'anonymous', // Assuming 'name' is coming from the request
              'ip'   => $ip,
          ]);

          return response()->json(['message' => 'Request validated and inserted successfully.', 'responseStatus' => 1]);
      } else {
          // Reject the request since the limit has been reached
          return response()->json([
          'message' => 'Daily request limit reached.', 
          'responseStatus'  => 0]);
      }
       
    }








    public function getChildDataParentWise($slug)
    {

        $rowCheck = Category::where('status', 1)->where('slug', $slug)->first();
        if (!$rowCheck) {
            return response()->json(['error' => 'Category not found'], 404);
        }
        $categories = Category::where('parent_id', $rowCheck->id)->where('status', 1)->get();
        $result = $categories->map(function ($category) {
            return [
                'id'       => $category->id,
                'name'     => $category->name,
                'file'     => !empty($category->file) ? url($category->file) : "",
                'slug'     => $category->slug,
            ];
        });

        $firstArray     = Category::where('parent_id', $rowCheck->id)->where('status', 1)->pluck('id')->toArray();
        $secondArray    = Category::where('status', 1)->pluck('id')->toArray();

        // Initialize the filtered result array
        $filteredResult = [];
        $filteredResult = array_diff($secondArray, $firstArray);

        $filteredCategories = Category::whereNotIn('id', $firstArray)
            ->whereIn('id', $secondArray)
            ->where('parent_id', '!=', 0)  // Adding the condition here
            ->get();
        $othersCategory = $filteredCategories->map(function ($category) {
            return [
                'id'       => $category->id,
                'name'     => $category->name,
                'file'     => !empty($category->file) ? url($category->file) : "",
                'slug'     => $category->slug,
            ];
        });

        $data['result']         = $result;
        $data['name']           = !empty($rowCheck->name) ? $rowCheck->name : "";
        $data['othersCategory'] = $othersCategory;

        return response()->json($data, 200);
    }
    public function childCategory()
    {
        $order = [60, 58, 57, 39, 59, 188];

        // Fetch categories and sort them based on the defined order
        $rows = Category::where('status', 1)
            ->where('parent_id', '!=', 0)
            ->whereIn('id', $order)
            ->orderBy(DB::raw('FIELD(id, ' . implode(',', $order) . ')'))
            ->get();

        $result = $rows->map(function ($category) {
            return [
                'id'       => $category->id,
                'name'     => $category->name,
                'thumnail' => !empty($category->file) ? url($category->file) : "",
                'slug'     => $category->slug,
            ];
        });
        $data['result']         = $result;
        return response()->json($data, 200);
    }

    public function parentChildCategory()
    {

        $categories = Category::with('children')->where('parent_id', 0)->where('status', 1)->get();
        return response()->json($categories);
    }

    public function allCategory(Request $request)
    {
        $categories = Categorys::with('children.children.children.children.children')->where('status', 1)->where('parent_id', 0)->get();
        $result = [];
        foreach ($categories as $v) {
            $result[] = [
                'id'            => $v->id,
                'name'          => $v->name,
                'thumnail'      => !empty($v->file) ? url($v->file) : "",
                'slug'          => $v->slug,

            ];
        }
        return response()->json($result, 200);
    }

    public function generateUniqueRandomNumber()
    {
        $numbers = [];

        while (count($numbers) < 4) {
            $randomNumber = rand(1000, 9999);
            if (!in_array($randomNumber, $numbers)) {
                $numbers[] = $randomNumber;
            }
        }

        return $numbers[0]; // Since we're generating only one number, return the first (and only) element of the array
    }
}
