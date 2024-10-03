const pdfUpload = document.getElementById("pdfUpload");
const nameInput = document.getElementById("nameInput");
const xInput = document.getElementById("xInput");
const yInput = document.getElementById("yInput");
const fontSizeInput = document.getElementById("fontSizeInput");
const colorInput = document.getElementById("colorInput");
const generateBtn = document.getElementById("generateBtn");
const pdfDisplay = document.getElementById("pdfDisplay");

let uploadedPdfBytes = null;

// Handle PDF file upload
pdfUpload.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file && file.type === "application/pdf") {
    const reader = new FileReader();

    // Read the uploaded PDF as ArrayBuffer
    reader.onload = function (e) {
      uploadedPdfBytes = e.target.result;
    };

    reader.readAsArrayBuffer(file);
  } else {
    alert("Please upload a valid PDF file.");
  }
});

// Generate PDF on button click
generateBtn.addEventListener("click", generatePdf);

async function generatePdf() {
  const { PDFDocument, rgb } = PDFLib;

  const name = nameInput.value || "Your Name";
  const xCoord = parseFloat(xInput.value) || 150;
  const yCoord = parseFloat(yInput.value) || 200;
  const fontSize = parseFloat(fontSizeInput.value) || 24;

  // Convert the hex color input into RGB values
  const hexColor = colorInput.value;
  const [r, g, b] = hexToRgb(hexColor);

  if (!uploadedPdfBytes) {
    alert("Please upload a PDF file.");
    return;
  }

  // Load the uploaded PDF
  const pdfDoc = await PDFDocument.load(uploadedPdfBytes);

  // Get the first page of the document
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Draw the text with the specified name, coordinates, font size, and color
  firstPage.drawText(name, {
    x: xCoord,
    y: yCoord,
    size: fontSize,
    color: rgb(r / 255, g / 255, b / 255),
  });

  // Save the PDF as a base64 URI and display it in the iframe
  const uri = await pdfDoc.saveAsBase64({ dataUri: true });
  pdfDisplay.src = uri;
}

// Helper function to convert HEX to RGB
function hexToRgb(hex) {
  // Remove the leading '#'
  hex = hex.replace("#", "");

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return [r, g, b];
}
