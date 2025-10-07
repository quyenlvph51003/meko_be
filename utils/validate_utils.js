function isValidEmail(email) {
    // Regex chuẩn để check email
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  module.exports = { isValidEmail };
  

  //dsaddddsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsadsa