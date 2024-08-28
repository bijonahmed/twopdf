<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Public\PublicController;
use App\Http\Controllers\Public\PublicOrderStatusUpdate;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Payment\PaypalController;


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

Route::get('success', 'App\Http\Controllers\PaypalController@success')->name('success');
Route::get('cancel', 'App\Http\Controllers\PaypalController@cancel')->name('cancel');


Route::get('/auth/google', 'Auth\LoginController@redirectToGoogle');
Route::get('/auth/google/callback', 'Auth\LoginController@handleGoogleCallback');



Route::get('showProfileData', [UserController::class, 'me']);
Route::get('activate-account', [PublicController::class, 'activationAccount']);
Route::get('upload', [PublicController::class, 'upload']);
Route::post('submit', [PublicController::class, 'submit']);
Route::get('/', function () {
    return view('welcome');
});
