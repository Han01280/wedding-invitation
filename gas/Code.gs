// ============================================================
// 구글 시트에 RSVP 응답을 저장하는 Apps Script
// 사용법은 README.md의 "RSVP 구글시트 연동" 항목을 참고하세요.
// ============================================================
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('RSVP');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('RSVP');
    sheet.appendRow(['제출시각', '구분', '참석여부', '식사여부', '성함', '인원', '연락처']);
  }

  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.side || '',
    data.attend || '',
    data.meal || '',
    data.name || '',
    data.count || '',
    data.phone || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
