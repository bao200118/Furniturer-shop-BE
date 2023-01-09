import { Schema, model, Types, models } from 'mongoose';

interface IProduct {
    id: Types.ObjectId,
    name: string,
    category: Array<string>,
    image: Array<string>,
    description: string,
    size: {
        width: number,
        height: number,
        depth: number,
        unit: string,
    },
    color: string,
    material: string,
    weight: string,
    inStock: number,
    price: number,
    rating: number,
    createAt: Date,
    updateAt: Date,
}

const productSchema = new Schema<IProduct>({
    id: Schema.Types.ObjectId,
    name: { type: String, default: '' },
    category: [{ type: String }],
    image: [{ type: String, default: '' }],
    description: { type: String, default: '' },
    size: {
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        depth: { type: Number, default: 0 },
        unit: { type: String, default: 'm' },
    },
    color: { type: String, default: '' },
    material: { type: String, default: '' },
    weight: { type: String, default: '' },
    inStock: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    createAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
});

export default models.Product || model<IProduct>('Product', productSchema);
