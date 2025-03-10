<?php

namespace App\Services;

use FPDF;

class CustomFPDF extends FPDF
{
    // Public method to access the protected _out method
    public function customOut($data)
    {
        $this->_out($data);
    }

    // You can add more custom methods if needed
}
