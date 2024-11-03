<?php

namespace App\Http\Controllers;

use Stripe\Stripe;
use Validator;
use App\Models\User;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Setting;
use App\Models\Customer;
use Illuminate\View\View;
use Stripe\PaymentIntent;
use App\Models\OrderHistory;
use Illuminate\Http\Request;
use Stripe\Checkout\Session; // Ensure this import is correct
use DateTime;


use Tymon\JWTAuth\Facades\JWTAuth;

class StripePaymentController extends Controller
{

    private static $storedData = [];
    protected $frontend_url;

    // protected $userid;
    public function __construct()
    {
      
        $this->frontend_url = env('FRONTEND_URL');
    }
    

    public function stripe(): View
    {
        return view('stripe');
    }


    public function stripeCheckout(Request $request)
    {


       //  dd($request->all());
        $amount        = $request->amount;
        $selectedPlan  = $request->selectedPlan;
        $customerId    = $request->customerId;//$this->userid;
        $randomNum = $this->generateUniqueRandomNumber() . "-" . date("s");


        Stripe::setApiKey(config('services.stripe.secret'));
        // Define URLs for success and cancellation
        $successUrl = route('payment.success', ['payment_id' => $randomNum, 'customerId' => $customerId, 'amount' => $amount, 'selected_plan' => $selectedPlan]);
        $cancelUrl = route('payment.cancel');
        // Define product and amount details


        try {
            // Create a checkout session
            $session = Session::create([
                'payment_method_types' => ['link', 'card'],
                'line_items' => [[
                    'price_data' => [
                        'product_data' => [
                            'name' => $selectedPlan .'-'.uniqid(),
                        ],
                        'unit_amount' => 100 * $amount,
                        'currency' => 'USD',
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => $successUrl,
                'cancel_url' => $cancelUrl,
            ]);

            // Return JSON response with the session URL
            return response()->json(['url' => $session->url]);
        } catch (\Exception $e) {
            // Handle exceptions if session creation fails
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }


    // Add dummy success and cancel endpoints
    public function paymentSuccess(Request $request)
    {


        $customerId      = $request->input('customerId');
        $selectedPlan    = $request->input('selected_plan');
        $uniqId          = $this->generateUniqueRandomNumber() . "-" . date("s");;
        $sanitizedUniqId = preg_replace('/[^a-zA-Z0-9]/', '', $uniqId);
        //Insert order data
        $randomNum       = $this->generateUniqueRandomNumber() . "-" . date("s");
        $pre_setting     = Setting::find(1);
        $userrow         = User::where('id',$customerId)->first();
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

        $currentDate = new DateTime();
      
        if($selectedPlan == 'monthly'){
            $for_how_many_months = 1; //month
            $convert_days        = 30; //Days
            $futureDate          = $currentDate->modify('+30 days');
        }

        if($selectedPlan == 'yearly'){
            $for_how_many_months = 12; //month
            $convert_days        = 365; //Days
            $futureDate          = $currentDate->modify('+365 days');
        }



        $order                  = new Order();
        $order->orderId         = $randomNum;
        $order->amount          = $request->input('amount');
        $order->order_status    = 1; // Order Placed 

        $order->customer_id     = $lastInsertedCustomerId;
        $order->payment_getway  = 'Stripe';
        $order->order_date      = date("Y-m-d");
        $order->selectedPlan    = $selectedPlan;

        $order->for_how_many_months  = $for_how_many_months;
        $order->convert_days         = $convert_days;
        $order->plan_ending_date     = $futureDate;



        $order->save();
        $lastOrderId = $order->id;

        $order_history                  = new OrderHistory();
        $order_history->order_id        = $lastOrderId;
        $order_history->product_id      = 1;
        $order_history->quantity        = 1;
        $order_history->price           = $request->input('amount'); //amount
        $order_history->total           = $request->input('amount'); //amount
        $order_history->save();
    
        // Retrieve payment details from the request
        $paymentId              = $request->input('payment_id'); // Retrieve Stripe payment ID
        $email                  = $request->input('email'); // Retrieve user email
        $amount                 = $request->input('amount'); // Retrieve actual amount from the request
        $currency               = 'USD'; // Define currency
        $userId                 = $customerId;//$request->input('userId'); // Retrieve user ID
        $selectedPlan = $request->input('selected_plan'); // Retrieve selected plan

        // Store payment details in the database
        Payment::create([
            'payment_id'     => $paymentId,
            'email'          => $email,
            'amount'         => $amount / 100, // Convert cents to dollars if needed
            'currency'       => $currency,
            'customer_id'        => $userId, // Add user_id if your payments table has this column
            'payment_method' => 'Stripe',
            'payment_status' => 'COMPLETED',
            'selected_plan'  => $selectedPlan, 
            'orderId'        => $lastOrderId
        ]);

        $data['payment_id'] = $paymentId;
        $data['currency']   = $currency;
        $data['amount']     =  $amount;
        return view('pay_success', $data);

        return 'Payment was successful! Payment ID: ' . $paymentId;
    }

    public function paymentCancel()
    {
        $data['data']   = 'Payment is cancelled';
        return view('pay_failed', $data);
    }
    function generateUniqueRandomNumber($length = 5)
    {
        do {
            $randomNumber = mt_rand(pow(10, $length - 1), pow(10, $length) - 1);
        } while (Order::where('id', $randomNumber)->exists());

        return $randomNumber;
    }
}
