<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;
class MiningServicesBuyHistory extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    public $table = "mining_service_buy_history";
    protected $fillable = [
        'user_id',
        'mining_category_id',
        'mining_category_duration_id',
        'duration',
        'service_price',
        'start_date',
        'end_date',
        'status',
      

    ];
}
