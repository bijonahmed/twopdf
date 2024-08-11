<?php

namespace App\Http\Controllers\Mining;

use Illuminate\Routing\Middleware\ThrottleRequests;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Helper;
use App\Models\User;
use App\Models\Categorys;
use App\Category;
use App\Models\AttributeValues;
use App\Models\Attribute;
use App\Models\Deposit;
use App\Models\MiningCategory;
use App\Models\MiningCategoryDuration;
use App\Models\MiningHistory;
use App\Models\MiningServicesBuyHistory;
use App\Models\Mystore;
use App\Models\PostCategory;
use App\Models\SubAttribute;
use App\Models\ProductAttributes;
use App\Models\ProductAttributeValue;
use App\Models\Product;
use App\Models\TransactionHistory;
use Illuminate\Support\Str;
use App\Rules\MatchOldPassword;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use DB;

class MiningController extends Controller
{
    protected $userid;
    public function __construct()
    {
        $this->middleware('auth:api');
        $id = auth('api')->user();
        if (!empty($id)) {
            $user = User::find($id->id);
            $this->userid = $user->id;
        }
    }

    public function minningDurationrow($id)
    {
        $responseData['data']  = MiningCategoryDuration::join('mining_categogy', 'mining_categogy_duration.mining_category_id', '=', 'mining_categogy.id')->orderBy('id', 'desc')
            ->select('mining_categogy_duration.*', 'mining_categogy.name')->where('mining_categogy_duration.id', $id)->first();
        return response()->json($responseData);
    }

    public function inserMiningDuration(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'mining_category_id'         => 'required',
            'packages_name'              => 'required',
            'duration'                   => 'required|integer',
            'prices'                     => 'required',
            'status'                     => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if a category with the same name already exists
        if (empty($request->id)) {
            $existingCategory = MiningCategoryDuration::where('packages_name', $request->input('packages_name'))->first();
            if ($existingCategory) {
                return response()->json(['errors_name' => 'Packages name already exists'], 422);
            }
        }

        $data = array(
            'mining_category_id'           => $request->mining_category_id,
            'packages_name'                => $request->packages_name,
            'duration'                     => $request->duration,
            'prices'                       => $request->prices,
            'status'                       => 1,
        );
        if (empty($request->id)) {
            $resdata['id']                  = MiningCategoryDuration::insertGetId($data);
        } else {
            //update 
            $post = MiningCategoryDuration::find($request->id);
            $post->update($data);
            $resdata['id']                  = $request->id;
        }

        return response()->json($resdata);
    }

    public function allMiningDuration(Request $request)
    {

        $page     = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        // Get search query from the request
        $searchQuery    = $request->searchQuery;
        $status         = (int)$request->selectedFilter;
        //dd($status);
        $query = MiningCategoryDuration::join('mining_categogy', 'mining_categogy_duration.mining_category_id', '=', 'mining_categogy.id')->orderBy('id', 'desc')
            ->select('mining_categogy_duration.*', 'mining_categogy.name');

        if ($searchQuery !== null) {
            $query->where('mining_categogy_duration.packages_name', 'like', '%' . $searchQuery . '%');
        }

        if ($status !== null) {
            $query->where('mining_categogy_duration.status', $status);
        } else {
            $query->whereIn('mining_categogy_duration.status', $status);
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id'                        => $item->id,
                'name'                      => $item->name,
                'mining_category_id'        => $item->mining_category_id,
                'packages_name'             => $item->packages_name,
                'duration'                  => $item->duration,
                'prices'                    => $item->prices,
                'status'                    => $item->status,
            ];
        });

        // Return the modified collection along with pagination metadata
        return response()->json([
            'data' => $modifiedCollection,
            'current_page' => $paginator->currentPage(),
            'total_pages' => $paginator->lastPage(),
            'total_records' => $paginator->total(),
        ], 200);
    }

    public function checkMiningInfo()
    {

        $customTimeZone = 'Asia/Dhaka';
        $currentTime    = Carbon::now($customTimeZone);
        $currentTime    = $currentTime->format('Y-m-d');

        //$active_stores  = MiningServicesBuyHistory::where('user_id', $this->userid)->groupBy('mining_category_id')->get();
        $active_matching  = MiningServicesBuyHistory::where('user_id', $this->userid)->get();

        $current_date   = date("Y-m-d");
        $storeInfoList = [];
        foreach ($active_matching as $store) {
            if ($store->end_date >= $current_date) {
                $storeInfoList[] = [
                    'id'                    => $store->user_id,
                    'mining_category_id'    => $store->mining_category_id,
                    'start_date'            => date("Y-M-d", strtotime($store->start_date)),
                    'end_date'              => date("Y-M-d", strtotime($store->end_date)),
                    'status'                => "Active",
                ];
            }
        }

        // Extract unique mining_category_id values
        $uniqueMiningCategoryIds = array_values(array_unique(array_column($storeInfoList, 'mining_category_id')));
        // Initialize the data array
        $data = [];

        // Assign unique mining_category_id values to category_X keys
        for ($i = 1; $i <= 4; $i++) {
            // Check if $uniqueMiningCategoryIds contains $i
            if (in_array($i, $uniqueMiningCategoryIds)) {
                $data['category_' . $i] = $i;
            } else {
                $data['category_' . $i] = null;
            }
        }
        // Output the $output array as a JSON response
        return response()->json($data, 200);
    }
    public function getMiningDuration(Request $request)
    {
        $categoryId = (int) $request->categoryId;
        $duration = MiningCategoryDuration::where('mining_category_id', $categoryId)->where('status', 1)->get();
        foreach ($duration as $v) {
            $data[] = [
                'id'                           => $v->id,
                'mining_category_id'           => $v->mining_category_id,
                'packages_name'                => $v->packages_name,
                'duration'                     => $v->duration,
                'prices'                       => $v->prices,
            ];
        }

        return response()->json($data, 200);
    }

    public function getMiningCategory()
    {
        $data = [];

        $categoryData = MiningCategory::where('status', 1)->get();

        foreach ($categoryData as $v) {
            $active_matching = MiningServicesBuyHistory::where('user_id', $this->userid)
                ->where('mining_category_id', $v->id)->orderBy('created_at', 'desc')->first();

            $enddate = null; // Default value if no active matching is found
            $today_date = date("Y-m-d");
            if ($active_matching && $active_matching->end_date >= $today_date) {
                $enddate = $active_matching->end_date;
            }

            $data[] = [
                'id'                        => $v->id,
                'name'                      => $v->name,
                'offer_description'         => $v->offer_description,
                'mining_category_id'        => $v->mining_category_id,
                'duration_in_hour'          => $v->duration_in_hour,
                'minute'                    => $v->minute,
                'second'                    => $v->second,
                'minining_amount_per_secnd' => $v->minining_amount_per_secnd,
                'enddate'                   => $enddate,
            ];
        }
        return response()->json($data);
    }

    public function getMiningHistorys()
    {

        $checkRow                  = MiningHistory::where('user_id', $this->userid)->first();
        $data['mining_start_time'] = $checkRow->mining_start_time;
        return response()->json($data);
    }

    public function buyMiningDuration(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'mining_category_id'    => 'required',
            'selected_duration_id'  => 'required',
            'selectedDuration'      => 'required',
            'selectedPrice'         => 'required',

        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $startDate                    = Carbon::today(); // Today's date
        $totalDays                    = (int)$request->selectedDuration;
        $months                       = intdiv($totalDays, 30);
        $days                         = $totalDays % 30;
        // Add the months and then the days
        $endDate                      = $startDate->copy()->addMonthsNoOverflow($months)->addDays($days);
        $customTimeZone = 'Asia/Dhaka';
        $currentTime    = Carbon::now($customTimeZone);
        //$endDate        = Carbon::now($customTimeZone);
        $currentTime    = $currentTime->format('Y-m-d');
        $sdate          = $startDate->format('Y-m-d');
        $edate          = $endDate->format('Y-m-d');

        $sendRecived_usd        = Deposit::where('user_id', $this->userid)->where('status', 1)->sum('deposit_amount');

        if ($request->selectedPrice > $sendRecived_usd) {
            return response()->json(['errors' => ['error_amount' => ['Please make deposit. Your Deposit balance low']]], 422);
        }

        //echo "Start Date: $sdate------END Date: $edate-----Current Date: $currentTime";
        // Check if there's any overlapping record
        $existingMining = MiningServicesBuyHistory::where('user_id', $this->userid)
            ->where('mining_category_id', $request->mining_category_id)
            ->where('mining_category_duration_id', $request->selected_duration_id)
            ->where('start_date', '<=', $edate)
            ->where('end_date', '>=', $sdate)
            ->where('end_date', '>=', $currentTime)
            ->first();
        // If there's an overlapping record, return a message
        if ($existingMining) {
            $res['status']     = 0;
            $res['msg']        = "Your mining matchine still now running";
            $res['notify']     = "Expire Date: {$edate}";
            return response()->json($res, 200);
        } else {
            $data['user_id']                        = $this->userid;
            $data['mining_category_id']             = $request->mining_category_id;
            $data['mining_category_duration_id']    = $request->selected_duration_id;
            $data['duration']                       = $request->selectedDuration;
            $data['service_price']                  = $request->selectedPrice;
            $data['start_date']                     = $startDate->format('Y-m-d');
            $data['end_date']                       = $endDate->format('Y-m-d');

            $duration  = $request->selectedDuration;
            $last_Id   = MiningServicesBuyHistory::insertGetId($data);

            //MiningServicesBuyHistory::create($data);
            $miningCategoryRow   = MiningCategory::where('id', $request->mining_category_id)->first();
            $m_cate_row          = !empty($miningCategoryRow->name) ? $miningCategoryRow->name : "";

            $tran['user_id']     = $this->userid;
            $tran['type']        = 3; //Mining Machine purchage 
            $tran['last_Id']     = $last_Id;
            $tran['amount']      = $request->selectedPrice;
            $tran['description'] = "Mining Machine : [$m_cate_row], Duration : {$duration}";
            TransactionHistory::insert($tran);

            $res['status']     = 1;
            $res['msg']        = "Mining machine successfully purchased";
            $res['notify']     = "Start Date : {$startDate}--End Date: {$endDate}--Days: {$days}";
            return response()->json($res, 200);
        }
    }

    public function miningProcess(Request $request)
    {

        try {
            // Check and remove existing cache values
            if (Cache::has('current_userid')) {
                Cache::forget('current_userid');
            }
            if (Cache::has('current_mining_category_id')) {
                Cache::forget('current_mining_category_id');
            }

            // Store userid and mining_category_id in cache
            Cache::put('current_userid', $this->userid, now()->addHours(10));
            Cache::put('current_mining_category_id', $request->mining_category_id, now()->addHours(10));

            $mining_category_id = $request->mining_category_id;
            $get_row            = MiningCategory::where('id', $mining_category_id)->first();

            if (!$get_row) {
                return response()->json("Mining category not found", 404);
            }

            $customTimeZone = 'Asia/Dhaka';
            $currentTime    = Carbon::now($customTimeZone);
            $endTime        = Carbon::now($customTimeZone);
            $endTime->addHours($get_row->duration_in_hour);

            // Format the datetime as needed
            $currentTimeFormatted = $currentTime->format('Y-m-d H:i:s');
            $endTimeFormatted     = $endTime->format('Y-m-d H:i:s');

            $data = [
                'start_time'        => $currentTimeFormatted,
                'end_time'          => $endTimeFormatted,
                'duration'          => $get_row->duration_in_hour,
                'user_id'           => $this->userid,
                'ip'                => $_SERVER['REMOTE_ADDR'],
                'mining_category_id' => $mining_category_id
            ];

            $currentTimeFormatted = date('Y-m-d H:i:s');
            // Calculate the end time based on the duration
            $endTimeFormatted     = date('Y-m-d H:i:s', strtotime($currentTimeFormatted . ' + ' . $get_row->duration_in_hour . ' hours'));
            $firstCheck           = MiningHistory::where('user_id', $this->userid)->where('mining_category_id', $mining_category_id)->first();

            $start_time  = !empty($firstCheck->start_time) ? $firstCheck->start_time : ""; //"2024-05-29 18:46:00";
            $end_time    = !empty($firstCheck->end_time) ? $firstCheck->end_time : ""; //2024-05-29 19:46:00";
            $currentTime = $currentTime->format('Y-m-d H:i:s');
            // Check if there's any overlapping record
            // Check if there's any overlapping record
            $existingMining = MiningHistory::where('user_id', $this->userid)
                ->where('mining_category_id', $mining_category_id)
                ->where('start_time', '<=', $end_time)
                ->where('end_time', '>=', $start_time)
                ->where('end_time', '>=', $currentTime)
                ->first();

            // If there's an overlapping record, return a message
            if ($existingMining) {
                $res['status']     = 0;
                $res['msg']        = "Your mining is already running";
                $res['notify']     = "Start Time : {$currentTimeFormatted}--End Time: {$endTimeFormatted}--Duration hour: {$get_row->duration_in_hour}";
                return response()->json($res, 200);
            }

            $mining_id = MiningHistory::insertGetId($data);

            $res['data']       = $data;
            $res['mining_id']  = $mining_id;
            $res['status']     = 1;
            $res['msg']        = "Successfully processed and inserted";
            $res['notify']     = "Start Time : {$currentTimeFormatted}--End Time: {$endTimeFormatted}--Duration hour: {$get_row->duration_in_hour}";
            return response()->json($res, 200);
        } catch (\Exception $e) {
            // Log the exception if necessary
            \Log::error('Error inserting mining history: ' . $e->getMessage());
            // Return a JSON response with the error message and a 500 status code
            return response()->json("An error occurred: " . $e->getMessage(), 500);
        }
    }

    public function miningProcessState(Request $request)
    {

        $customTimeZone = 'Asia/Dhaka';
        $currentTime    = Carbon::now($customTimeZone);

        $mining_category_id = (int)$request->mining_category_id;
        $row                = MiningHistory::orderBy('id', 'DESC')->where('user_id', $this->userid)->where('mining_category_id', $mining_category_id)->first();

        $data['start_time']  = !empty($row->start_time) ? $row->start_time : "";
        $data['end_time']    = !empty($row->end_time) ? $row->end_time : "";
        $data['server_time'] = $currentTime->format('Y-m-d H:i:s');

        return response()->json($data);
    }

    public function checkMiningProcess(Request $request)
    {
        $mining_category_id = !empty($request->mining_category_id) ? (int)$request->mining_category_id : 0;
        $checkrow  = MiningHistory::orderBy('id', 'DESC')->where('user_id', $this->userid)->where('mining_category_id', $mining_category_id)->first();
        if ($checkrow) {
            $mining_id = $checkrow->mining_category_id;
            $getminCategory = MiningCategory::where('id', $mining_id)->first();
            $customTimeZone = 'Asia/Dhaka';
            $currentTime    = Carbon::now($customTimeZone);
            //$currentTimeFormatted = $currentTime->format('Y-m-d H:i:s');
            // echo "Current time : {$currentTimeFormatted}-- End Time: {$checkrow->end_time}<br>";
            $end_time = $checkrow->end_time;
            // Check if the current time is less than the end time
            if ($currentTime->lessThan($end_time)) {
                $differenceInSeconds = $currentTime->diffInSeconds($end_time);
                $minutes = intdiv($differenceInSeconds, 60);
                $seconds = $differenceInSeconds % 60;
                //For Assets Calculation 
                $miningAmount = (float) $getminCategory->minining_amount_per_secnd;  // Convert to float first
                $miningAmount = number_format($miningAmount, 10); // Format for display (optional)
                $miningAmount = strval($miningAmount); // Convert back to string before bcmul

                $startCatTime = $checkrow->start_time;
                $getSeconds   = $currentTime->diffInSeconds($startCatTime);

                $assets       = $getSeconds * $miningAmount;
                $data['status']         = 1;
                $data['countdown']      = "{$minutes}:{$seconds}";
                $data['current_assets'] = number_format($assets, 8); // Specify 10 decimal places for precision

                $user = User::find($this->userid); // Replace 1 with the actual ID of the row you want to update
                $user->available_balance = $user->available_balance + number_format($assets, 8); // Update specific fields
                $user->save(); // Save the changes to the database
                // sleep(1);
                return response()->json($data, 200);
            } else {
                $data['status']   = 0;
                $data['messages'] = "current time is not small";
                return response()->json($data, 200);
            }
        } else {
            $data['status']   = 0;
            $data['messages'] = "No mining history record found!";
            return response()->json($data, 200);
        }
    }
}
