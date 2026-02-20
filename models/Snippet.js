import mongoose from 'mongoose';

const codeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    code: { type: String, required: true },
});

// Note the 'codes' at the end to match your specific collection name
export const Snippet = mongoose.models.Snippets || mongoose.model('Snippets', codeSchema, 'codes');