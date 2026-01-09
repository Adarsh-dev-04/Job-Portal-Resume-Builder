import React from 'react'
import { useState,useRef } from 'react'
import ResumeForm from './components/ResumeForm'
import ResumePreview from './components/ResumePreview'
import './App.css'
import {details} from './Data.js'
import PDFDownloadButton from './components/PDFDownloadButton.jsx'
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumePDF } from './components/ResumePdf.jsx';

const App = () => {

  const [formData, setFormData] = useState(details);
  const componentRef = useRef();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Include Navbar */}

      {/* Main Content with proper spacing for navbar */}
      <div className="pt-[0px]min-h-screen bg-orange-200">
        {/* Header */}
        <header className="bg-[#F26522] shadow-lg mb-2">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold text-center sm:text-left">
                Resume Builder
              </h1>
              <div className="flex-shrink-0">
                <PDFDownloadButton formData={formData} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="py-6">
          <div className=" mx-2 flex flex-col xl:flex-row gap-6 min-h-[calc(100vh-200px)]">
            {/* Form Section */}
            <div className="w-full xl:w-1/2">
              <div className="bg-[#FFF9F5] rounded-xl shadow-2xl overflow-hidden p-2 pl-0">
                <div className="p-4 sm:p-6 lg:p-8 max-h-[80vh] overflow-y-auto">
                  <ResumeForm formData={formData} setFormData={setFormData} />
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="w-full xl:w-1/2">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden p-2 pl-0">
                <div
                  ref={componentRef}
                  className="p-4 sm:p-6 lg:p-8 max-h-[80vh] overflow-y-auto"
                >
                  <ResumePreview formData={formData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App
