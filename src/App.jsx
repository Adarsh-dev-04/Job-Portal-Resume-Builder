import React from 'react'
import { useState,useRef } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import './App.css'
import {details} from './Data.js'
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from './components/ResumePdf.jsx';

const App = () => {

  const [formData, setFormData] = useState(details);

  const componentRef = useRef();

    // const handleDownload = (e) => {}
    //     // Get the DOM element to be converted to PDF 
    //     e.target.style = "transition: all 0.3s ease-in-out; ";
    //     const input = componentRef.current;
    //     console.log(input);
    //     if (!input) {
    //         return;
    //     }

    //     // Use html2canvas to capture the element
    //     html2canvas(input, { scale: 4 }) // Using scale increases resolution
    //         .then((canvas) => {
    //             const imgData = canvas.toDataURL('image/png');
                
    //             // A4 page dimensions in mm: 210mm wide, 297mm tall
    //             const pdf = new jsPDF({
    //                 orientation: 'portrait',
    //                 unit: 'mm',
    //                 format: 'a4'
    //             });

    //             const pdfWidth = pdf.internal.pageSize.getWidth();
    //             const pdfHeight = pdf.internal.pageSize.getHeight();
    //             const canvasWidth = canvas.width;
    //             const canvasHeight = canvas.height;

    //             // Calculate the aspect ratio to fit the image on the page
    //             const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
    //             const imgWidth = canvasWidth * ratio;
    //             const imgHeight = canvasHeight * ratio;

    //             // Add the image to the PDF
    //             pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                
    //             // Trigger the download
    //             pdf.save(`${formData.name}_resume.pdf`);
    //         });
    // };
  
  return (
    <div className='bg-[#d9ead3]'>
      <div>
        
      </div>
      <h1 className='text-white text-center text-4xl font-bold p-4 bg-[#092b09] relative'>Resume Builder
        {/* <button className="p-2 bg-green-700 text-2xl text-white absolute right-4 top-2.5 rounded-sm cursor-pointer" type="submit" onClick={handleDownload}>Download</button> */}
        <PDFDownloadLink document={<ResumePDF formData={formData} />} fileName={`${formData.name}_resume.pdf`}
        style={{
                    position: 'absolute', 
                    right: '1rem',
                    top: '1rem',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    padding: '5px 10px',
                    color: '#fff',
                    backgroundColor: '#427243ff',
                    borderRadius: '5px',
                }
              }
                >
                {({ blob, url, loading, error }) => 
                    loading ? 'Generating PDF...' : 'Download Resume as PDF 📄'
                }
        </PDFDownloadLink>
      </h1>
      <div className='flex h-screen'>
        <div className='w-1/2 overflow-y-auto p-8 border-r border-gray-300 bg-[#254626]'>
          <ResumeForm formData={formData} setFormData={setFormData} />
        </div>
        <div ref={componentRef} className='w-1/2 overflow-y-auto m-4 p-4 border-1 border-black'>
          <ResumePreview formData={formData} />
        </div>
      </div>
    </div>
  )
}

export default App
