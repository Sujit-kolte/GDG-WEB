import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    domain: { type: String, required: true },
    tier: { type: String, required: true },
    linkedin: { type: String },
    github: { type: String },
    image: [String],
    createdAt: { type: Date, default: Date.now }
});

const coreTeamSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: String,
    membersList: String,
    image: [String],
    createdAt: { type: Date, default: Date.now }
});

// This "||" check is mandatory in Next.js
export const Member = mongoose.models.Member || mongoose.model('Member', memberSchema);
export const CoreTeam = mongoose.models.CoreTeam || mongoose.model('CoreTeam', coreTeamSchema);