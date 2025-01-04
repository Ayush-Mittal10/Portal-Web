import { OrderManagement } from "@/components/seller/orders/order-management"

export default function OrdersPage() {
  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-semibold mb-6">Order Management</h1>
      <OrderManagement />
    </div>
  )
}

