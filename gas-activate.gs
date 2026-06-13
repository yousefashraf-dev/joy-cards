/**
 * GoTap — Profile Auto-Activation Script
 * Paste this code in your GAS project (Extensions > Apps Script)
 * 
 * ثم اذهب إلى Triggers (الساعة) → Add Trigger:
 *   - Choose function: onPaymentEdit
 *   - Event source: On change
 *   - Event type: On edit
 */

// Column positions (based on V12 payload order)
// عدّل الأرقام حسب ترتيب الأعمدة في شيتك
var COL_PAID = 8;        // عمود "تم الدفع" (العمود H)
var COL_PROFILE_LINK = 11; // عمود "رابط الملف الشخصي" (العمود K)
var SHEET_NAME = "Sheet1"; // اسم الشيت

function onPaymentEdit(e) {
  var range = e.range;
  var row = range.getRow();
  var col = range.getColumn();
  var sheet = range.getSheet();

  // Only run on the correct sheet and column
  if (sheet.getName() !== SHEET_NAME) return;
  if (col !== COL_PAID) return;

  var newValue = range.getValue();

  // Only activate when changed from false to true
  if (newValue === true || newValue === "TRUE" || newValue === "true") {
    var profileLink = sheet.getRange(row, COL_PROFILE_LINK).getValue();

    if (!profileLink) {
      Logger.log("Row " + row + ": No profile link found");
      return;
    }

    // Extract profile ID from URL like: https://gotap.vercel.app/ar/user/XXXXX
    var parts = profileLink.toString().split("/user/");
    if (parts.length < 2) {
      Logger.log("Row " + row + ": Invalid profile link format");
      return;
    }

    var profileId = parts[1].split("?")[0].split("#")[0].trim();

    if (profileId) {
      activateProfile(profileId, row);
    }
  }
}

function activateProfile(profileId, row) {
  var url = "https://gotap.vercel.app/api/activate-profile";

  var payload = {
    profileId: profileId,
    secret: "gotap_activate_2026"
  };

  var options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    var response = UrlFetchApp.fetch(url, options);
    var result = JSON.parse(response.getContentText());
    Logger.log("Row " + row + ": Profile " + profileId + " activated - " + JSON.stringify(result));
  } catch (error) {
    Logger.log("Row " + row + ": ERROR activating " + profileId + " - " + error.toString());
  }
}
