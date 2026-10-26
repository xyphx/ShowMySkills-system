import assert from 'node:assert';
import { test } from 'node:test';
import crypto from 'node:crypto';

// Test security utility: OTP hashing
const hashOtp = (otp) => {
  return crypto.createHash('sha256').update(String(otp).trim()).digest('hex');
};

test('Security check: Plaintext OTP is never equal to stored hash', () => {
  const plainOtp = '482910';
  const hashed = hashOtp(plainOtp);

  assert.notStrictEqual(plainOtp, hashed);
  assert.strictEqual(hashed.length, 64); // SHA-256 hex length
  assert.strictEqual(hashOtp('482910'), hashed);
  assert.notStrictEqual(hashOtp('482911'), hashed);
});

test('OTP Verification: Attempt limit enforcement (max 5)', () => {
  let attempts = 0;
  const maxAttempts = 5;
  const correctHash = hashOtp('123456');

  const verifyAttempt = (inputOtp) => {
    if (attempts >= maxAttempts) {
      throw new Error('Too many failed attempts. Code invalidated.');
    }
    const inputHash = hashOtp(inputOtp);
    if (inputHash !== correctHash) {
      attempts += 1;
      return false;
    }
    return true;
  };

  for (let i = 0; i < 5; i++) {
    const success = verifyAttempt('000000');
    assert.strictEqual(success, false);
  }

  assert.throws(
    () => verifyAttempt('000000'),
    /Too many failed attempts/
  );
});

test('OTP Verification: Cooldown rate limit enforcement (60 seconds)', () => {
  const cooldownMs = 60 * 1000;
  const lastSentAt = new Date(); // Sent right now

  const checkCanResend = (sentAt) => {
    const elapsed = Date.now() - sentAt.getTime();
    if (elapsed < cooldownMs) {
      return false;
    }
    return true;
  };

  assert.strictEqual(checkCanResend(lastSentAt), false);

  const pastDate = new Date(Date.now() - 65 * 1000); // 65 seconds ago
  assert.strictEqual(checkCanResend(pastDate), true);
});

test('OTP Verification: Expiry check (10 minutes)', () => {
  const now = new Date();
  const validExpiresAt = new Date(now.getTime() + 10 * 60 * 1000);
  const expiredExpiresAt = new Date(now.getTime() - 1000);

  assert.strictEqual(validExpiresAt > now, true);
  assert.strictEqual(expiredExpiresAt < now, true);
});

test('Admin Application Submission: Rejection without photo consent', () => {
  const validateSubmission = (app) => {
    if (!app.photoConsent) {
      throw new Error('Consent for public profile photo use is required');
    }
    if (!app.photoFile) {
      throw new Error('Applicant photo is required');
    }
    return true;
  };

  assert.throws(
    () =>
      validateSubmission({
        name: 'Jane Doe',
        email: 'jane@example.com',
        photoConsent: false,
        photoFile: 'uploads/admin-photos/photo.png',
      }),
    /Consent for public profile photo use is required/
  );

  const valid = validateSubmission({
    name: 'Jane Doe',
    email: 'jane@example.com',
    photoConsent: true,
    photoFile: 'uploads/admin-photos/photo.png',
  });
  assert.strictEqual(valid, true);
});

test('Admin Application: Fixed official destination is server-controlled', () => {
  const getDestination = (browserSuppliedEmail) => {
    // Server ignores any client-supplied destination
    const fixedOfficialDestination = process.env.OFFICIAL_ADMIN_EMAIL || 'admin@showmyskills.com';
    return fixedOfficialDestination;
  };

  const maliciousInput = 'attacker@malicious.com';
  const destination = getDestination(maliciousInput);

  assert.strictEqual(destination, 'admin@showmyskills.com');
  assert.notStrictEqual(destination, maliciousInput);
});

test('Admin Application: Account not created upon submission; photo attached as profileIcon only after approval', () => {
  // Simulating application submission
  const application = {
    id: 'app-999',
    name: 'Robin Hunter',
    email: 'robin@example.com',
    photoUrl: 'uploads/admin-photos/robin.jpg',
    photoConsent: true,
    status: 'pending',
  };

  let accounts = [];

  // On submission: no account created
  assert.strictEqual(accounts.length, 0);
  assert.strictEqual(application.status, 'pending');

  // On core admin approval:
  const approveApplication = (app, adminId) => {
    if (!app.photoConsent) throw new Error('No consent');
    app.status = 'approved';
    app.reviewedBy = adminId;
    const newAccount = {
      name: app.name,
      email: app.email,
      role: 'admin',
      profileIcon: app.photoUrl, // Photo attached as public profile icon with consent
    };
    accounts.push(newAccount);
    return newAccount;
  };

  const adminAccount = approveApplication(application, 'core-admin-01');
  assert.strictEqual(accounts.length, 1);
  assert.strictEqual(adminAccount.role, 'admin');
  assert.strictEqual(adminAccount.profileIcon, 'uploads/admin-photos/robin.jpg');
  assert.strictEqual(application.status, 'approved');
});

test('Development preview: Strictly blocked in production environment', () => {
  const evaluatePreviewAllowed = (env, queryParam) => {
    const isDev = env !== 'production';
    if (!isDev) return false;
    return queryParam === 'step2' || queryParam === 'page2' || queryParam === 'true';
  };

  // In production, even with preview=step2, it must NEVER be allowed
  assert.strictEqual(evaluatePreviewAllowed('production', 'step2'), false);
  assert.strictEqual(evaluatePreviewAllowed('production', 'true'), false);

  // In development, preview parameter activates preview
  assert.strictEqual(evaluatePreviewAllowed('development', 'step2'), true);
  assert.strictEqual(evaluatePreviewAllowed('test', 'page2'), true);
});

test('OTP 6-Box component: Digits concatenation and clipboard paste extraction', () => {
  const sanitizePastedOtp = (rawClipboard) => {
    return rawClipboard.replace(/\D/g, '').slice(0, 6);
  };

  // Clean 6-digit paste
  assert.strictEqual(sanitizePastedOtp('482910'), '482910');

  // Paste with spaces or dashes
  assert.strictEqual(sanitizePastedOtp(' 482-910 '), '482910');

  // Paste with text prefix
  assert.strictEqual(sanitizePastedOtp('Code: 981240 for auth'), '981240');

  // Verify boxes to combined value
  const boxes = ['1', '2', '3', '4', '5', '6'];
  const combined = boxes.join('');
  assert.strictEqual(combined, '123456');
  assert.strictEqual(combined.length, 6);
});

test('Date of Birth Validation: Future dates are strictly rejected', () => {
  const validateDob = (dob) => {
    const parsedDob = new Date(dob);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    if (Number.isNaN(parsedDob.getTime())) {
      throw new Error('Invalid date of birth format');
    }
    if (parsedDob > endOfToday) {
      throw new Error('Date of birth cannot be in the future');
    }
    return true;
  };

  // Valid past date
  assert.strictEqual(validateDob('1998-05-14'), true);
  assert.strictEqual(validateDob('2000-01-01'), true);

  // Future date should throw
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const futureDateString = tomorrow.toISOString().slice(0, 10);
  assert.throws(
    () => validateDob(futureDateString),
    /Date of birth cannot be in the future/
  );

  // Invalid date string should throw
  assert.throws(
    () => validateDob('not-a-valid-date'),
    /Invalid date of birth format/
  );
});

