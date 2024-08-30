<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\MystoreHistory;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Crypt;
use App\Models\ProductCategory;
use App\Models\User;
use App\Jobs\ProcessExcelUpload;
use App\Models\Customer;
use App\Models\OrderHistory;
use App\Models\Payment;
use App\Models\Setting;
use Illuminate\Support\Facades\Session;
use PayPal\Api\Amount;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
//use PayPal\Api\Payment;
use Validator;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Redirect;
use PayPal\Api\Order as ApiOrder;

class PaypalController extends Controller
{

    private static $storedData = [];
    protected $frontend_url;


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

    public function paypal(Request $request)
    {

        
        $uniqId       = $this->generateUniqueRandomNumber();//$request->input('uniqueId');
        $selectedPlan = $request->selectedPlan;
        $provider     = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken  = $provider->getAccessToken();
        $response     = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                //"return_url" => route('success'),
                "return_url" => route('success', [
                    'uniqId' => $uniqId,
                    'selectedPlan' => $selectedPlan,
                ]),
                "cancel_url" => route('cancel')
            ],
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $request->amount,
                    ]
                ],
            ],

        ]);

        if (isset($response['id']) && $response['id'] != null) {

            foreach ($response['links'] as $link) {
                if ($link['rel'] === 'approve') {
                    //$redirect_url = route('success') . '?&custom_variable=' . urlencode($uniqId);
                    return response()->json([
                        "application_context" => [
                            "return_url" => route('success'),
                            "cancel_url" => route('cancel'),
                        ],
                        "redirectUrl" => $link['href'],
                    ]);
                }
            }
        } else {
            // Return JSON response for cancellation
            return response()->json(['message' => 'Payment is cancelled.'], 400);
        }
    }

    public function success(Request $request)
    {


        $provider = new PayPalClient;// new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        $response = $provider->capturePaymentOrder($request->token);
        //dd($response);
        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            $uniqId          = $this->generateUniqueRandomNumber() . "-" . date("y");;
            $sanitizedUniqId = preg_replace('/[^a-zA-Z0-9]/', '', $uniqId);
            //Insert order data
            $randomNum       = $this->generateUniqueRandomNumber() . "-" . date("y");
            $pre_setting     = Setting::find(1);
            $userrow         = User::where('id',1)->first();
            //Add customer 
            $email           = $userrow->email;
            $phone_number    = $userrow->phone_number;

            $existingCustomer = Customer::where('phone', $phone_number)->first();
            if (empty($existingCustomer)) {
                $data['name']    = $userrow->name;
                $data['address'] = 'Unknown';
                $data['email'] = $userrow->email;
                $data['phone'] = $userrow->phone_number;
                $newCustomer = Customer::create($data);
                $lastInsertedCustomerId = $newCustomer->id;
            } else {
                $lastInsertedCustomerId = $existingCustomer->id;
            }
            //END 
            //dd($cartData);
            $order                  = new Order();
            $order->orderId         = $randomNum;
            $order->amount          = $response['purchase_units'][0]['payments']['captures'][0]['amount']['value'];
            //$order->shipping_fee    = !empty($pre_setting->shipping_fee) ? $pre_setting->shipping_fee : 0;
            $order->order_status    = 1; // Order Placed 
            //  $order->log_id          = $sanitizedUniqId; //LogID
            $order->customer_id     = $lastInsertedCustomerId;
            $order->payment_getway  = 'Paypal';
            $order->order_date      = date("Y-m-d");
            $order->selectedPlan    = $request->selectedPlan;

            //Billing
            // $order->billing_first_name          = !empty($billingArray['first_name']) ? $billingArray['first_name'] : "";
            // $order->billing_last_name           = !empty($billingArray['last_name']) ? $billingArray['last_name'] : "";
            // $order->billing_email               = !empty($billingArray['email']) ? $billingArray['email'] : "";
            // $order->billing_phone               = !empty($billingArray['phone']) ? $billingArray['phone'] : "";
            // $order->billing_street_address      = !empty($billingArray['street_address']) ? $billingArray['street_address'] : "";
            // $order->billing_appar_suite_address = !empty($billingArray['appar_suite_address']) ? $billingArray['appar_suite_address'] : "";
            // $order->billing_state               = !empty($billingArray['state']) ? $billingArray['state'] : "";
            // $order->billing_post_code_zip       = !empty($billingArray['post_code_zip']) ? $billingArray['post_code_zip'] : "";
            $order->save();
            $lastOrderId = $order->id;

            /*
            //Email Confirmation
            $customerFname = !empty($billingArray['first_name']) ? $billingArray['first_name'] : "";
            $customerLname =  !empty($billingArray['last_name']) ? $billingArray['last_name'] : "";
            $customerEmail = !empty($billingArray['email']) ? $billingArray['email'] : "";

            $to = "mdbijon@gmail.com,matrix360sourcing@gmail.com,whtr121@gmail.com,mdbijon@yahoo.com";
            //$to = "mdbijon@gmail.com";
            $subject = "Antrail Order Confirmation email";
            $message = "Order arrived please check admin panel order section and order number :$randomNum";
            // Always set content-type when sending HTML email
            $headers = "MIME-Version: 1.0" . "\r\n";
            $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
            // More headers
            mail($to, $subject, $message, $headers);
            //exit; 

            //END Email Confirmation
            */

            //Shipping
            // $order->shipper_first_name          = !empty($shippingArray['shipper_first_name']) ? $shippingArray['shipper_first_name'] : "";
            // $order->shipper_last_name           = !empty($shippingArray['shipper_last_name']) ? $shippingArray['shipper_last_name'] : "";
            // $order->shipper_email               = !empty($shippingArray['shipper_email']) ? $shippingArray['shipper_email'] : "";
            // $order->shipper_phone_number        = !empty($shippingArray['shipper_phone_number']) ? $shippingArray['shipper_phone_number'] : "";
            // $order->shipper_address             = !empty($shippingArray['shipper_address']) ? $shippingArray['shipper_address'] : "";
            // $order->shipper_apprt_suite_addr    = !empty($shippingArray['shipper_apprt_suite_addr']) ? $shippingArray['shipper_apprt_suite_addr'] : "";
            // $order->shipper_state               = !empty($shippingArray['shipper_state']) ? $shippingArray['shipper_state'] : "";
            // $order->shipper_zip                 = !empty($shippingArray['shipper_zip']) ? $shippingArray['shipper_zip'] : "";
            // $order->save();
            // $lastOrderId = $order->id;
            //END order


            //echo $uniqId;
            $order_history                  = new OrderHistory();
            $order_history->order_id        = $lastOrderId;
            $order_history->product_id      = 1;
            $order_history->quantity        = 1;
            $order_history->price           = $response['purchase_units'][0]['payments']['captures'][0]['amount']['value']; //amount
            $order_history->total           = $response['purchase_units'][0]['payments']['captures'][0]['amount']['value']; //amount
            $order_history->save();
        

            // Insert data into database
            $payment = new Payment;
            $payment->payment_id    = $response['id'];
            $payment->amount        = $response['purchase_units'][0]['payments']['captures'][0]['amount']['value'];
            $payment->currency      = $response['purchase_units'][0]['payments']['captures'][0]['amount']['currency_code'];
            $payment->payer_name    = $response['payer']['name']['given_name'];
            $payment->payer_email   = $response['payer']['email_address'];
            $payment->payment_status = $response['status'];
            $payment->payment_method = "PayPal";
            $payment->orderId       = $lastOrderId;
            $payment->save();
            // Clear session data
            $data['payment_id'] = $payment->payment_id;
            $data['amount']     = $payment->amount;
            $data['status']     = $payment->payment_status;
            $data['currency']   = $payment->currency;
            // Return JSON response with custom data
            $data['frontend_url'] = $this->frontend_url;
            return view('pay_success', $data);
            // return response()->json([
            //     'status' => 'success',
            //     'message' => 'Payment is successful',
            //     'data' => [
            //         // Include any additional data you want to send to the frontend
            //     ]
            // ]);
        } else {
            $data['data']   = 'Payment is cancelled';
            return view('pay_failed', $data);
            // Return JSON response for cancellation
            //return response()->json(['message' => 'Payment is cancelled'], 400);
        }
    }

    public function cancel()
    {
        $data['data']   = 'Payment is cancelled';
        return view('pay_failed', $data);
        //return response()->json(['message' => 'Payment is cancelled.'], 400);
    }


    function generateUniqueRandomNumber($length = 5)
    {
        $randomString = substr(md5(uniqid(mt_rand(), true)), 0, $length);

        return $randomString;
    }
     
}
