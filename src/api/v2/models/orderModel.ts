import { Schema, model, Types, models } from 'mongoose';

interface IOrder {
  customerID: Types.ObjectId,
  customerName: string,
  phone: string,
  address: string,
  products: Array<{
    product: Types.ObjectId,
    quantity: number,
  }>
  totalPrice: number,
  isPaid: boolean,
  paymentMethod: string,
  status: string,
  note: string,
  createAt: Date,
  updateAt: Date,
}

const orderSchema = new Schema<IOrder>({
    customerID: { type: Schema.Types.ObjectId, required: true },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    products: [
        {
            //Product ID
            product: { type: Schema.Types.ObjectId, default: '' },
            quantity: { type: Number, default: 0 },
        },
    ],
    totalPrice: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    paymentMethod: { type: String, default: 'cash' },
    status: { type: String, default: 'Create order' },
    note: { type: String, default: '' },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

export default models.Order || model<IOrder>('Product', orderSchema);