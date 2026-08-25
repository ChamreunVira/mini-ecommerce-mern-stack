import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  const orderNumber = `ORD-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-16 text-center space-y-6">
      <div className="h-20 w-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
        <CheckCircle size={40} className="text-green-500" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0a0a0a]">
          ការបញ្ជាទិញបានជោគជ័យ!
        </h1>
        <p className="text-gray-500 text-sm max-w-sm">
          សូមអរគុណសម្រាប់ការបញ្ជាទិញរបស់អ្នក។ ការបញ្ជាទិញរបស់អ្នកកំពុងត្រូវបានដំណើរការ។
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-sm px-8 py-4">
        <p className="text-xs text-gray-500 mb-1">លេខការបញ្ជាទិញ</p>
        <p className="text-lg font-extrabold text-[#0a0a0a] tracking-wider">#{orderNumber}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/orders"
          className="px-6 py-3 bg-[#0a0a0a] text-white text-sm font-bold rounded-sm hover:bg-gray-900 transition-colors"
        >
          តាមដានការបញ្ជាទិញ
        </Link>
        <Link
          href="/products"
          className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 hover:border-gray-500 transition-colors"
        >
          បន្តទិញទំនិញ
        </Link>
      </div>
    </div>
  );
}
