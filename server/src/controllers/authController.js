const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phoneNumber, title, field } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı' });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      title,
      field,
      mates: [] // Boş arkadaş listesi ile başlat
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Hassas bilgileri çıkararak kullanıcı bilgilerini gönder
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      title: user.title,
      field: user.field,
      createdAt: user.createdAt
    };

    res.status(201).json({ 
      message: 'Kayıt başarılı',
      user: userResponse,
      token 
    });

  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    const password = req.body.password;
    
    const user = await User.findOne({phoneNumber });
    if (!user) {
      return res.status(400).json({ message: 'Kullanıcı bulunamadı' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz şifre' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    // Hassas bilgileri çıkararak kullanıcı bilgilerini gönder
    const userResponse = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      title: user.title,
      field: user.field,
      createdAt: user.createdAt
    };

    res.json({ 
      message: 'Giriş başarılı',
      user: userResponse,
      token 
    });

  } catch (error) {
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
}; 

const logout = async (req, res) => {
    // JWT kullanıldığı için client tarafında token'ı silmek yeterli olacak
    res.json({ message: 'Çıkış başarılı' });
};  


// Generate and send OTP 
const generateAndStoreAgainOTP = async (req,res) => {
  const phone = req.body.phone
 
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
  const otpExpires = Date.now() + 3 * 60 * 1000; 
  // Kullanıcıyı bul
  const user = await User.findOneAndUpdate(
    { phone },
    { $set: { otp, otpExpires } },
    { new: true }
  );
  if (!user) {
    return res.json({ valid: false, message: "Kullanıcı bulunamadı." });
  }

  // OTP'yi gönder ve kontrol et
  const send = await sendOTP(phone, otp);
  if (!send) {
    return  res.json({ valid: false, message: "Mesaj gönderilirken hata" });
  }

  return res.json({ valid: true, message: "Lütfen telefonunuza gelen kodu girin", otp: true });
};

// Send Password with OTP  
async function resetPasswordOTP(sendTo, otp) {
  const username = process.env.NETGSM_USERNAME;
  const password = process.env.PASSWORD;
  const header = process.env.HEADER;
  
  // Başındaki +90 kısmını kaldırmak için replace kullanıyoruz
  const cleanPhoneNumber = sendTo.replace(/^\+90/, '');

  const xml = `<?xml version="1.0"?>
<mainbody>
   <header>
       <usercode>${username}</usercode>
       <password>${password}</password>
       <msgheader>${header}</msgheader>
   </header>
   <body>
       <msg>
           <![CDATA[SuMobil'e giriş yapabilmeniz için yeni şifreniz : ${otp}]]>
       </msg>
       <no>${cleanPhoneNumber}</no>
   </body>
</mainbody>`;
  const headers = { "Content-Type": "application/xml" };

  try {
    const response = await axios.post(
      "https://api.netgsm.com.tr/sms/send/otp",
      xml,
      { headers: headers }
    ) 
    return response.data.includes("<code>0</code>"); // Başarılı yanıt kontrolü
  } catch (error) {
    return false;
  }
}
// Verify OTP 
const verifyOTP = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });

    if (!user) {
      return res.status(404).json({ valid: false, message: "Kullanıcı bulunamadı." });
    }

    if (user.otp === req.body.otp && user.otpExpires > Date.now()) {
      // OTP doğru ve hala geçerli
      user.isVerified = true; // Kullanıcıyı doğrulanmış olarak işaretle
      user.otp = undefined; // OTP'yi temizle
      user.otpExpires = undefined; // OTP geçerlilik süresini temizle
      await user.save();

      return res.json({ valid: true, message: "Doğrulama Başarılı" });
    } else {
      return res.status(400).json({ valid: false, message: "OTP yanlış veya süresi dolmuş." });
    }
  } catch (error) {
    return res.status(500).json({ valid: false, message: `Doğrulama yapılırken beklenmeyen hata: ${error.message}` });
  }
};

// When time is end clear the otp
const timeIsEnd = async (req, res) => {
  try {
   const user =  await User.findOneAndUpdate({ phone: req.body.phone },{$set: {otp: "", otpExpires: null}}, {new: true});
   if(!user){
    return res.json({valid: false, message: "Kullanıcı bulunamadı"})
   }

     return res.json({ valid: true, message: "Süre bitti tekrar kod alın!" });
   
    
  } catch (error) {
    return res.json({valid : false, error})
  }
}


module.exports = {
  register,
  login,
  logout
};