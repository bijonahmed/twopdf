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
use DateTime;

class PaypalController extends Controller
{

    private static $storedData = [];
    protected $frontend_url;


    public function paypal(Request $request)
    {

        //dd($request->all());

        $uniqId       = $this->generateUniqueRandomNumber(); //$request->input('uniqueId');
        $selectedPlan = $request->selectedPlan;
        $provider     = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken  = $provider->getAccessToken();
        $response     = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                //"return_url" => route('success'),
                "return_url"     => route('success', [
                    'customerId' => $request->customerId,
                    'uniqId'     => $uniqId,
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



        $provider = new PayPalClient; // new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        $response    = $provider->capturePaymentOrder($request->token);
        $customerId  = $request->customerId;

        //dd($response);
        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            $uniqId          = $this->generateUniqueRandomNumber() . "-" . date("y");;
            $sanitizedUniqId = preg_replace('/[^a-zA-Z0-9]/', '', $uniqId);
            //Insert order data
            $randomNum       = $this->generateUniqueRandomNumber() . "-" . date("y");
            $pre_setting     = Setting::find(1);
            $userrow         = User::where('id', $customerId)->first();
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

            $currentDate  = new DateTime();
            $selectedPlan = $request->selectedPlan;
 

            if ($selectedPlan == 'monthly') {
                $for_how_many_months = 1; //month
                $convert_days        = 30; //Days
                $futureDate          = $currentDate->modify('+30 days');
            }

            if ($selectedPlan == 'yearly') {
                $for_how_many_months = 12; //month
                $convert_days        = 365; //Days
                $futureDate          = $currentDate->modify('+365 days');
            }


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

            $order->for_how_many_months  = $for_how_many_months;
            $order->convert_days         = $convert_days;
            $order->plan_ending_date     = $futureDate;


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
