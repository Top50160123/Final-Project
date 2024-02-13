const generatePDF = async (userInput, fileName) => {
  try {
    const response = await fetch(`https://final-project-eta-ruby.vercel.app/api/generate-pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput, fileName }),
    });

    if (!response.ok) {
      throw new Error("PDF generation failed");
    }

    const data = await response.json();
    console.log("PDF Generated:", data);
    return { success: true, fileUrl: data.fileUrl };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return { success: false, error: "PDF generation failed" };
  }
}; 

const exportGeneratedPDF = (generatedPdfUrl, currentFileName) => {
  if (generatedPdfUrl) {
    const link = document.createElement("a");
    link.href = generatedPdfUrl;
    link.download = currentFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Additional logic for saving to database if needed
    // try {
    //   await createPdf(user?.uid, currentFileName, userContent, generatedPdfUrl);
    //   await addAction(AddPDF, user?.uid, user?.email, currentFileName, generatedPdfUrl);
    // } catch (error) {
    //   console.error("Error saving PDF to database:", error);
    // }
  } else {
    console.warn("Cannot generate PDF file");
  }
};

export { generatePDF, exportGeneratedPDF };
