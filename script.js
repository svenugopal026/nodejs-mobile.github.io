let reportData = [];

function addSection() {
  const title = document.getElementById('sectionTitle').value.trim();
  const content = document.getElementById('sectionContent').value.trim();
  const files = document.getElementById('imageUpload').files;

  if (!title || !content) {
    alert("Please fill both fields.");
    return;
  }

  const imagePromises = [];
  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    const promise = new Promise((resolve) => {
      reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(files[i]);
    imagePromises.push(promise);
  }

  Promise.all(imagePromises).then(images => {
    reportData.push({ title, content, images });
    document.getElementById('sectionTitle').value = '';
    document.getElementById('sectionContent').value = '';
    document.getElementById('imageUpload').value = '';
    renderReport();
  });
}

function renderReport() {
  const preview = document.getElementById('reportPreview');
  preview.innerHTML = '';

  reportData.forEach((sec, index) => {
    const div = document.createElement('div');
    div.className = 'section';

    let imgHtml = '';
    sec.images.forEach(img => {
      imgHtml += `<img src="${img}" alt="section image">`;
    });

    div.innerHTML = `
      <h3>${sec.title}</h3>
      <p>${sec.content}</p>
      ${imgHtml}
      <button onclick="deleteSection(${index})">Delete</button>
    `;
    preview.appendChild(div);
  });
}

function deleteSection(index) {
  reportData.splice(index, 1);
  renderReport();
}

function downloadWord() {
  let html = `
    <html><head><meta charset="utf-8"></head><body>
  `;

  reportData.forEach(sec => {
    html += `<h3 style="font-size:12pt;">${sec.title}</h3>`;
    html += `<p style="font-size:10pt;">${sec.content}</p>`;
    sec.images.forEach(img => {
      html += `<div style="text-align:center;"><img src="${img}" style="max-width:300px;"></div>`;
    });
  });

  html += "</body></html>";

  const blob = new Blob([html], {
    type: "application/msword"
  });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "report.doc";
  link.click();
}

function downloadPDF() {
  const win = window.open('', '', 'height=700,width=800');
  win.document.write('<html><head><title>Report PDF</title></head><body>');

  reportData.forEach(sec => {
    win.document.write(`<h3 style="font-size:12pt;">${sec.title}</h3>`);
    win.document.write(`<p style="font-size:10pt;">${sec.content}</p>`);
    sec.images.forEach(img => {
      win.document.write(`<div style="text-align:center;"><img src="${img}" style="max-width:300px;"></div>`);
    });
  });

  win.document.write('</body></html>');
  win.document.close();
  win.print();
}
