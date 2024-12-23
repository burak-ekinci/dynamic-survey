const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Kullanıcı şeması oluştur
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    title: { type: String },
    field: { type: String },
    mates: [{
         firstName: String,
         lastName: String,
          email: String,
           phoneNumber: String,
            title: String,
             field: String 
            }],
  },
  {
    timestamps: true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
  }
);

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
