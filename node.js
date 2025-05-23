// This is a Node.js script that converts an HTML file to a PDF and saves it locally

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer'); // You'll need to install this: npm install puppeteer

/**
 * Converts an HTML file to PDF and saves it to the specified output directory
 * @param {string} htmlFilePath - Path to the HTML file
 * @param {string} outputDirectory - Directory where the PDF will be saved
 * @param {string} outputFilename - Name for the output PDF file (default: output.pdf)
 * @param {Object} options - PDF generation options
 * @returns {Promise<string>} - Path to the generated PDF file
 */
async function convertHTMLFileToPDF(htmlFilePath, outputDirectory, outputFilename = 'output.pdf', options = {}) {
  // Check if HTML file exists
  if (!fs.existsSync(htmlFilePath)) {
    throw new Error(`HTML file not found: ${htmlFilePath}`);
  }
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }
  
  // Full path for the output PDF
  const outputPath = path.join(outputDirectory, outputFilename);
  
  // Default PDF options
  const pdfOptions = {
    format: 'A4',
    printBackground: true,
    // margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
    ...options
  };
  
  // Launch browser
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Get the HTML file content
  const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
  
  // Set content to the page
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0',
    // Handle relative paths for resources in the HTML file
    baseURL: `file://${path.dirname(path.resolve(htmlFilePath))}/`
  });
  
  // Generate PDF
  await page.pdf({
    path: outputPath,
    ...pdfOptions
  });
  
  // Close browser
  await browser.close();
  
  console.log(`PDF created successfully at: ${outputPath}`);
  return outputPath;
}

// Example usage
// async function main() {
//   try {
//     const htmlFilePath = 'finnal_marathi_template.html'; // Replace with your HTML file path
//     const outputDirectory = 'downloaded'; // Replace with desired output directory
    
//     await convertHTMLFileToPDF(
//       htmlFilePath,
//       outputDirectory,
//       'document.pdf', // Custom filename
//       { format: 'A4', landscape: false } // Custom options
//     );
//   } catch (error) {
//     console.error('Error converting HTML to PDF:', error);
//   }
// }
async function main() {
  try {
    const htmlFolderPath = path.join(__dirname, 'HTML_Templates/HTMLTemplates_new_version5'); // Folder containing HTML files
    const outputDirectory = path.join(__dirname, 'PDF Leaflets-newv3'); // Output folder

    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }

    const files = fs.readdirSync(htmlFolderPath);
    const htmlFiles = files.filter(file => file.endsWith('.html'));

    for (const file of htmlFiles) {
      const htmlFilePath = path.join(htmlFolderPath, file);
      const outputFileName = file.replace('.html', '.pdf');
      
      await convertHTMLFileToPDF(htmlFilePath, outputDirectory, outputFileName, { format: 'A4', landscape: false });
      console.log(`Converted: ${file} -> ${outputFileName}`);
    }
  } catch (error) {
    console.error('Error converting HTML to PDF:', error);
  }
}

main();
// Run the conversion
// main();