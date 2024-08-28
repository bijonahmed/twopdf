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
use Illuminate\Support\Facades\Session;
use PayPal\Api\Amount;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use PayPal\Api\Payment;
use Validator;
use Carbon\Carbon;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\Redirect;

class PaypalController extends Controller
{

    private static $storedData = [];
    protected $frontend_url;
    public function __construct()
    {
        $this->frontend_url = env('FRONTEND_URL');
    }

    public function paypal(Request $request)
    {
        // $validator =   Validator::make($request->all(), [
        //     'first_name'         => 'required',
        //     'last_name'          => 'required',
        //     'email'              => 'required',
        //     'phone'              => 'required',
        //     'street_address'     => 'required',
        //     'state'              => 'required',
        //     'post_code_zip'      => 'required',
        // ], [
        //     'first_name.required' => 'First name is required.',
        //     'last_name.required'  => 'Last name is required.',
        //     'email.required'      => 'Email is required.',
        //     'phone.required'      => 'Phone is required.',
        //     'street_address.required' => 'Address  is required.',
        //     'state.required' => 'State is required.',
        //     'post_code_zip.required' => 'Post Code is required.',

        // ]);
        // if ($validator->fails()) {
        //     return response()->json(['errors' => $validator->errors()], 422);
        // }


        $uniqId = $this->generateUniqueRandomNumber();//$request->input('uniqueId');
        // echo $uniqId;
        //exit;
        $provider = new PayPalClient;
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();
        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                //"return_url" => route('success'),
                "return_url" => route('success', ['uniqId' => $uniqId]),
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
                            // "return_url" => "/success",
                            // "cancel_url" => "/cancel"
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
            $uniqId = $request->query('uniqId');
            $sanitizedUniqId = preg_replace('/[^a-zA-Z0-9]/', '', $uniqId);
            //Insert order data
            $randomNum   = $this->generateUniqueRandomNumber() . "-" . date("y");
            $pre_setting = Setting::find(1);
            $filePath = storage_path('app/cart_data/' . $sanitizedUniqId . '.json');
            if (file_exists($filePath)) {

                $cartData       = file_get_contents($filePath);
                $cartData       = json_decode($cartData, true); // Passing true to get associative array
                $dataArray      = $cartData['cart_data'];
                $billingArray   = $cartData['billing_info'];
                $shippingArray  = $cartData['shippingInfo'];
                //Add customer 
                $email = $billingArray['email'];
                $existingCustomer = Customer::where('email', $email)->first();
                if (empty($existingCustomer)) {
                    $data['name'] = $billingArray['first_name'] . ' ' . $billingArray['last_name'];
                    $data['address'] = $billingArray['street_address'];
                    $data['email'] = $billingArray['email'];
                    $data['phone'] = $billingArray['phone'];
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
                $order->shipping_fee    = !empty($pre_setting->shipping_fee) ? $pre_setting->shipping_fee : 0;
                $order->order_status    = 1; // Order Placed 
                $order->log_id          = $sanitizedUniqId; //LogID
                $order->customer_id     = $lastInsertedCustomerId;
                $order->payment_getway  = 'Paypal';
                //Billing
                $order->billing_first_name          = !empty($billingArray['first_name']) ? $billingArray['first_name'] : "";
                $order->billing_last_name           = !empty($billingArray['last_name']) ? $billingArray['last_name'] : "";
                $order->billing_email               = !empty($billingArray['email']) ? $billingArray['email'] : "";
                $order->billing_phone               = !empty($billingArray['phone']) ? $billingArray['phone'] : "";
                $order->billing_street_address      = !empty($billingArray['street_address']) ? $billingArray['street_address'] : "";
                $order->billing_appar_suite_address = !empty($billingArray['appar_suite_address']) ? $billingArray['appar_suite_address'] : "";
                $order->billing_state               = !empty($billingArray['state']) ? $billingArray['state'] : "";
                $order->billing_post_code_zip       = !empty($billingArray['post_code_zip']) ? $billingArray['post_code_zip'] : "";


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
                $itemtotal = 0;
                foreach ($dataArray as $cartItem) {
                    $productid = !empty($cartItem['id']) ? $cartItem['id'] : "";
                    $quantity  = !empty($cartItem['quantity']) ? $cartItem['quantity'] : ""; //$cartItem['quantity'];
                    $price     = !empty($cartItem['price']) ? $cartItem['price'] : "";  //$cartItem['price']; //str_replace(',', '', $cartItem['price']); // Remove commas
                    $price     = floatval($price); // Convert to float
                    $subtotal  = $quantity * $price;
                    $attribue_val_id     = !empty($cartItem['attribue_val_id']) ? $cartItem['attribue_val_id'] : "";
                    // Add the subtotal to the total
                    $itemtotal += $subtotal;
                    $order_history                  = new OrderHistory();
                    $order_history->order_id        = $lastOrderId;
                    $order_history->product_id      = $productid;
                    $order_history->attribue_val_id = $attribue_val_id;
                    $order_history->quantity        = $quantity;
                    $order_history->price           = $price;
                    $order_history->total           = $itemtotal;
                    $order_history->save();
                }
            }
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


    public function storeCartData(Request $request)
    {
        $validator =   Validator::make($request->all(), [
            'first_name'         => 'required',
            'last_name'          => 'required',
            'email'              => 'required',
            'phone'              => 'required',
            'street_address'     => 'required',
            'state'              => 'required',
            'post_code_zip'      => 'required',
        ], [
            'first_name.required' => 'First name is required.',
            'last_name.required'  => 'Last name is required.',
            'email.required'      => 'Email is required.',
            'phone.required'      => 'Phone is required.',
            'street_address.required' => 'Address  is required.',
            'state.required' => 'State is required.',
            'post_code_zip.required' => 'Post Code is required.',

        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $uniqId          = $request->input('uniqueId');
        $sanitizedUniqId = preg_replace('/[^a-zA-Z0-9]/', '', $uniqId);
        $cartData        = json_decode($request->input('cart'));
        $billingInfo     = [
            'first_name'            => $request->input('first_name'),
            'last_name'             => $request->input('last_name'),
            'email'                 => $request->input('email'),
            'phone'                 => $request->input('phone'),
            'street_address'        => $request->input('street_address'),
            'appar_suite_address'   => $request->input('appar_suite_address'),
            'state'                 => $request->input('state'),
            'post_code_zip'         => $request->input('post_code_zip'),
        ];

        $shippingInfo     = [
            'shipper_first_name'            => $request->input('shipper_first_name'),
            'shipper_last_name'             => $request->input('shipper_last_name'),
            'shipper_email'                 => $request->input('shipper_email'),
            'shipper_phone_number'          => $request->input('shipper_phone_number'),
            'shipper_address'               => $request->input('shipper_address'),
            'shipper_apprt_suite_addr'      => $request->input('shipper_apprt_suite_addr'),
            'shipper_state'                 => $request->input('shipper_state'),
            'shipper_zip'                   => $request->input('shipper_zip'),
        ];

        $directory = storage_path('app/cart_data');
        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }
        $filePath = $directory . '/' . $sanitizedUniqId . '.json';
        // Save billing information along with cart data
        $dataToStore = [
            'billing_info'  => $billingInfo,
            'shippingInfo'  => $shippingInfo,
            'cart_data'     => $cartData,
        ];
        file_put_contents($filePath, json_encode($dataToStore));
    }


    public function getStoreCartData($id)
    {
        $uniqId = $id;
        $sanitizedUniqId = preg_replace('/[^a-zA-Z0-9]/', '', $uniqId);
        $filePath = storage_path('app/cart_data/' . $sanitizedUniqId . '.json');
        if (file_exists($filePath)) {
            $cartData = file_get_contents($filePath);
            $cartData = json_decode($cartData, true); // Passing true to get associative array
            return response()->json(['cartData' => $cartData]);
        } else {
            return response()->json(['error' => 'Cart data not found for the provided uniqueId'], 404);
        }
    }


    public function retrieveData()
    {
        $filePath = storage_path('app/storedData.json');
        if (file_exists($filePath)) {
            $data = json_decode(file_get_contents($filePath), true);
            unlink($filePath); // Remove the file after retrieving data
            return response()->json(['storedData' => $data]);
        } else {
            return response()->json(['message' => 'No data stored'], 404);
        }
    }


    function generateUniqueRandomNumber($length = 5)
    {
        $randomString = substr(md5(uniqid(mt_rand(), true)), 0, $length);

        return $randomString;
    }
     
}
