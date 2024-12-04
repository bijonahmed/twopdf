import React, { useState, useEffect } from 'react';
import axios from '/config/axiosConfig';  // Make sure to configure axios
import loaderImage from "../assets/loadergif.gif";

function PdfToPPTConverter() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [pptFile, setPptFile] = useState(null);

    // Handle file input change
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setErrorMessage('');
        setCountdown(5);
        setIsLoading(true);
    };

    // Validate the file to ensure it's a PDF
    const validateFile = (uploadedFile) => {
        const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'pdf') {
            setErrorMessage('Please upload a valid PDF file.');
            setIsLoading(false);
            return false;
        }
        return true;
    };

    // Handle the file upload and PDF-to-PPT conversion
    const handleFileUpload = async () => {
        if (!file || !validateFile(file)) return;

        setLoading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('/public/convert-pdf-to-ppt', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                responseType: 'blob',  // Ensure we receive the file as a blob
            });

            // After the conversion, create a link to download the PPT
            const downloadUrl = URL.createObjectURL(response.data);
            setPptFile(downloadUrl);
        } catch (error) {
            setErrorMessage('Failed to convert PDF to PPT. Please try again.');
        } finally {
            setLoading(false);
            setIsLoading(false);
        }
    };

    // Automatically start countdown and trigger upload
    useEffect(() => {
        if (file && isLoading) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        handleFileUpload();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000); // Decrement countdown every 1 second

            return () => clearInterval(timer); // Cleanup if file changes
        }
    }, [file, isLoading]);

    return (
        <div>
            <div className="tools container-1060" style={{ minHeight: '100vh' }}>
                <div className="tools-top">
                    <div className="tools-top__headlines">
                        <h2 className="title">PDF To PPT</h2>
                        <p className="subtitle">
                            Convert your PDF to a PPT file in seconds.
                        </p>
                    </div>
                    {isLoading && (
                        <div className="loading">
                            <img src={loaderImage} alt="Loading..." />
                            <center>
                                <p>Uploading in {countdown} seconds...</p>
                            </center>
                        </div>
                    )}
                    <div className="upload_group">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="btn_group">
                                <label htmlFor="upload">Select PDF files</label>
                                <input
                                    type="file"
                                    id="upload"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                />
                                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                            </div>
                        </form>
                    </div>
                    {pptFile && (
                        <div>
                            <p>Your PowerPoint is ready!</p>
                            <a href={pptFile} download="converted-presentation.pptx">
                                Download PPT
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PdfToPPTConverter;
