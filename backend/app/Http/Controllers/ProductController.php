<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $products = Product::with('images')->get();
        } catch (\Throwable $th) {
            throw $th;
        }
        $products = ProductResource::collection($products);
        $data = [
            'products' => $products,
            'message' => 'Succesfully retrieved products',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $product = Product::with('images')->find($id);
        } catch (\Throwable $th) {
            throw $th;
        }
        $product = new ProductResource($product);
        $data = [
            'product' => $product,
            'message' => 'Succesfully retrieved product',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'stock' => 'required|numeric',
            'options' => 'array',
            'images' => 'required|array',
            // 'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);
        try {
            $product = new Product();
            $product->name = $request->name;
            $product->description = $request->description;
            $product->price = $request->price;
            $product->options = json_encode($request->options);
            $product->stock = $request->stock;
            $product->save();
            foreach ($request->file('images') as $image) {
                $name = Str::random(10) . '_' . $image->getClientOriginalName();
                $path = Storage::putFileAs('products', $image, $name);
                Image::read($image)->scale(width: 1200)->save(public_path('storage/' . $path));
                $product->images()->create(['url' => $path]);
            }
        } catch (\Throwable $th) {
            throw $th;
        }
        $product = new ProductResource($product);
        $data = [
            'product' => $product,
            'message' => 'Product created successfully',
            'status' => 'success (201)'
        ];
        return response()->json($data, 201);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'string',
            'description' => 'string',
            'price' => 'numeric',
            'stock' => 'numeric',
            'options' => 'array',
            'images' => 'array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);
        try {
            $product = Product::find($id);
            $product->update($request->all());
            foreach ($request->file('images') as $image) {
                $name = Str::random(10) . '.' . $image->getClientOriginalName() . 'webp';
                $path = Storage::putFileAs('products', $image, $name);
                Image::read($image)->scale(width: 1200)->save(public_path('storage/' . $path));
                $product->images()->create(['url' => $path]);
            }
        } catch (\Throwable $th) {
            throw $th;
        }
        $product = new ProductResource($product);
        $data = [
            'product' => $product,
            'message' => 'Product updated successfully',
            'status' => 'success (200)'
        ];
        return response()->json($data, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $product = Product::find($id);
            Storage::delete($product->images->pluck('url')->toArray());
            $product->images()->delete();
            $product->delete();
        } catch (\Throwable $th) {
            throw $th;
        }
        $data = [
            'message' => 'Product deleted successfully',
            'status' => 'success (204)'
        ];
        return response()->json($data, 204);
    }
}
