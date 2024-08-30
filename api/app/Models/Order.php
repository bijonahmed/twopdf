<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    public $table = "orders";
    protected $fillable = [
        'orderId', 
        'customer_id',
        'amount', 
        'order_status',
        'payment_getway',
        'selectedPlan',
        'created_at'
    ];
}
