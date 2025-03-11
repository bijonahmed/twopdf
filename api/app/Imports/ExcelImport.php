<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToArray;

class ExcelImport implements ToArray
{
    public function array(array $array)
    {
        // Return the Excel data as an array
        return $array;
    }
}
