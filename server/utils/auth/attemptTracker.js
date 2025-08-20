const LoginAttempt = require('../../models/security/LoginAttempt');
const { UserBlackList } = require('../../models/security/UserBlackList');
const { Op } = require('sequelize');
const { sendAccountLockedEmail } = require('../../services/emailServices');

// Check if user is blacklisted
async function isUserBlacklisted(userId) {
  const currentBlacklist = await UserBlackList.findOne({
    where: {
      user_id: userId,
      status: 'active',
      expiresAt: { [Op.gt]: new Date() }
    }
  });
  return currentBlacklist;
}

// Record a failed login attempt and handle blacklisting
async function recordFailedLogin(userId, user) {
  // Find or create login attempt record
  let attemptRecord = await LoginAttempt.findOne({ where: { userId } });
  if (!attemptRecord) {
    attemptRecord = await LoginAttempt.create({ userId, attempts: 0 });
  }

  // Increment attempts
  attemptRecord.attempts += 1;
  attemptRecord.lastAttempt = new Date();
  await attemptRecord.save();

  // Check if we need to blacklist
  let banDuration = 0;
  let banReason = '';
  if (attemptRecord.attempts >= 7) {
    banDuration = 30 * 24 * 60 * 60 * 1000; // 1 month
    banReason = 'excessive failed login attempts';
  } else if (attemptRecord.attempts >= 5) {
    banDuration = 24 * 60 * 60 * 1000; // 24 hours
    banReason = 'excessive failed login attempts';
  } else if (attemptRecord.attempts >= 3) {
    banDuration = 60 * 60 * 1000; // 1 hour
    banReason = 'excessive failed login attempts';
  }

  if (banDuration > 0) {
    const expiresAt = new Date(new Date().getTime() + banDuration);
    
    // Create or update blacklist
    await UserBlackList.upsert({
      user_id: userId,
      reason: banReason,
      status: 'active',
      expiresAt: expiresAt
    });

    // Send account locked email
    try {
      await sendAccountLockedEmail(user.email, expiresAt.toLocaleString());
    } catch (emailError) {
      console.error('Failed to send account locked email:', emailError);
    }
  }

  return attemptRecord.attempts;
}

// Reset login attempts on successful login
async function resetLoginAttempts(userId) {
  const attemptRecord = await LoginAttempt.findOne({ where: { userId } });
  if (attemptRecord) {
    attemptRecord.attempts = 0;
    await attemptRecord.save();
  }
}

module.exports = {
  isUserBlacklisted,
  recordFailedLogin,
  resetLoginAttempts
};
