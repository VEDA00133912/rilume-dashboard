import { Schema, model, models, Document } from 'mongoose';

export interface IWebhook extends Document {
  channelId: string;
  webhookId: string;
  token: string;
}

const webhookSchema = new Schema<IWebhook>({
  channelId: {
    type: String,
    required: true,
    unique: true,
  },
  webhookId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const Webhooks = models.Webhooks || model<IWebhook>('Webhooks', webhookSchema);

export default Webhooks;
