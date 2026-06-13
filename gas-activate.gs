/**
 * GoTap — Profile Auto-Activation Script
 * Paste this code in your GAS project (Extensions > Apps Script)
 * 
 * Google Sheets ↔ Vercel ↔ Firebase
 *
 * الإعدادات المطلوبة:
 * ====================
 * 1. اذهب إلى Triggers (الساعة) → Add Trigger:
 *    - Choose function: onPaymentEdit
 *    - Event source: From spreadsheet
 *    - Event type: On edit
 *
 * 2. اذهب إلى Project Settings → Script Properties → Add property:
 *    - Name: ADMIN_SECRET_KEY
 *    - Value: gotap_activate_2026
 *    (لو ما ضفتش Script Property، الـ fallback هو نفس القيمة)
 *
 * 3. تأكد أن ADMIN_SECRET_KEY مضبوط في Vercel Environment Variables
 *    بنفس القيمة (gotap_activate_2026)
 */

// ===================== إعدادات الأعمدة =====================
// عدّل الأرقام حسب ترتيب الأعمدة في شيتك (V12 payload order)
var COL_PAID = 8;        // عمود "تم الدفع" (العمود H)
var COL_PROFILE_LINK = 11; // عمود "رابط الملف الشخصي" (العمود K)
var SHEET_NAME = "Sheet1"; // اسم الشيت

// ===================== الدالة الرئيسية (شغّلها كـ Installable Trigger) =====================
function onPaymentEdit(e) {
  // --- Validation 1: الـ event موجود ---
  if (!e || !e.range) {
    Logger.log("ERROR: No event object received. Make sure this is running as an installable trigger.");
    return;
  }

  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();
  var sheet = range.getSheet();

  // --- Validation 2: الشيت الصحيح ---
  if (sheet.getName() !== SHEET_NAME) {
    Logger.log("Skipped row " + row + ": wrong sheet (" + sheet.getName() + "), expected " + SHEET_NAME);
    return;
  }

  // --- Validation 3: العمود الصحيح (Paid) ---
  if (col !== COL_PAID) {
    return; // مش هندخل في الـ logs عشان ما نكدسش
  }

  var newValue = range.getValue();
  Logger.log("Row " + row + ": Col " + col + " changed to " + JSON.stringify(newValue));

  // --- Validation 4: القيمة اتغيرت من false إلى true ---
  // لو كانت false أو empty بنتجاهلها (يعني العميل لسه ما دفعش)
  if (newValue !== true && newValue !== "TRUE" && newValue !== "true") {
    Logger.log("Row " + row + ": Skipped — value is not TRUE (is " + JSON.stringify(newValue) + ")");
    return;
  }

  // --- Validation 5: فيه رابط ملف شخصي؟ ---
  var profileLink = sheet.getRange(row, COL_PROFILE_LINK).getValue();
  if (!profileLink) {
    Logger.log("Row " + row + ": ✘ No profile link found — cannot activate");
    return;
  }

  // --- استخراج الـ profileId من الرابط ---
  var profileId = extractProfileId(profileLink.toString());
  if (!profileId) {
    Logger.log("Row " + row + ": ✘ Invalid profile link format — \"" + profileLink + "\"");
    return;
  }

  // --- إرسال طلب التفعيل ---
  activateProfile(profileId, row);
}

// ===================== استخراج Profile ID من الرابط =====================
function extractProfileId(link) {
  // الصيغ المدعومة:
  // https://gotap.vercel.app/ar/user/ABCDE123
  // https://gotap.vercel.app/en/user/ABCDE123?ref=xyz
  // https://gotap.vercel.app/user/ABCDE123
  // gotap.vercel.app/ar/user/ABCDE123

  var patterns = [
    /\/user\/([^\/?#]+)/i  // يمسك أي حرف بعد /user/ وينتهي بـ / أو ? أو # أو نهاية السطر
  ];

  for (var i = 0; i < patterns.length; i++) {
    var match = link.match(patterns[i]);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return null;
}

// ===================== تفعيل البروفايل عبر API =====================
function activateProfile(profileId, row) {
  var url = "https://gotap.vercel.app/api/activate-profile";

  // الحصول على الـ secret من Script Properties (أو fallback)
  var secretKey = PropertiesService.getScriptProperties().getProperty("ADMIN_SECRET_KEY");
  if (!secretKey) {
    secretKey = "gotap_activate_2026"; // fallback
    Logger.log("Row " + row + ": ⚠ ADMIN_SECRET_KEY not found in Script Properties — using hardcoded fallback");
  }

  var payload = {
    profileId: profileId,
    secret: secretKey
  };

  var options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true  // ما يرميش exception لو HTTP status > 399
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var statusCode = response.getResponseCode();
    var responseText = response.getContentText();

    if (statusCode === 200) {
      Logger.log("Row " + row + ": ✔ Profile " + profileId + " activated successfully (200)");
    } else {
      // حاولنا نـ parse الـ JSON عشان نشوف رسالة الخطأ من API
      var errorMsg = responseText;
      try {
        var parsed = JSON.parse(responseText);
        if (parsed.error) errorMsg = parsed.error;
      } catch (e) {}

      Logger.log("Row " + row + ": ✘ Failed to activate " + profileId +
                  " — HTTP " + statusCode + ": " + errorMsg);
    }
  } catch (error) {
    Logger.log("Row " + row + ": ✘ NETWORK ERROR activating " + profileId +
               " — " + error.toString());
  }
}

// ===================== دالة مساعدة للتشغيل اليدوي (اختبار) =====================
function testActivateManually() {
  // استخدم هذه الدالة من GAS Editor لتجربة التفعيل يدويًا
  var testProfileId = "XXXXXXXXXXXX"; // ضع Profile ID حقيقي هنا
  activateProfile(testProfileId, 0);
}
