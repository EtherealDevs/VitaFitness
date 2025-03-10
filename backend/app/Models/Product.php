<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    protected $fillable = ['name', 'price', 'description', 'stock', 'status', 'options'];

    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
}
