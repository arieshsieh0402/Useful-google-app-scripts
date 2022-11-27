function myFunction(event) {
    // 紀錄提交表單之 log 檔
    Logger.log(JSON.stringify(event, null, 2))

    // 取得 google 表單資料
    let formData = event.values;
    let timeStamp = formData[0];
    let name = formData[1];
    let phone = formData[2];
    let address = formData[3];
    let email = formData[4];

    // 複製模板文件檔及取得輸出之資料夾路徑後複製一份新文件
    let template = DriveApp.getFileById('yourTemplateId');
    let folder = DriveApp.getFolderById('yourOutputFolderId');
    let copy = template.makeCopy(name + '的訂單', folder);

    // 開啟複製之模板文件
    let doc = DocumentApp.openById(copy.getId());
    let body = doc.getBody();

    // 將表單內容寫入新文件
    body.replaceText('{{timestamp}}', timeStamp);
    body.replaceText('{{name}}', name);
    body.replaceText('{{phone}}', phone);
    body.replaceText('{{address}}', address);

    doc.saveAndClose();

    // 將文件檔轉存成 pdf 並留存
    doc = DocumentApp.openById(doc.getId());
    docBlob = doc.getAs('application/pdf');
    docBlob.setName(doc.getName());
    folder.createFile(docBlob);

    // 寄送 pdf
    MailApp.sendEmail(email, name + " 的訂單(系統回覆)", "您的訂單如附檔", {
      attachments: [doc.getAs('application/pdf')],
      name: 'Automatic Emailer Script'
    });
}
