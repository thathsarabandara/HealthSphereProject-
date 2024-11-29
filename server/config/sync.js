const sequelize = require('./db');
require('../models/auth/Admin');
require('../models/auth/Group');
require('../models/auth/GroupPermission');
require('../models/auth/Permission');
require('../models/auth/Token');
require('../models/auth/User');
require('../models/auth/UserPassword');
require('../models/auth/UserGroup');

require('../models/content/Notification');
require('../models/content/Review');

require('../models/ecommerce/Cart');
require('../models/ecommerce/CartItem');
require('../models/ecommerce/Offer');
require('../models/ecommerce/UserOffer');

require('../models/healthcare/Doctor');
require('../models/healthcare/Patient');
require('../models/healthcare/Prescription');
require('../models/healthcare/Reservation');
require('../models/healthcare/Schedule');
require('../models/healthcare/ScheduleCancel');
require('../models/healthcare/Specialization');
require('../models/healthcare/PatientAllergy');
require('../models/healthcare/PatientBMI');
require('../models/healthcare/PatientBloodSugar');
require('../models/healthcare/PatientCondition');
require('../models/healthcare/PatientHeartRate');

require('../models/security/AuditLog');
require('../models/security/FailedLoginAttempt');
require('../models/security/PasswordResetRequest');
require('../models/security/RateLimiting');
require('../models/security/SecurityQuestion');
require('../models/security/TwoFactorAuth');
require('../models/security/UserBlackList');

require('../models/transactions/Payment');
require('../models/transactions/Refund');
require('../models/transactions/BillingDetails');
require('../models/transactions/BankReciept');
require('../models/transactions/CardDetails');


const syncDatabase = async () => {
    try {
      await sequelize.sync({ force: false }); // Set to true for development only to drop tables
      console.log('Database synced successfully');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  };

syncDatabase();


