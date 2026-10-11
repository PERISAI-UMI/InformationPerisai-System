const Database = require('better-sqlite3');
const db = new Database('./psdm-db.db');

// Add INSTEAD OF triggers for web_site_settings view
db.exec(`
  CREATE TRIGGER IF NOT EXISTS trg_web_site_settings_insert
  INSTEAD OF INSERT ON web_site_settings
  FOR EACH ROW
  BEGIN
    INSERT INTO T_Pengaturan (kunci, nilai, tipe, diperbarui_oleh, updated_at)
    VALUES (NEW.key, NEW.value, 'string', NEW.updated_by, COALESCE(NEW.updated_at, unixepoch()))
    ON CONFLICT(kunci) DO UPDATE SET
      nilai = excluded.nilai,
      diperbarui_oleh = excluded.diperbarui_oleh,
      updated_at = excluded.updated_at;
  END;

  CREATE TRIGGER IF NOT EXISTS trg_web_site_settings_update
  INSTEAD OF UPDATE ON web_site_settings
  FOR EACH ROW
  BEGIN
    UPDATE T_Pengaturan
    SET nilai = NEW.value,
        diperbarui_oleh = NEW.updated_by,
        updated_at = COALESCE(NEW.updated_at, unixepoch())
    WHERE kunci = OLD.key;
  END;

  CREATE TRIGGER IF NOT EXISTS trg_web_site_settings_delete
  INSTEAD OF DELETE ON web_site_settings
  FOR EACH ROW
  BEGIN
    DELETE FROM T_Pengaturan WHERE kunci = OLD.key;
  END;
`);

console.log('Triggers created on web_site_settings successfully!');

// Now insert video_profile_url into T_Pengaturan
const now = Math.floor(Date.now() / 1000);
const videoUrl = 'https://www.youtube.com/embed/JWg_p9PfnTg?si=87vTr-0un14kRxu6';

db.prepare(`
  INSERT INTO T_Pengaturan (kunci, nilai, tipe, diperbarui_oleh, updated_at)
  VALUES ('video_profile_url', ?, 'string', NULL, ?)
  ON CONFLICT(kunci) DO UPDATE SET nilai = excluded.nilai, updated_at = excluded.updated_at
`).run(videoUrl, now);

// Also test inserting/updating through the view now that triggers are in place!
db.prepare(`
  INSERT INTO web_site_settings (key, value, updated_by, updated_at)
  VALUES ('video_profile_url', ?, NULL, ?)
`).run(videoUrl, now);

console.log('Testing SELECT from web_site_settings:');
const row = db.prepare("SELECT * FROM web_site_settings WHERE key = 'video_profile_url'").get();
console.log('Result in web_site_settings:', row);
