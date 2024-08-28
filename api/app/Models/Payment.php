<?php

namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;

class Payment extends Authenticatable
{
  use HasApiTokens, HasFactory, Notifiable;
  public $table = "payment";
  protected $fillable = [
    'payment_id','orderId','amount','currency','payer_name','payer_email','payment_status','payment_method'
  ];
}
