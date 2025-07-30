import React from 'react'
import PdfDropzone from './PDFDrop'

const Upload = () => {
    const handleDroppedPdfs = (files) => {
    console.log("PDFs received from dropzone:", files);}
    return (
        <>
            <div className="mt-10">
                <div className='text-4xl'>Upload Your Report</div>
                <div className='text-1xl text-gray-600 mt-1'>Take the first step towards managing your health with confidence! Securely upload your initial medical report now</div>
                <div className="w-full mt-2">
                    <PdfDropzone onFilesDrop={handleDroppedPdfs} />
                </div>
            </div>
        </>
    )
}

export default Upload