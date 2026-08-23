"use client";
import { http } from '@/lib/axios';
import React, { useEffect, useState } from 'react'

const page = () => {

    const [products, setProducts] = useState<any>([]);

    const handleFetchProduct = async () => {
        try {
            const response = await http.get("http://localhost:5000/api/products/");
            setProducts(response.data.data);
        } catch (err: any) {
            console.log("Errror: ", err.message);
        }
    }

    useEffect(() => {
        handleFetchProduct();
    }, []);

    return (
        <div className='px-24'>
            <h1>Produt List</h1>
            <div>
                Filter
                <select name="" id="">
                    <option value=""></option>
                </select>
            </div>

            {/* list of products */}
            <div className='grid grid-cols-5 gap-8 mt-8'>
                {products.map((product: any) => (
                    <div className='w-50' key={product._id}>
                        <img className='object-cover' src={`http://localhost:5000/uploads/${product.images[0]}`} />
                        <h1 className='py-4'>{product.name}</h1>
                        <p>{product.description}</p>
                        <div className='flex gap-2 py-2'>
                            <p className='font-medium'>{product.discount}$ <span className='line-through text-rose-500'>${product.price}</span></p>
                        </div>
                        <button className='px-3 py-2 bg-black text-white font-medium mt-2'>
                            Add to cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default page