const User = require('../models/UserModel');

const getUser = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({user, message: 'Kullanıcı başarıyla getirildi', valid: true});
};

const addMate = async (req, res) => {
    try {
       const newMate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        title: req.body.title,
        field: req.body.field
       }
        const user = await User.findById(req.user.id);
        
      
        
        user.mates.push(newMate);
        await user.save();
        res.json({user, message: 'Mate başarıyla eklendi', valid: true});
    } catch (error) {
        res.status(500).json({message: 'Sunucu hatası', error: error.message, valid: false});
    }
};

const getMates = async (req, res) => {
    const user = await User.findById(req.user.id);
    res.json({mates: user.mates, message: 'Mate başarıyla getirildi', valid: true});
};

const removeMate = async (req, res) => {
    const { mateId } = req.params;
    const user = await User.findById(req.user.id);
    user.mates = user.mates.filter(id => !id.equals(mateId));
    await user.save();
    res.json({user, message: 'Mate başarıyla silindi', valid: true});
};

const updateUser = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, title, field } = req.body;
    const user = await User.findById(req.user.id);
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phoneNumber = phoneNumber;
    user.title = title;
    user.field = field;
    await user.save();
    res.json({user, message: 'Kullanıcı başarıyla güncellendi', valid: true});
};

const deleteUser = async (req, res) => {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'Kullanıcı başarıyla silindi' });
};

const searchMates = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    
    // Kullanıcıyı bul ve rehberini getir
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
        valid: false
      });
    }

    // Rehber boşsa hemen dön
    if (!Array.isArray(user.mates) || user.mates.length === 0) {
      return res.json({
        mates: [],
        message: "Rehberinizde kayıtlı kişi bulunmuyor",
        valid: true
      });
    }

    // Arama terimi yoksa tüm rehberi dön
    if (!searchTerm) {
      return res.json({
        mates: user.mates,
        message: "Tüm kişiler listelendi",
        valid: true
      });
    }

    // Arama terimini küçük harfe çevir
    const lowerCasedTerm = searchTerm.toLowerCase().trim();

    // Rehberde arama yap
    const filteredMates = user.mates.filter(mate => {
      const searchableFields = [
        mate.firstName,
        mate.lastName,
        mate.email,
        mate.phoneNumber,
        mate.title,
        mate.field
      ];

      // Herhangi bir alanda arama terimi geçiyorsa true dön
      return searchableFields.some(field => 
        field && field.toLowerCase().includes(lowerCasedTerm)
      );
    });

    // Sonuçları döndür
    return res.json({
      mates: filteredMates,
      message: filteredMates.length > 0 
        ? "Arama sonuçları listelendi" 
        : "Arama kriterine uygun kişi bulunamadı",
      valid: true,
      total: filteredMates.length
    });

  } catch (error) {
    console.error("Arama hatası:", error);
    return res.status(500).json({
      message: "Arama yapılırken bir hata oluştu",
      valid: false,
      error: error.message
    });
  }
};

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
        return res.status(400).json({ message: 'Mevcut şifre yanlış', valid: false });
    }
    user.password = newPassword;
    await user.save();
    res.json({user, message: 'Şifre başarıyla güncellendi', valid: true});
};

const deleteMateByEmail = async (req, res) => {
    try {
        const email = req.body.email;
        
        // Email kontrolü
        if (!email) {
            return res.status(400).json({
                message: "Email adresi gereklidir",
                valid: false
            });
        }

        // Kullanıcıyı bul
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: "Kullanıcı bulunamadı",
                valid: false
            });
        }

        // Silinecek kişiyi bul
        const mateIndex = user.mates.findIndex(mate => mate.email === email);
        
        // Kişi bulunamadıysa hata döndür
        if (mateIndex === -1) {
            return res.status(404).json({
                message: "Bu email adresine sahip kişi rehberinizde bulunamadı",
                valid: false
            });
        }

        // Kişiyi rehberden çıkar
        user.mates.splice(mateIndex, 1);
        
        // Değişiklikleri kaydet
        await user.save();

        // Başarılı yanıt döndür
        return res.json({
            message: "Kişi rehberden başarıyla silindi",
            valid: true,
            user: user
        });

    } catch (error) {
        console.error("Silme hatası:", error);
        return res.status(500).json({
            message: "Kişi silinirken bir hata oluştu",
            valid: false,
            error: error.message
        });
    }
};

module.exports = { 
    getUser,
    addMate,
    getMates,
    removeMate,
    updateUser,
    deleteUser, 
    searchMates,
    updatePassword,
    deleteMateByEmail
};   