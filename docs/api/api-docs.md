# ShowMySkills REST API Documentation

Production Base Endpoint: `https://showmyskills.xyphx.com/api`  
Local Development Endpoint: `http://localhost:5000/api`

---

## Interactive Swagger UI Documentation

Explore and test all 59 API endpoints live with token persistence via Swagger UI:

- **Swagger UI (Interactive Playground)**:
  - Local: `http://localhost:5000/api/docs`
  - Production: `https://showmyskills.xyphx.com/api/docs`
- **OpenAPI 3.0 Specification (Raw JSON)**:
  - Local: `http://localhost:5000/api/docs/swagger.json` or `http://localhost:5000/api/docs.json`
  - Production: `https://showmyskills.xyphx.com/api/docs/swagger.json`

---

## Authentication in Swagger UI

Most endpoints require authentication using a JSON Web Token (JWT).

1. **Obtain Token**: Send a `POST /api/auth/login` or `POST /api/auth/register` request.
2. **Copy Token**: Extract the `data.token` string from the JSON response.
3. **Authorize in Swagger UI**:
   - Click the green **Authorize 🔓** button at the top right of the Swagger UI.
   - Enter your token (or `Bearer <token>`).
   - Click **Authorize** and then **Close**.
   - Token authorization persists across browser refreshes.

---

## API Domain & Endpoint Directory

### 1. System & Health
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and server UTC timestamp | Public |
| `GET` | `/api/docs` | Interactive Swagger UI documentation | Public |
| `GET` | `/api/docs/swagger.json` | OpenAPI 3.0 specification JSON | Public |

### 2. Authentication (`/api/auth/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT access token | Public |
| `POST` | `/api/auth/register` | Register student, company, college, or admin account | Public |
| `POST` | `/api/auth/verify-email` | Verify email address with 6-digit OTP | Public |
| `POST` | `/api/auth/forgot-password` | Send password recovery OTP to email | Public |
| `POST` | `/api/auth/verify-reset-otp` | Validate password reset OTP code | Public |
| `POST` | `/api/auth/reset-password` | Complete password reset with verified OTP | Public |
| `GET` | `/api/auth/me` | Retrieve currently authenticated user profile | Bearer JWT |

### 3. Users & Directory (`/api/users/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Search campus talent directory (search, roleTag, skill, college) | Public |
| `GET` | `/api/users/{id}` | Get public candidate profile and verified projects | Public |
| `PUT` | `/api/users/profile` | Update user headline, bio, skills, and portfolio projects | Bearer JWT |
| `PUT` | `/api/users/settings` | Update notification and privacy visibility settings | Bearer JWT |

### 4. Internships (`/api/internships/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/internships` | Filter active internships (search, location, mode, skill, verified) | Public |
| `POST` | `/api/internships` | Post a new internship opening | Bearer JWT |
| `GET` | `/api/internships/{id}` | Get single internship opening details | Public |
| `PUT` | `/api/internships/{id}` | Update an internship opening | Bearer JWT |
| `DELETE`| `/api/internships/{id}` | Delete an internship opening | Bearer JWT |

### 5. Internship Actions (`/api/internship-actions/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/internship-actions/my-actions` | Retrieve student's swipe decisions (accepted, rejected, saved) | Bearer JWT |
| `POST` | `/api/internship-actions/{id}/action` | Record candidate swipe action (accepted, rejected, saved, unsaved) | Bearer JWT |

### 6. Applications & ATS (`/api/applications/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/apply` | Submit application to internship opening | Bearer JWT |
| `GET` | `/api/applications/my-applications` | Retrieve current student's submitted applications | Bearer JWT |
| `GET` | `/api/applications/company-applications`| Recruiter ATS pipeline (filter by stage, role, candidate) | Bearer JWT |
| `PUT` | `/api/applications/{id}/status` | Update candidate hiring stage (shortlisted, interview, hired) | Bearer JWT |

### 7. Launchpad (`/api/launchpad/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/launchpad` | Discover curated top-tech programs (GSoC, MLH, etc.) | Public |
| `POST` | `/api/launchpad` | Create new launchpad opportunity | Admin JWT |
| `GET` | `/api/launchpad/{id}` | Retrieve single launchpad opportunity details | Public |
| `POST` | `/api/launchpad/{id}/click` | Record click telemetry on external link | Public |

### 8. Skill Assessments (`/api/skills/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | Discover skill assessment benchmark challenges | Public |
| `GET` | `/api/skills/my-submissions` | Retrieve student's passed tests and certificates | Bearer JWT |
| `GET` | `/api/skills/{id}` | Retrieve test question paper for test-taking | Bearer JWT |
| `POST` | `/api/skills/{id}/submit` | Submit test answers, auto-grade, and award badge | Bearer JWT |

### 9. Chats & Messaging (`/api/chats/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/chats/conversations` | Retrieve active chat threads and unread counts | Bearer JWT |
| `GET` | `/api/chats/conversations/{id}/messages`| Fetch message history for a conversation | Bearer JWT |
| `POST` | `/api/chats/messages` | Send direct message to a user or thread | Bearer JWT |
| `PUT` | `/api/chats/conversations/{id}/read` | Mark conversation messages as read | Bearer JWT |

### 10. Bookmarks & Saved Items (`/api/bookmarks/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/bookmarks/my-bookmarks` | Retrieve saved internships and starred candidates | Bearer JWT |
| `POST` | `/api/bookmarks/internships/{id}` | Toggle save/bookmark for an internship opening | Bearer JWT |
| `POST` | `/api/bookmarks/candidates/{id}` | Toggle starred status for a candidate profile | Bearer JWT |

### 11. Verification (`/api/verifications/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/verifications/submit` | Submit college ID or credential for audit | Bearer JWT |
| `GET` | `/api/verifications/my-status` | Get verification milestone checklist & request status | Bearer JWT |

### 12. Admin Portal (`/api/admin/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/overview` | Platform KPI metrics and recent student registrations | Admin JWT |
| `GET` | `/api/admin/users` | Manage users with role tag filtering | Admin JWT |
| `PUT` | `/api/admin/users/{id}/role-tag` | Assign role tag (Maintainer, Ambassador, Contributor) | Admin JWT |
| `PUT` | `/api/admin/internships/{id}/moderate`| Approve, suspend, or feature internship on Launchpad | Admin JWT |
| `GET` | `/api/admin/verifications` | List pending and audited college ID requests | Admin JWT |
| `PUT` | `/api/admin/verifications/{id}` | Approve or reject verification request | Admin JWT |
| `GET` | `/api/admin/analytics` | Telemetry, hiring funnels, and college leaderboard | Admin JWT |

### 13. Admin Application (`/api/admin-applications/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/admin-applications/send-applicant-otp` | Send verification OTP to applicant email | Public |
| `POST` | `/api/admin-applications/verify-applicant-otp` | Verify applicant OTP & issue authorization token | Public |
| `POST` | `/api/admin-applications/send-official-otp` | Send security OTP to official platform inbox | Public |
| `POST` | `/api/admin-applications/submit` | Submit application with photo ID and consent | Public |
| `GET` | `/api/admin-applications` | List admin applications | Admin JWT |
| `POST` | `/api/admin-applications/{id}/approve` | Approve admin application & provision account | Admin JWT |
| `POST` | `/api/admin-applications/{id}/reject` | Reject admin application with reason | Admin JWT |

### 14. File Uploads (`/api/upload/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/upload/avatar` | Upload user profile picture (JPEG, PNG, WebP) | Bearer JWT |
| `POST` | `/api/upload/resume` | Upload student resume (PDF, DOC, DOCX up to 10MB) | Bearer JWT |
| `POST` | `/api/upload/certificate` | Upload skill or course certificate proof | Bearer JWT |
| `POST` | `/api/upload/logo` | Upload company brand logo | Bearer JWT |
| `POST` | `/api/upload/attachment` | Upload chat attachment | Bearer JWT |

### 15. Support & FAQ (`/api/support/*`)
| Method | Path | Summary | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/support/tickets` | Submit help desk or partnership inquiry ticket | Public |
| `GET` | `/api/support/faqs` | Search knowledge base FAQs | Public |

---

## Security & Rate Limiting

The API includes multi-tier security protection enabled on all routes:

1. **Global Rate Limiter**: 300 requests / 15 minutes per IP.
2. **Auth Limiter**: 15 requests / 15 minutes per IP (Login, Register, Password Reset).
3. **Strict OTP Limiter**: 6 requests / 10 minutes per IP (Prevents OTP brute-forcing).
4. **Submission Limiter**: 20 requests / 15 minutes per IP (Tickets, applications, verifications).
5. **NoSQL Injection Sanitizer**: Recursively strips MongoDB operator keys (`$gt`, `$where`, etc.).
6. **XSS Sanitizer**: Strips script tags and javascript pseudo-protocols from inputs.
7. **HPP Protection**: Sanitizes query parameters to prevent array spoofing.

---

## Local Development & Testing

```bash
# Start backend server with live reload
cd api
npm run dev

# Run automated test suite
npm test
```
Access the interactive documentation in your browser at `http://localhost:5000/api/docs`.
