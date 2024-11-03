<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\PublicController;
use App\Http\Controllers\Public\PublicOrderStatusUpdate;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Payment\PaypalController;
use App\Http\Controllers\StripePaymentController;

Route::get('/clear-cache', function () {
    $exitCode = Artisan::call('optimize:clear');
    // return what you want
});
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
//Route::get('/success', [PaymentController::class, 'success'])->withoutMiddleware('auth');



Route::get('/payment/success', [StripePaymentController::class, 'paymentSuccess'])->name('payment.success');
Route::get('/payment/cancel', [StripePaymentController::class, 'paymentCancel'])->name('payment.cancel');


Route::get('/success', 'App\Http\Controllers\Payment\PaypalController@success')->name('success')->withoutMiddleware('auth:api');
Route::get('/cancel', 'App\Http\Controllers\Payment\PaypalController@cancel')->name('cancel')->withoutMiddleware('auth:api');


Route::get('/auth/google', 'Auth\LoginController@redirectToGoogle');
Route::get('/auth/google/callback', 'Auth\LoginController@handleGoogleCallback');



Route::get('showProfileData', [UserController::class, 'me']);
Route::get('activate-account', [PublicController::class, 'activationAccount']);
Route::get('upload', [PublicController::class, 'upload']);
Route::post('submit', [PublicController::class, 'submit']);
Route::get('/', function () {
    return view('welcome');
});
