import { Schema, model, models, Document } from 'mongoose';

export interface IExpand extends Document {
  guildId: string;
  expand: boolean;
}

const expandSchema = new Schema<IExpand>({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  expand: {
    type: Boolean,
    default: true,
  },
});

const Expands = models.Expands || model<IExpand>('Expands', expandSchema);

export default Expands;
