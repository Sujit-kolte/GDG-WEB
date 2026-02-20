import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please add a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Added return to prevent double execution
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  // Note: This requires .select('+password') in your query to work
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Separation of logic for Next.js static analysis
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;
