import User from '../models/User.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? '';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? '';
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

export const githubRedirect = (_req, res) => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: 'user,repo,read:org',
    redirect_uri: `${process.env.CLIENT_URL ? CLIENT_URL.replace(/:\d+$/, ':' + (process.env.PORT || 5000)) : 'http://localhost:5000'}/api/auth/callback`,
  });
  // Backend handles OAuth callback, so redirect_uri points to backend
  const backendUrl = `http://localhost:${process.env.PORT || 5000}`;
  const callbackParams = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    scope: 'user,repo,read:org',
    redirect_uri: `${backendUrl}/api/auth/callback`,
  });
  res.redirect(`https://github.com/login/oauth/authorize?${callbackParams}`);
};

export const githubCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.redirect(`${CLIENT_URL}/?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error('[OAuth Error] Token exchange failed:', tokenData);
      return res.redirect(`${CLIENT_URL}/?error=token_exchange_failed`);
    }

    const ghToken = tokenData.access_token;

    // Fetch GitHub user data
    const userRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${ghToken}`, 'User-Agent': 'OpenSourceX' },
    });
    const ghUser = await userRes.json();

    // Upsert user in MongoDB
    const userData = {
      githubId: String(ghUser.id),
      username: ghUser.login,
      email: ghUser.email,
      avatarUrl: ghUser.avatar_url,
      bio: ghUser.bio,
      followers: ghUser.followers,
      following: ghUser.following,
      githubUrl: ghUser.html_url,
      githubAccessToken: ghToken,
    };

    const user = await User.findOneAndUpdate(
      { githubId: String(ghUser.id) },
      userData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Generate JWT tokens
    const accessToken = signAccessToken(user._id.toString());
    const refreshToken = signRefreshToken(user._id.toString());

    res.redirect(`${CLIENT_URL}/?access_token=${accessToken}&refresh_token=${refreshToken}`);
  } catch (err) {
    logger.error('GitHub OAuth callback error:', err.message);
    res.redirect(`${CLIENT_URL}/?error=oauth_failed`);
  }
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select('-githubAccessToken');
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  res.json({
    id: user._id,
    githubId: user.githubId,
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    followers: user.followers,
    following: user.following,
    githubUrl: user.githubUrl,
    role: user.role,
    contributionScore: user.contributionScore,
    createdAt: user.createdAt,
  });
};

export const logout = async (_req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }
  try {
    const { sub } = verifyRefreshToken(token);
    const accessToken = signAccessToken(sub);
    const newRefreshToken = signRefreshToken(sub);
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};
