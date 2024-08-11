<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ManualAdjustmentDelete extends Model
{
    use HasFactory;
   
    public $table = "manual_adjustment_delete_history";
    protected $fillable = ['delete_adj_id','user_id', 'adjustment_type','adjustment_amount','detailed_remarks','entry_by','delete_by'];
    
}

