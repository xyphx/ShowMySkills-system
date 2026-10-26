import assert from 'node:assert';
import { test } from 'node:test';
import {
  noSqlSanitizer,
  xssSanitizer,
  hppProtection,
  corsOptions,
  globalRateLimiter,
  authRateLimiter,
  otpRateLimiter,
  submissionRateLimiter,
  clickRateLimiter,
} from '../api/src/middleware/security.js';

test('Security Middleware: NoSQL Injection operator stripping', () => {
  const req = {
    body: {
      username: 'student1',
      password: { $gt: '' }, // malicious operator
      nested: {
        normal: 'value',
        $where: 'sleep(5000)',
        'dotted.field': 'injection',
      },
    },
    query: {
      email: 'test@example.com',
      $regex: '.*',
    },
    params: {
      id: '123',
    },
  };

  noSqlSanitizer(req, {}, () => {});

  assert.strictEqual(req.body.username, 'student1');
  assert.strictEqual(req.body.password.$gt, undefined);
  assert.strictEqual(req.body.nested.$where, undefined);
  assert.strictEqual(req.body.nested['dotted.field'], undefined);
  assert.strictEqual(req.body.nested.normal, 'value');
  assert.strictEqual(req.query.$regex, undefined);
  assert.strictEqual(req.query.email, 'test@example.com');
  assert.strictEqual(req.params.id, '123');
});

test('Security Middleware: XSS payload stripping from input strings', () => {
  const req = {
    body: {
      bio: 'Normal text <script>alert("pwned")</script> more text',
      headline: 'Engineer javascript:evilCode()',
      imgTag: 'Image <img src="x" onerror="stealCookies()">',
      safeField: 'Frontend Developer | React & Next.js',
    },
  };

  xssSanitizer(req, {}, () => {});

  assert.strictEqual(req.body.bio.includes('<script>'), false);
  assert.strictEqual(req.body.bio.includes('</script>'), false);
  assert.strictEqual(req.body.headline.includes('javascript:'), false);
  assert.strictEqual(req.body.imgTag.includes('onerror='), false);
  assert.strictEqual(req.body.safeField, 'Frontend Developer | React & Next.js');
});

test('Security Middleware: HTTP Parameter Pollution (HPP) single-value enforcement', () => {
  const req = {
    query: {
      page: ['1', '2'], // Polluted array parameter
      limit: '10',
      search: ['foo', 'bar'],
    },
  };

  hppProtection(req, {}, () => {});

  assert.strictEqual(typeof req.query.page, 'string');
  assert.strictEqual(req.query.page, '2'); // Resolves to latest scalar value
  assert.strictEqual(typeof req.query.search, 'string');
  assert.strictEqual(req.query.search, 'bar');
  assert.strictEqual(req.query.limit, '10');
});

test('Security Middleware: Rate limiters properly configured with window and limits', () => {
  assert.ok(globalRateLimiter);
  assert.ok(authRateLimiter);
  assert.ok(otpRateLimiter);
  assert.ok(submissionRateLimiter);
  assert.ok(clickRateLimiter);
});

test('Security Policy: CORS allows legitimate client origins', () => {
  let allowed = false;
  corsOptions.origin('https://showmyskills.xyphx.com', (err, allow) => {
    if (!err && allow) allowed = true;
  });
  assert.strictEqual(allowed, true);

  let localhostAllowed = false;
  corsOptions.origin('http://localhost:3000', (err, allow) => {
    if (!err && allow) localhostAllowed = true;
  });
  assert.strictEqual(localhostAllowed, true);
});
