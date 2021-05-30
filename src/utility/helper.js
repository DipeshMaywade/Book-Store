const bcrypt = require('bcrypt');

class Helper {
  /**
   * @method passEncrypt
   * @param {orignalPassword} password
   * @description For encrypt password before save or reset into database
   */
  passEncrypt = async (password) => {
    try {
      const salt = await bcrypt.genSalt();
      const hashPass = await bcrypt.hash(password, salt);
      return hashPass;
    } catch (error) {
      logger.log('error', error);
    }
  };
}

module.exports = new Helper();
