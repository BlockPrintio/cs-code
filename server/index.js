import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const CALLBACK_BASE = process.env.OAUTH_CALLBACK_BASE || `http://localhost:${PORT}`;

app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', CLIENT_URL);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  return next();
});
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'cs-code-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${CALLBACK_BASE}/auth/google/callback`
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, {
          provider: 'google',
          accessToken,
          profile
        });
      }
    )
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${CALLBACK_BASE}/auth/github/callback`
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, {
          provider: 'github',
          accessToken,
          profile
        });
      }
    )
  );
}

const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Not authenticated.' });
};

const ensureGitHub = (req, res, next) => {
  if (!req.user || req.user.provider !== 'github' || !req.user.accessToken) {
    return res.status(403).json({ message: 'GitHub account not connected.' });
  }
  return next();
};

const slugify = (value) => {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'cs-code-project';
};

const flattenFiles = (nodes, basePath = '') => {
  const files = [];
  nodes.forEach(node => {
    if (node.type === 'folder' && node.children) {
      files.push(...flattenFiles(node.children, `${basePath}${node.name}/`));
    }
    if (node.type === 'file') {
      files.push({
        path: `${basePath}${node.name}`,
        content: node.content || ''
      });
    }
  });
  return files;
};

const normalizeFiles = (files) => {
  if (!Array.isArray(files)) return [];
  if (files.length === 0) return [];
  if (files[0]?.path) return files;
  return flattenFiles(files);
};

const requireStrategy = (name) => (req, res, next) => {
  if (!passport._strategy(name)) {
    return res.status(503).send('OAuth not configured.');
  }
  return next();
};

app.get('/auth/google', requireStrategy('google'), passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get(
  '/auth/google/callback',
  requireStrategy('google'),
  passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/?auth=failed` }),
  (req, res) => {
    res.redirect(`${CLIENT_URL}/?auth=success`);
  }
);

app.get('/auth/github', requireStrategy('github'), passport.authenticate('github', { scope: ['read:user', 'user:email', 'repo'] }));
app.get(
  '/auth/github/callback',
  requireStrategy('github'),
  passport.authenticate('github', { failureRedirect: `${CLIENT_URL}/?auth=failed` }),
  (req, res) => {
    res.redirect(`${CLIENT_URL}/?auth=success`);
  }
);

app.get('/api/me', (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated.' });
  const profile = req.user.profile || {};
  res.json({
    user: {
      provider: req.user.provider,
      name: profile.displayName,
      username: profile.username,
      avatar: profile.photos?.[0]?.value
    }
  });
});

app.post('/api/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => res.json({ ok: true }));
  });
});

app.post('/api/github/push-project', ensureAuth, ensureGitHub, async (req, res) => {
  try {
    const { name, description, files } = req.body;
    if (!name || !Array.isArray(files)) {
      return res.status(400).json({ message: 'Invalid payload.' });
    }

    const normalizedFiles = normalizeFiles(files);
    const token = req.user.accessToken;
    const headers = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github+json'
    };

    let repoName = slugify(name);
    let repoRes = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: repoName,
        description: description || '',
        private: false,
        auto_init: true
      })
    });

    if (!repoRes.ok && repoRes.status === 422) {
      repoName = `${repoName}-${Date.now()}`;
      repoRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repoName,
          description: description || '',
          private: false,
          auto_init: true
        })
      });
    }

    if (!repoRes.ok) {
      const err = await repoRes.json().catch(() => ({}));
      return res.status(repoRes.status).json({ message: err?.message || 'Failed to create repo.' });
    }

    const repo = await repoRes.json();
    if (!normalizedFiles.length) {
      return res.json({ repoUrl: repo.html_url });
    }
    const owner = repo.owner?.login;
    const branch = repo.default_branch || 'main';

    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo.name}/git/refs/heads/${branch}`, {
      headers
    });
    const refData = await refRes.json();
    const baseCommitSha = refData?.object?.sha;

    const commitRes = await fetch(`https://api.github.com/repos/${owner}/${repo.name}/git/commits/${baseCommitSha}`, {
      headers
    });
    const commitData = await commitRes.json();
    const baseTreeSha = commitData?.tree?.sha;

    const tree = [];
    for (const file of normalizedFiles) {
      if (!file.path) continue;
      const blobRes = await fetch(`https://api.github.com/repos/${owner}/${repo.name}/git/blobs`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: file.content || '',
          encoding: 'utf-8'
        })
      });
      const blob = await blobRes.json();
      tree.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blob.sha
      });
    }

    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo.name}/git/trees`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree
      })
    });
    const treeData = await treeRes.json();

    const newCommitRes = await fetch(`https://api.github.com/repos/${owner}/${repo.name}/git/commits`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Initial commit from CS Code',
        tree: treeData.sha,
        parents: [baseCommitSha]
      })
    });
    const newCommit = await newCommitRes.json();

    await fetch(`https://api.github.com/repos/${owner}/${repo.name}/git/refs/heads/${branch}`, {
      method: 'PATCH',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sha: newCommit.sha })
    });

    return res.json({ repoUrl: repo.html_url });
  } catch (e) {
    return res.status(500).json({ message: 'GitHub push failed.' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth server running on ${PORT}`);
});
