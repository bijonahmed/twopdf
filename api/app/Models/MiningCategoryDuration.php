<?php
namespace App\Models;
// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use AuthorizesRequests;
use DB;
class MiningCategoryDuration extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    public $table = "mining_categogy_duration";
    protected $fillable = [
        'mining_category_id',
        'packages_name',
        'duration',
        'prices',
        'status',
    ];
}
