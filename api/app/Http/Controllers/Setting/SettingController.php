<?php

namespace App\Http\Controllers\Setting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Auth;
use Validator;
use Helper;
use App\Models\User;
use App\Models\Setting;
use App\Models\Profile;
use App\Models\Sliders;
use Illuminate\Support\Str;
use App\Rules\MatchOldPassword;
use Illuminate\Support\Facades\Hash;
use DB;

class SettingController extends Controller
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
    public function insertEmployeeType(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'status'    => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'          => !empty($request->name) ? $request->name : "",
            'status'        => !empty($request->status) ? $request->status : "",
            'entry_by'      => $this->userid,
        );
        // dd($data);
        if (empty($request->id)) {
            DB::table('employee_type')->insertGetId($data);
        } else {
            DB::table('employee_type')->where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }

    public function sliderrow($id)
    {
        $id = (int) $id;
        $data = Sliders::find($id);
        $response = [
            'id'           => $data->id,
            'redirect_url' => $data->redirect_url,
            'status'       => $data->status,
            'images'       => !empty($data->images) ? url($data->images) : "",
        ];

        //dd($response);
        return response()->json($response, 200);
    }

    public function insertSlider(Request $request)
    {
        if (empty($request->id)) {
            $validator = Validator::make($request->all(), [
                'files'         => 'required',
                'redirect_url'  => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
        } else {
            $validator = Validator::make($request->all(), [
                //  'files'         => 'required',
                'redirect_url'  => 'required',
            ]);
            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
        }

        $data = array(
            'redirect_url'               => $request->redirect_url,
            'status'                     => !empty($request->status) ? $request->status : "",
        );

        // dd($data);
        if (!empty($request->file('files'))) {
            $files = $request->file('files');
            $fileName = Str::random(20);
            $ext = strtolower($files->getClientOriginalExtension());
            $path = $fileName . '.' . $ext;
            $uploadPath = '/backend/slider_imaes/';
            $upload_url = $uploadPath . $path;
            $files->move(public_path('/backend/slider_imaes/'), $upload_url);
            $file_url = $uploadPath . $path;
            $data['images'] = $file_url;
        }

        if (empty($request->id)) {
            Sliders::insert($data);
        } else {
            DB::table('sliders')->where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }

    public function slidersImages(Request $request)
    {

        //dd($request->all());
        $page = $request->input('page', 1);
        $pageSize = $request->input('pageSize', 10);

        // Get search query from the request
        $searchQuery    = $request->searchQuery;
        $selectedFilter = (int)$request->selectedFilter;
        // dd($selectedFilter);
        $query = Sliders::orderBy('id', 'desc');

        if ($searchQuery !== null) {
            $query->where('redirect_url', 'like', '%' . $searchQuery . '%');
        }

        if ($selectedFilter !== null) {

            $query->where('status', $selectedFilter);
        }

        $paginator = $query->paginate($pageSize, ['*'], 'page', $page);

        $modifiedCollection = $paginator->getCollection()->map(function ($item) {
            return [
                'id'                 => $item->id,
                'redirect_url'       => $item->redirect_url,
                'images'             => !empty($item->images) ? url($item->images) : "",
                'status'             => $item->status,
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

    public function insertPayGroup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'status'    => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'          => !empty($request->name) ? $request->name : "",
            'status'        => !empty($request->status) ? $request->status : "",
            'entry_by'      => $this->userid,
        );
        // dd($data);
        if (empty($request->id)) {
            DB::table('pay_group')->insertGetId($data);
        } else {
            DB::table('pay_group')->where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }
    public function insertAnnualPay(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'status'    => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'          => !empty($request->name) ? $request->name : "",
            'status'        => !empty($request->status) ? $request->status : "",
            'entry_by'      => $this->userid,
        );
        // dd($data);
        if (empty($request->id)) {
            DB::table('annual_pay')->insertGetId($data);
        } else {
            DB::table('annual_pay')->where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }
    public function insertBankMaster(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'status'    => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'          => !empty($request->name) ? $request->name : "",
            'status'        => !empty($request->status) ? $request->status : "",
            'entry_by'      => $this->userid,
        );
        // dd($data);
        if (empty($request->id)) {
            DB::table('bank_master')->insertGetId($data);
        } else {
            DB::table('bank_master')->where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }
    public function insertWedges(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'status'    => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'          => !empty($request->name) ? $request->name : "",
            'status'        => !empty($request->status) ? $request->status : "",
            'entry_by'      => $this->userid,
        );
        // dd($data);
        if (empty($request->id)) {
            DB::table('wedges_pay_mode')->insertGetId($data);
        } else {
            DB::table('wedges_pay_mode')->where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }
    public function insertPayItem(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'status'    => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'              => !empty($request->name) ? $request->name : "",
            'in_percent'        => !empty($request->in_percent) ? $request->in_percent : "",
            'in_rupees'         => !empty($request->in_rupees) ? $request->in_rupees : "",
            'min_value'         => !empty($request->min_value) ? $request->min_value : "",
            'max_value'         => !empty($request->max_value) ? $request->max_value : "",
            'effective_frm'     => !empty($request->effective_frm) ? date("Y-m-d", strtotime($request->effective_frm)) : "",
            'effective_to'      => !empty($request->effective_to) ? date("Y-m-d", strtotime($request->effective_to)) : "",
            'status'            => !empty($request->status) ? $request->status : "",
            'entry_by'           => $this->userid,
        );
        // dd($data);
        if (empty($request->id)) {
            DB::table('payroll_pay_item')->insertGetId($data);
        } else {
            DB::table('payroll_pay_item')->where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }
    public function insertBankCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'bank_id'   => 'required',
            'status'    => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'          => !empty($request->name) ? $request->name : "",
            'status'        => !empty($request->status) ? $request->status : "",
            'bank_id'       => !empty($request->bank_id) ? $request->bank_id : "",
            'entry_by'      => $this->userid,
        );
        // dd($data);
        if (empty($request->id)) {
            DB::table('bank_short_code')->insertGetId($data);
        } else {
            DB::table('bank_short_code')->where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }
    public function insertTaxMaster(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'      => 'required',
            'status'    => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'                          => !empty($request->name) ? $request->name : "",
            'percentage_of_deduction'       => !empty($request->percentage_of_deduction) ? $request->percentage_of_deduction : "",
            'tax_reference'                 => !empty($request->tax_reference) ? $request->tax_reference : "",
            'status'                        => !empty($request->status) ? $request->status : "",
            'entry_by'                      => $this->userid,
        );
        // dd($data);
        if (empty($request->id)) {
            DB::table('tax_master')->insertGetId($data);
        } else {
            DB::table('tax_master')->where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }
    public function insertPaymentType(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'              => 'required',
            'working_hour'      => 'required',
            'rate'      => 'required',
            'status'    => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'                          => !empty($request->name) ? $request->name : "",
            'working_hour'                  => !empty($request->working_hour) ? $request->working_hour : "",
            'rate'                          => !empty($request->rate) ? $request->rate : "",
            'status'                        => !empty($request->status) ? $request->status : "",
            'entry_by'                      => $this->userid,
        );
        // dd($data);
        if (empty($request->id)) {
            DB::table('payment_type')->insertGetId($data);
        } else {
            DB::table('payment_type')->where('id', $request->id)->update($data);
        }
        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }
    public function getEmployeeTypeList(Request $request)
    {
        try {
            $rows = Setting::filterEmpList($request->all());
            $response = [
                'data' => $rows,
                'message' => 'success'
            ];
        } catch (\Throwable $th) {
            $response = [
                'data' => [],
                'message' => 'failed'
            ];
        }
        return response()->json($response, 200);
    }
    public function getPayGroupList(Request $request)
    {
        try {
            $rows = Setting::filterPayGroupList($request->all());
            $response = [
                'data' => $rows,
                'message' => 'success'
            ];
        } catch (\Throwable $th) {
            $response = [
                'data' => [],
                'message' => 'failed'
            ];
        }
        return response()->json($response, 200);
    }
    public function getAnnualPayist(Request $request)
    {
        try {
            $rows = Setting::filterAnnualPay($request->all());
            $response = [
                'data' => $rows,
                'message' => 'success'
            ];
        } catch (\Throwable $th) {
            $response = [
                'data' => [],
                'message' => 'failed'
            ];
        }
        return response()->json($response, 200);
    }
    public function getBankMasterlist(Request $request)
    {
        try {
            $rows = Setting::filterbankMaster($request->all());
            $response = [
                'data' => $rows,
                'message' => 'success'
            ];
        } catch (\Throwable $th) {
            $response = [
                'data' => [],
                'message' => 'failed'
            ];
        }
        return response()->json($response, 200);
    }
    public function gettxtMastlist(Request $request)
    {
        try {
            $rows = Setting::filtertaxtMaster($request->all());
            $response = [
                'data' => $rows,
                'message' => 'success'
            ];
        } catch (\Throwable $th) {
            $response = [
                'data' => [],
                'message' => 'failed'
            ];
        }
        return response()->json($response, 200);
    }
    public function getWdges(Request $request)
    {
        try {
            $rows = Setting::filterWdges($request->all());
            $response = [
                'data' => $rows,
                'message' => 'success'
            ];
        } catch (\Throwable $th) {
            $response = [
                'data' => [],
                'message' => 'failed'
            ];
        }
        return response()->json($response, 200);
    }
    public function getPayItemList(Request $request)
    {
        try {
            $rows = Setting::filterPayItemlist($request->all());
            $response = [
                'data' => $rows,
                'message' => 'success'
            ];
        } catch (\Throwable $th) {
            $response = [
                'data' => [],
                'message' => 'failed'
            ];
        }
        return response()->json($response, 200);
    }
    public function getPaymentType(Request $request)
    {
        try {
            $rows = Setting::filterpaymentType($request->all());
            $response = [
                'data' => $rows,
                'message' => 'success'
            ];
        } catch (\Throwable $th) {
            $response = [
                'data' => [],
                'message' => 'failed'
            ];
        }
        return response()->json($response, 200);
    }
    public function getBankShortCodelist(Request $request)
    {
        try {
            $rows = Setting::filterBShortCode($request->all());
            $response = [
                'data' => $rows,
                'message' => 'success'
            ];
        } catch (\Throwable $th) {
            $response = [
                'data' => [],
                'message' => 'failed'
            ];
        }
        return response()->json($response, 200);
    }
    public function checkrowEmpleeType($id)
    {
        $id = (int) $id;
        $data = Setting::editEmpTypeId($id);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }
    public function checkrowPayGroup($id)
    {
        $id = (int) $id;
        $data = Setting::editPayGroupId($id);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }
    public function checkrowAnnualPay($id)
    {
        $id = (int) $id;
        $data = Setting::editAnnualPayId($id);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }
    public function checkrowBankMaster($id)
    {
        $id = (int) $id;
        $data = Setting::editBankMasterId($id);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }
    public function checkrowBankShortCode($id)
    {
        $id = (int) $id;
        $data = Setting::editBankShortCodeId($id);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }
    public function checkrowtxtmaster($id)
    {
        $id = (int) $id;
        $data = Setting::edittxtMasterId($id);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }
    public function checkrowPaymenttype($id)
    {
        $id = (int) $id;
        $data = Setting::editPaymentId($id);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }
    public function checkrowWedges($id)
    {
        $id = (int) $id;
        $data = Setting::editWedgesId($id);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }

    public function settingrow()
    {

        $data = Setting::find(1);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }
    public function checkPayItemRow($id)
    {
        $id = (int) $id;
        $data = Setting::editPayrowId($id);
        $response = [
            'data' => $data,
            'message' => 'success'
        ];
        return response()->json($response, 200);
    }

    public function upateSetting(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required',
            'email'       => 'required',
            'currency'    => 'required',

            'register_bonus'    => 'required',
            'maximum_supply'    => 'required',
            'total_supply'      => 'required',

            'level_1_bonus'      => 'required',
            'level_2_bonus'      => 'required',
            'level_3_bonus'      => 'required',


            'liquidity_total_supply'      => 'required',
            'circlation'                  => 'required',
            'beganing_price'              => 'required',

        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $data = array(
            'name'              => !empty($request->name) ? $request->name : "",
            'email'             => !empty($request->email) ? $request->email : "",
            'address'           => !empty($request->address) ? $request->address : "",
            'whatsApp'          => !empty($request->whatsApp) ? $request->whatsApp : "",
            'description'       => !empty($request->description) ? $request->description : "",
            'copyright'         => !empty($request->copyright) ? $request->copyright : "",
            'currency'          => !empty($request->currency) ? $request->currency : "",
            'fblink'            => !empty($request->fblink) ? $request->fblink : "",
            'website'           => !empty($request->website) ? $request->website : "",
            'telegram'          => !empty($request->telegram) ? $request->telegram : "",

            'level_1_bonus'          => !empty($request->level_1_bonus) ? $request->level_1_bonus : "",
            'level_2_bonus'          => !empty($request->level_2_bonus) ? $request->level_2_bonus : "",
            'level_3_bonus'          => !empty($request->level_3_bonus) ? $request->level_3_bonus : "",
            
            'deposit_service_charge'      => !empty($request->deposit_service_charge) ? $request->deposit_service_charge : "",
            'withdraw_service_charge'     => !empty($request->withdraw_service_charge) ? $request->withdraw_service_charge : "",
            'crypto_wallet_address'       => !empty($request->crypto_wallet_address) ? $request->crypto_wallet_address : "",
            'store_policy'                => !empty($request->store_policy) ? $request->store_policy : "",
            'register_bonus'              => !empty($request->register_bonus) ? $request->register_bonus : 0,
            'maximum_supply'              => !empty($request->maximum_supply) ? $request->maximum_supply : 0,
            'total_supply'                => !empty($request->total_supply) ? $request->total_supply : 0,

            'mininmum_deposit_amount'               => !empty($request->mininmum_deposit_amount) ? $request->mininmum_deposit_amount : 0,
            'maximum_deposit_amount'                => !empty($request->maximum_deposit_amount) ? $request->maximum_deposit_amount : 0,
            'minimum_withdrawal'                    => !empty($request->minimum_withdrawal) ? $request->minimum_withdrawal : 0,
            'maximum_withdrawal'                    => !empty($request->maximum_withdrawal) ? $request->maximum_withdrawal : 0,
            'daily_max_withdraw_request'            => !empty($request->daily_max_withdraw_request) ? $request->daily_max_withdraw_request : 0,
            'withdrawal_free_amount'                => !empty($request->withdrawal_free_amount) ? $request->withdrawal_free_amount : 0,
            'withdrawal_free_on_percentage'         => !empty($request->withdrawal_free_on_percentage) ? $request->withdrawal_free_on_percentage : 0,
            'mimumun_transfer_amount_to_other_user' => !empty($request->mimumun_transfer_amount_to_other_user) ? $request->mimumun_transfer_amount_to_other_user : 0,
            'maximum_transfer_amount_to_other_user' => !empty($request->maximum_transfer_amount_to_other_user) ? $request->maximum_transfer_amount_to_other_user : 0,
            'transfer_fee_fixed_amount'             => !empty($request->transfer_fee_fixed_amount) ? $request->transfer_fee_fixed_amount : 0,
            'traansfer_fee_on_percentage'           => !empty($request->traansfer_fee_on_percentage) ? $request->traansfer_fee_on_percentage : 0,

            'liquidity_total_supply'                => !empty($request->liquidity_total_supply) ? $request->liquidity_total_supply : 0,
            //'circlation'                            => !empty($request->circlation) ? $request->circlation : 0,
            'beganing_price'                        => !empty($request->beganing_price) ? $request->beganing_price : 0,
        );

        //dd($data);
        DB::table('setting')->where('id', 1)->update($data);

        $response = [
            'message' => 'Successfull',
        ];
        return response()->json($response);
    }


}
