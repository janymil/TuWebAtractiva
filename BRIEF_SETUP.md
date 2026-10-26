# MontaWeb — Client onboarding questionnaire (`/brief`)

Multi-step Spanish brief for new clients. Answers are emailed to **hola@montaweb.pe** and stored as JSON.

## Files

| File | Purpose |
|---|---|
| `brief.html` | The questionnaire page (served as `/brief` by the existing `.htaccess` rewrite) |
| `css/brief.css` | Wizard styles (reuses tokens from `css/montaweb.css`) |
| `js/brief.js` | Steps, validation, localStorage autosave, review, submit + WhatsApp fallback |
| `api/enviar-brief.php` | Validates, stores and emails the brief. **No credentials inside** |
| `api/config.example.php` | Template for SMTP settings |
| `api/.htaccess` | Blocks `config.php`, `*.json`, logs; disables directory listing |
| `api/leads/.htaccess` | Blocks HTTP access to stored briefs |

Modified: `contacto.html` (two CTAs), `privacidad.html` (data disclosure), `sitemap.xml`, `.gitignore`.

## Where do secrets go? — simple version

**One rule:** every file inside your website folder (`public_html`) can be downloaded by anyone. HTML, CSS, JS — all public. So a password written there is a password published.

**So the password goes in ONE file on the server that PHP reads and the browser never receives.** You create it once; no code changes needed.

Your hosting looks like this:

```
/home/USER/
├── montaweb-mail-config.php   ← ✅ PUT THE PASSWORD HERE (outside the website)
└── public_html/               ← everything here is public
    ├── index.html
    ├── brief.html
    ├── contacto.html
    └── api/
        ├── enviar-brief.php   ← code only, contains NO password
        └── config.php         ← alternative place (inside, but blocked + gitignored)
```

**Three steps:**
1. In the hosting panel → File Manager, go **one level above** `public_html` and create `montaweb-mail-config.php`.
2. Paste this, changing only the password:
   ```php
   <?php
   return [
       'to'   => 'hola@montaweb.pe',
       'from' => 'hola@montaweb.pe',
       'from_name' => 'MontaWeb · Brief',
       'smtp' => [
           'host' => 'smtp.zoho.com',
           'port' => 465,
           'secure' => 'ssl',
           'user' => 'hola@montaweb.pe',
           'pass' => 'LA_CONTRASENA_DE_APLICACION',
       ],
   ];
   ```
3. Save. Done — `api/enviar-brief.php` finds it automatically.

> On this project the alternative is already prepared: **`api/config.php`** exists with placeholders
> (host, port, user, from, to) — you only edit `'pass'`. It is gitignored, so it never reaches GitHub.
> **VPS with Caddy?** See `DEPLOY.md`: Caddy ignores `.htaccess`, so there the block is done by `deploy/Caddyfile`.

Why outside the website folder? Even if the file were reachable by URL, it is not inside the folder the web server publishes. Option 2 (`api/config.php`) also works: it is in `.gitignore` and `api/.htaccess` answers **403** to anyone requesting it.

**Do not use your normal Zoho password.** Zoho → *Settings → Security → App Passwords* → create one for "PHP mail" and use that. If it leaks, you revoke just that password, not your mailbox.

**Never put the password in:** `brief.html`, `js/*.js`, `README.md`, a GitHub commit, or a WhatsApp message. `.env`, `api/config.php`, `api/vendor/`, `api/leads/` and `montaweb-mail-config.php` are already ignored by git.

### Zoho details (only if you use Zoho)

- Host `smtp.zoho.com`, port `465` + `ssl` (or `587` + `tls`). User = the full address.
- Add SPF/DKIM/DMARC in DNS for `montaweb.pe`; Zoho shows the exact records. Without DKIM, Gmail may drop the lead email into spam.
- Zoho free plans may limit SMTP — if it refuses, use Zoho's "Send Mail" API or keep `mail()` with your host's local mail server.

## Does sending need my Zoho password?

Yes for **SMTP** — but that password belongs in the server config file, never in the page. Without SMTP the script falls back to PHP `mail()`, which needs no password (your host's local mail server handles delivery) but has weaker deliverability. Recommended path:

1. Install PHPMailer so SMTP can be used:
   ```bash
   cd api && composer require phpmailer/phpmailer
   ```
   (or upload the `PHPMailer` folder + a minimal autoloader). Without `api/vendor/autoload.php` the code silently uses `mail()`.
2. Copy `api/config.example.php` → `/home/USER/montaweb-mail-config.php` and fill in the app password.

## Deploy checklist (PHP + Apache hosting: Hostinger, cPanel, etc.)

1. Upload the new/changed files keeping the `api/` folder.
2. Confirm PHP 8.0+ is selected for the domain.
3. Create the config file **outside** `public_html` with permissions `600`.
4. Ensure `api/leads/` is writable by PHP (`750`). It is created automatically on the first submission.
5. Verify:
   - `https://montaweb.pe/brief` loads (clean URL).
   - `https://montaweb.pe/api/config.php` → **403**.
   - `https://montaweb.pe/api/leads/` → **403**.
6. Submit a real test brief; check `hola@montaweb.pe`, the JSON in `api/leads/`, and that `Reply-To` is the client's email.
7. If the endpoint returns 502, the lead is still saved — the page offers WhatsApp + `.txt` download automatically.

## Local test

```bash
python serve.py          # static only: UI, autosave and review work
php -S 127.0.0.1:8000    # with PHP: exercises /api/enviar-brief.php
```

On `php -S` the `.htaccess` is ignored, so open `/brief.html` directly and set `ENDPOINT` in `js/brief.js` if you change the path.

## Behaviour details

- **6 steps:** business → goals/audience → content/brand → design/features → project/budget → review.
- **Required:** name, email, WhatsApp, business, rubro, city, at least one objective, privacy consent. Everything else is optional.
- **Autosave:** `localStorage` key `mw-brief-draft-v1`, cleared after a successful send.
- **Prefill:** `/brief?plan=Web%20Simple%20Profesional%20(S%2F%2099)&negocio=...`.
- **Anti-spam:** honeypot `_honey`, minimum 4 s fill time, 5 submissions/hour/IP.
- **Never ask for passwords:** the form only records *which* accesses the client has; collect real credentials later over a secure channel.

## Maintenance

- Add/rename questions in `brief.html` **and** in the `$sections` map in `api/enviar-brief.php` (otherwise the new answer is not emailed).
- Plans/prices live in both the contact page and step 5 — keep them in sync with `servicios.html`.
