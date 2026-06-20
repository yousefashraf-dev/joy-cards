function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('GoTap Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      data["اسم العميل"] || "",
      data["رقم التليفون"] || "",
      data["العنوان بالتفصيل"] || "",
      data["يوزر انستجرام"] || "",
      data["ملاحظات"] || "",
      data["رقم الواتساب"] || "",
      data["رابط الملف الشخصي"] || ""
    ]);
    return ContentService.createTextOutput('{"status":"success"}')
      .setMimeType(ContentService.MimeType.JSON);
  } catch(e) {
    return ContentService.createTextOutput(
      JSON.stringify({status:"error", message:e.toString()})
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function(h) { return h.toString().trim(); });
  var orders = [];

  for (var i = data.length - 1; i >= 1; i--) {
    var row = data[i];
    var order = {};
    for (var j = 0; j < headers.length; j++) {
      var headerName = headers[j];
      var cellValue = row[j];

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
  return JSON.stringify(orders);
}

function updateOrderColumnStatus(rowNum, keyName, newValue) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (var i = 0; i < headers.length; i++) {
    if (headers[i].toString().trim().indexOf(keyName) !== -1) {
      sheet.getRange(rowNum, i + 1).setValue(newValue);
      return "نجاح";
    }
  }
  return "العمود مش موجود";
}

function updateExistingOrder(rowNum, updatedData) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var oldRow = sheet.getRange(rowNum, 1, 1, headers.length).getValues()[0];
  var newRow = [];

  for (var j = 0; j < headers.length; j++) {
    var h = headers[j].toString().trim();
    if (h.indexOf("مسلسل") !== -1) {
      newRow.push(oldRow[j]);
    } else if (updatedData[h] !== undefined) {
      newRow.push(updatedData[h]);
    } else {
      newRow.push(oldRow[j]);
    }
  }
  sheet.getRange(rowNum, 1, 1, newRow.length).setValues([newRow]);
  return "نجاح";
}

function deleteOrder(rowNum) {
  try {
    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().deleteRow(rowNum);
    return "نجاح";
  } catch(e) {
    return "خطأ: " + e.toString();
  }
}
