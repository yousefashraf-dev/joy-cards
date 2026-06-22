/**
 * GoTap Ultimate Backend - V15 (Dashboard Only)
 *
 * النسخة النهائية — مع دعم Notes و Profile Link
 *
 * التغييرات في V15:
 * - إضافة حقل "ملاحظات" إلى الـ payload (يرسل من الموقع)
 * - "رابط الملف الشخصي" يُعرض مع زر Copy في Dashboard
 * - متوافق مع ES5 (V8 + Rhino)
 *
 * الـ Dashboard مسؤول عن:
 * - استقبال الطلبات من الموقع (doPost)
 * - عرض الأوردرات في لوحة التحكم (getOrders)
 * - تحديث حالة الدفع/الشحن يدوي (updateOrderColumnStatus)
 * - تعديل/مسح الأوردرات (updateExistingOrder / deleteOrder)
 */


// =========================================================================
// Web App — استقبال الطلبات من الموقع
// =========================================================================
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('لوحة تحكم GoTap الاحترافية')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    var orderData = {};
    try {
      orderData = JSON.parse(e.postData.contents);
    } catch(jsonErr) {
      orderData = e.parameter || {};
    }
    var dynamicInstagramValue = "";
    for (var key in orderData) {
      var lowerKey = key.toLowerCase().trim();
      if (lowerKey.includes("insta") || lowerKey.includes("انستا") || lowerKey.includes("انستجرام")) {
        dynamicInstagramValue = orderData[key];
        break;
      }
    }
    if (dynamicInstagramValue) {
      orderData['يوزر انستجرام'] = cleanInstagram(dynamicInstagramValue);
    }
    var result = addNewOrderWithImage(orderData, null);
    return ContentService.createTextOutput(JSON.stringify({ "status": "success", "result": result }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": err.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}


// =========================================================================
// جلب جميع الأوردرات
// =========================================================================
function getOrders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var headers = data[0].map(function(h) { return h.toString().trim(); });
  var orders = [];
  for (var i = data.length - 1; i >= 1; i--) {
    var hasCustomer = data[i][1] && data[i][1].toString().trim().length > 0;
    if (hasCustomer) {
      var order = {};
      for (var j = 0; j < headers.length; j++) {
        var headerName = headers[j];
        var cellValue = data[i][j];

        // Normalize Instagram column to canonical key regardless of whitespace/spelling
        if (headerName.indexOf("انستجرام") !== -1 || headerName.toLowerCase().indexOf("insta") !== -1) {
          order['يوزر انستجرام'] = cellValue;
          continue;
        }

        if (headerName === "رقم التليفون" || headerName === "رقم الواتساب") {
          var phoneStr = cellValue ? cellValue.toString().trim() : "";
          if (phoneStr.length > 0 && phoneStr.startsWith('1')) {
            phoneStr = '0' + phoneStr;
          }
          order[headerName] = phoneStr;
        } else {
          order[headerName] = cellValue;
        }
      }
      order.rowNum = i + 1;
      orders.push(order);
    }
  }
  return orders;
}


// =========================================================================
// تحديث حالة الدفع / الشحن من لوحة التحكم
// =========================================================================
function updateOrderColumnStatus(rowNum, columnNameKey, statusValue) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (!sheet) return "الشيت غير موجود";

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var targetColumn = -1;
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].toString().trim().indexOf(columnNameKey) !== -1) {
      targetColumn = i + 1;
      break;
    }
  }

  if (targetColumn > 0) {
    sheet.getRange(rowNum, targetColumn).setValue(statusValue);
    return "تم التحديث بنجاح";
  }
  return "العمود غير موجود";
}


// =========================================================================
// تعديل أوردر كامل (بأمان)
// =========================================================================
function updateExistingOrder(rowNum, updatedData) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var rawHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var headers = rawHeaders.map(function(h) { return h.toString().trim(); });
    var currentRowValues = sheet.getRange(rowNum, 1, 1, headers.length).getValues()[0];
    var updatedRow = [];

    for (var i = 0; i < headers.length; i++) {
      var header = headers[i];
      if (header.indexOf("مسلسل") !== -1 || header.toLowerCase().indexOf("id") !== -1) {
        updatedRow.push(currentRowValues[i]);
      } else if (header.indexOf("الدفع") !== -1 || header.indexOf("الشحن") !== -1 || header.indexOf("التصميم") !== -1) {
        updatedRow.push(currentRowValues[i]);
      } else if (updatedData.hasOwnProperty(header)) {
        updatedRow.push(updatedData[header]);
      } else {
        updatedRow.push(currentRowValues[i]);
      }
    }
    sheet.getRange(rowNum, 1, 1, updatedRow.length).setValues([updatedRow]);
    return "نجاح";
  } catch(e) {
    return "خطأ في التعديل: " + e.toString();
  }
}


// =========================================================================
// حذف أوردر
// =========================================================================
function deleteOrder(rowNum) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    sheet.deleteRow(rowNum);
    return "نجاح";
  } catch(e) {
    return "خطأ في المسح: " + e.toString();
  }
}


// =========================================================================
// إضافة أوردر جديد (يستقبل البيانات من doPost)
// =========================================================================
function addNewOrderWithImage(orderData, imageBlobData) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var rawHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var headers = rawHeaders.map(function(h) { return h.toString().trim(); });

    var imageUrl = "";
    if (imageBlobData && imageBlobData.bytes) {
      var decoded = Utilities.base64Decode(imageBlobData.bytes);
      var blob = Utilities.newBlob(decoded, imageBlobData.mimeType, "Logo_" + orderData["اسم العميل"]);
      var file = DriveApp.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      imageUrl = file.getUrl();
    }

    var targetRowIndex = sheet.getLastRow() + 1;
    var newRow = headers.map(function(header) {
      if (header.indexOf("مسلسل") !== -1 || header.toLowerCase().indexOf("id") !== -1) return "";
      if (header.indexOf("تم الدفع") !== -1 || header.indexOf("جاهز للشحن") !== -1) return false;
      if (header === "رابط الملف الشخصي") return orderData["profileLink"] || "";
      if (header === "الإجمالي") return orderData["totalPrice"] || "";
      if (header.indexOf("ملاحظات") !== -1) {
        var notes = orderData[header] || "";
        return notes + (imageUrl ? " | صورة: " + imageUrl : "");
      }
      if (header.indexOf("انستجرام") !== -1 || header.indexOf("انستا") !== -1 || header.toLowerCase().indexOf("insta") !== -1) {
        var rawInsta = "";
        for (var key in orderData) {
          if (key.toLowerCase().indexOf("insta") !== -1 || key.indexOf("انستا") !== -1 || key.indexOf("انستجرام") !== -1) {
            rawInsta = orderData[key];
            break;
          }
        }
        return cleanInstagram(rawInsta);
      }
      return orderData[header] || "";
    });

    sheet.getRange(targetRowIndex, 1, 1, newRow.length).setValues([newRow]);
    insertCheckboxes(sheet, targetRowIndex, headers);
    return "نجاح";
  } catch(e) {
    return "خطأ في الإضافة: " + e.toString();
  }
}

function insertCheckboxes(sheet, rowIndex, headers) {
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].indexOf("تم الدفع") !== -1 || headers[i].indexOf("جاهز للشحن") !== -1) {
      sheet.getRange(rowIndex, i + 1).insertCheckboxes();
    }
  }
}

function cleanInstagram(rawUrl) {
  if (!rawUrl) return "";
  var str = String(rawUrl).trim();
  if (str.indexOf('?') !== -1) str = str.split('?')[0];
  str = str.replace(/\/+$/, "");
  str = str.replace(/^https?:\/\/(www\.)?(instagram\.com|instagr\.am)\//i, "");
  str = str.replace(/^\/+/, "");
  return str;
}
