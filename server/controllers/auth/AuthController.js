const passport = require("passport");
const { generateGoogleToken } = require("../../utils/tokenUtils");
const { createToken } = require('../../models/auth/Token');
const { User } = require('../../models/auth/User');
const { UserGroup } = require('../../models/auth/UserGroup');

exports.googleCallback = async (req, res) => {
  try {
    console.log('Google authentication callback triggered');
    console.log('User object from passport:', req.user);
    
    const { email, displayName } = req.user;
    const group = req.query.group;
    
    // Find or create user
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      user = await User.create({
        username: email.split('@')[0],
        email,
        isVerified: true
      });
      
      // Assign to group (1=patient, 2=doctor)
      const groupId = group === 'patient' ? 1 : 2;
      await UserGroup.create({ userId: user.id, groupId })
    }
    
    // Generate token
    const token = await generateGoogleToken(user.email);
    await createToken(user.id, token);
    
    // Set cookie and redirect
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 1000 * 3600 * 24 * 7,
      domain: 'localhost'
    });
    
    console.log('Redirecting to dashboard');
    res.redirect('http://localhost:3000/');
  } catch (error) {
    console.error('Error in Google authentication callback:', error);
    res.redirect('http://localhost:3000/login');
  }
}