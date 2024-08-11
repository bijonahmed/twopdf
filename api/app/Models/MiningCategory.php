<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;
class MiningCategory extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    public $table = "mining_categogy";
    protected $fillable = [
        'name',
        'slug',
        'duration_in_hour',
        'minute',
        'second',
        'minining_amount_per_secnd',
        'daily_mining_amount',
        'mining_value_mention_at_hour',
        'offer_description',
        'status',
        'entry_by',
    ];
}
