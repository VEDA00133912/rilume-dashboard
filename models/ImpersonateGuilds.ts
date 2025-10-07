import { Schema, model, models, Document } from 'mongoose';

export interface IImpersonateGuild extends Document {
  guildId: string;
  impersonate: boolean;
  channelId?: string | null;
}

const impersonateGuildsSchema = new Schema<IImpersonateGuild>({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  impersonate: {
    type: Boolean,
    default: true,
  },
  channelId: {
    type: String,
    default: null,
  },
});

const ImpersonateGuilds =
  models.ImpersonateGuilds ||
  model<IImpersonateGuild>('ImpersonateGuilds', impersonateGuildsSchema);

export default ImpersonateGuilds;
