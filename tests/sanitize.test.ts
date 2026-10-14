import test from "node:test";
import assert from "node:assert/strict";
import { sanitizeHtml } from "../src/lib/sanitize";

test("Sanitize HTML Content", async (t) => {
  await t.test("Menghapus tag berbahaya script dan iframe", () => {
    const dirty = '<p>Halo</p><script>alert("XSS")</script><iframe src="https://evil.com"></iframe>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<p>Halo</p>");
  });

  await t.test("Menghapus atribut event handler (onload, onerror, onclick)", () => {
    const dirty = '<img src="https://example.com/foto.jpg" onerror="alert(1)" onload="evil()" />' +
      '<button onclick="malicious()">Klik</button>';
    const clean = sanitizeHtml(dirty);
    assert.ok(!clean.includes("onerror"));
    assert.ok(!clean.includes("onload"));
    assert.ok(!clean.includes("onclick"));
    assert.ok(!clean.includes("button")); // button tidak di whitelist
    assert.ok(clean.includes('src="https://example.com/foto.jpg"'));
  });

  await t.test("Menolak javascript: URI pada tag a", () => {
    const dirty = '<a href="javascript:alert(1)">Klik Disini</a><a href="https://example.com">Resmi</a>';
    const clean = sanitizeHtml(dirty);
    assert.ok(!clean.includes("javascript:"));
    assert.ok(clean.includes('href="https://example.com"'));
  });

  await t.test("Mempertahankan elemen aman artikel (p, h1, b, i, table)", () => {
    const safeInput = '<h1>Judul Berita</h1><p>Paragraf <b>tebal</b> dan <i>miring</i></p><table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>';
    const clean = sanitizeHtml(safeInput);
    assert.ok(clean.includes("<h1>Judul Berita</h1>"));
    assert.ok(clean.includes("<b>tebal</b>"));
    assert.ok(clean.includes("<i>miring</i>"));
    assert.ok(clean.includes("<table>"));
    assert.ok(clean.includes("<td>Data</td>"));
  });
});
