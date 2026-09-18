/**
 * Lead queue in front of a Google Sheet, exposed to the outreach sender as a
 * small JSON API. Deploy as: Extensions -> Apps Script -> Deploy -> New
 * deployment -> Web app -> Execute as "Me", Access "Anyone".
 *
 * Why an Apps Script and not the Sheets API: it needs no service account, no
 * key file in CI, and it is the pattern this project already uses for the
 * contact form (see GOOGLE_SHEETS_WEBHOOK_URL in .env.example). The lead data
 * stays in the sheet, which matters because the repository is public.
 *
 * Expected tabs
 *   leady      one row per person. Header row required; column order free.
 *              Recognised columns: email, firma, domena, osoba, status,
 *              sekwencja, krok, demoUrl, demoExpiry, fraza, cpc, konkret,
 *              first_sent_at, data_kontaktu, notatka
 *   wypisani   column A: e-mail addresses, column B: whole domains to block
 *   log        appended automatically, one line per send
 *   demos      written by the n8n demo generator: token, config (JSON),
 *              expires_at, firma, created_at
 *
 * Set TOKEN below to a long random string and put the same value in the
 * repository secret OUTREACH_QUEUE_TOKEN.
 */

const TOKEN = 'ZMIEN-MNIE-NA-DLUGI-LOSOWY-CIAG';
const TAB_LEADS = 'leady';
const TAB_SUPPRESSION = 'wypisani';
const TAB_LOG = 'log';
const TAB_DEMOS = 'demos';

/** Statuses whose rows are never returned: the sequence is finished for them. */
const CLOSED = ['klient', 'odpadl', 'odpadł', 'wypisany', 'unsubscribed'];

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function checkToken_(token) {
  if (token !== TOKEN) throw new Error('bad token');
}

function sheet_(name) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('brak zakładki: ' + name);
  return sheet;
}

/** Reads a tab into objects keyed by header, with rowId = sheet row number. */
function readRows_(name) {
  const sheet = sheet_(name);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(function (h) {
    return String(h).trim();
  });
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const row = { rowId: String(i + 1) };
    let hasContent = false;
    for (let c = 0; c < headers.length; c++) {
      if (!headers[c]) continue;
      let value = values[i][c];
      // Dates must cross the wire as ISO strings, not locale-formatted text,
      // or the follow-up maths on the other side silently stops working.
      if (Object.prototype.toString.call(value) === '[object Date]') {
        value = Utilities.formatDate(value, 'Etc/UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'");
      }
      row[headers[c]] = value === null || value === undefined ? '' : String(value);
      if (row[headers[c]]) hasContent = true;
    }
    if (hasContent) rows.push(row);
  }
  return rows;
}

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    checkToken_(params.token);

    if (params.action === 'suppression') {
      const sheet = sheet_(TAB_SUPPRESSION);
      const values = sheet.getDataRange().getValues().slice(1);
      const emails = [];
      const domains = [];
      values.forEach(function (row) {
        if (row[0]) emails.push(String(row[0]).trim().toLowerCase());
        if (row[1]) domains.push(String(row[1]).trim().toLowerCase());
      });
      return json_({ ok: true, emails: emails, domains: domains });
    }

    if (params.action === 'demos') {
      // Read by the n8n demo server, never by a browser: the token guards the
      // whole table, while each demo's own token guards the single page.
      const demos = readRows_(TAB_DEMOS).map(function (row) {
        return { token: row.token || '', config: row.config || '' };
      }).filter(function (d) {
        return d.token && d.config;
      });
      return json_({ ok: true, demos: demos });
    }

    if (params.action === 'rows') {
      const rows = readRows_(TAB_LEADS).filter(function (row) {
        const status = String(row.status || '').trim().toLowerCase();
        return CLOSED.indexOf(status) === -1;
      });
      return json_({ ok: true, rows: rows });
    }

    return json_({ ok: false, error: 'nieznana akcja' });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}

/** Writes a value into a named column of one row, creating the column if needed. */
function setCell_(sheet, rowId, header, value) {
  const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
  let col = headers.indexOf(header) + 1;
  if (col === 0) {
    col = headers.length + 1;
    sheet.getRange(1, col).setValue(header);
  }
  sheet.getRange(Number(rowId), col).setValue(value);
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    checkToken_(body.token);
    const sheet = sheet_(TAB_LEADS);

    if (body.action === 'markSent') {
      const step = Number(body.step) || 1;
      setCell_(sheet, body.rowId, 'status', step === 1 ? 'wyslane' : 'follow_' + (step - 1));
      setCell_(sheet, body.rowId, 'krok', step);
      setCell_(sheet, body.rowId, 'data_kontaktu', body.at);
      setCell_(sheet, body.rowId, 'kanal', 'email');
      if (step === 1) setCell_(sheet, body.rowId, 'first_sent_at', body.at);

      const log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_LOG);
      if (log) log.appendRow([body.at, body.rowId, step, body.messageId || '', 'sent']);
      return json_({ ok: true });
    }

    if (body.action === 'saveDemo') {
      const demos = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_DEMOS);
      if (!demos) throw new Error('brak zakładki: ' + TAB_DEMOS);
      if (demos.getLastRow() === 0) {
        demos.appendRow(['token', 'config', 'expires_at', 'firma', 'created_at']);
      }
      demos.appendRow([
        body.demoToken,
        body.config,
        body.expiresAt || '',
        body.firma || '',
        new Date().toISOString(),
      ]);

      // The lead row carries what the e-mail templates interpolate, so the
      // sender never has to know anything about how a demo was produced.
      setCell_(sheet, body.rowId, 'demoUrl', body.demoUrl);
      setCell_(sheet, body.rowId, 'demoExpiry', body.demoExpiry || '');
      setCell_(sheet, body.rowId, 'konkret', body.detail || '');
      return json_({ ok: true });
    }

    if (body.action === 'markFailed') {
      setCell_(sheet, body.rowId, 'notatka', 'BLAD: ' + body.error);
      const log = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB_LOG);
      if (log) log.appendRow([new Date().toISOString(), body.rowId, '', '', 'failed: ' + body.error]);
      return json_({ ok: true });
    }

    return json_({ ok: false, error: 'nieznana akcja' });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  }
}
