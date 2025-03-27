import React, { useState, useEffect } from "react";
import loaderImage from "../assets/loadergif.gif";
import jsPDF from "jspdf";
import "../components/css/ImageToPDF.css";
import PDFTools from "../components/PDFTools.jsx";

const ImageToPDF = ({ description }) => {
  const [images, setImages] = useState([]); // Store multiple images
  const [isLoading, setIsLoading] = useState(false); // To control the loading state
  const [countdown, setCountdown] = useState(5); // Countdown time

  const handleImageUpload = (e) => {
    const files = e.target.files; // Get the selected files
    setIsLoading(true); // Start loading
    setCountdown(5); // Reset countdown

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image")
    );

    if (imageFiles.length > 0) {
      const imagePreviews = imageFiles.map((file) => {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file); // Read the image file
        });
      });

      Promise.all(imagePreviews).then((imagesData) => {
        setImages(imagesData); // Set all image previews
        setIsLoading(false); // Stop loading after images are loaded
      });
    } else {
      alert("Please upload valid images.");
      setIsLoading(false); // Stop loading if files are not images
    }
  };

  const handleGeneratePDF = () => {
    setIsLoading(true);
    if (images.length === 0) {
      alert("Please upload images first.");
      return;
    }

    const pdf = new jsPDF();
    images.forEach((image, index) => {
      const img = new Image();
      img.src = image;

      img.onload = () => {
        const imgWidth = 180; // Adjust the width as needed
        const imgHeight = (img.height * imgWidth) / img.width;

        if (index > 0) {
          pdf.addPage(); // Add a new page for each image
        }

        pdf.addImage(img, "PNG", 10, 10, imgWidth, imgHeight);
        if (index === images.length - 1) {
          pdf.save("generated.pdf"); // Save the generated PDF
          setIsLoading(false); // Stop loading when PDF is saved
        }
      };

      img.onerror = () => {
        alert("Error loading the image.");
        setIsLoading(false); // Stop loading if error occurs
      };
    });
  };

  // Automatically trigger PDF generation after countdown
  useEffect(() => {
    if (isLoading && images.length > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            handleGeneratePDF(); // Trigger PDF generation after countdown finishes
            setCountdown(0); // Set countdown to 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer); // Cleanup when countdown finishes
    }
  }, [images, isLoading]); // Trigger effect when images or loading state changes

  return (
    <div className="tools container-1060" style={{ minHeight: "100vh" }}>
      <div className="tools-top__headlines">
        <h2 className="title">Image to PDF</h2>
      </div>
      <div style={{textAlign: "center" }}>
        {isLoading && (
          <div className="loading">
            <img src={loaderImage} alt="Loading..." />
            <p>Uploading in {countdown} seconds...</p>
          </div>
        )}
        <div className="upload-area text-center mt-1" onClick={() => document.getElementById("upload").click()}>
          <p className="upload-instruction"> Convert your Images to a PDF file in seconds.</p>

          {/* File input for image upload */}
          <div className="upload_group">
            <div className="btn_group">
              <label htmlFor="upload">Select Images</label>
              <input
                type="file"
                id="upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
               
              />
            </div>
          </div>
        </div>

        {/* Display uploaded image previews */}
        {images.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {images.map((image, index) => (
              <div key={index} style={{ margin: "10px" }}>
                <img
                  src={image}
                  alt={`Uploaded ${index}`}
                  style={{
                    width: "150px", // Adjusted width for better view
                    height: "auto",
                    borderRadius: "10px", // Rounded corners for the image
                    border: "2px solid #4CAF50", // Green border for the image
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)", // Subtle shadow around the image
                    transition: "transform 0.3s ease", // Smooth transition for hover effect
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "scale(1.05)"; // Slight zoom on hover
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "scale(1)"; // Reset zoom on mouse out
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Button to generate PDF */}
        <center>
          <button
            onClick={handleGeneratePDF}
            disabled={isLoading || images.length === 0} // Disable button while loading or no image
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px", // Rounded corners for the button
              fontWeight: "bold", // Make the text bold
            }}
          >
            {isLoading ? "Generating PDF..." : "Generate PDF"}
          </button>
        </center>
      </div>
      <h1>
        <div
          className="text-justify mt-2"
          dangerouslySetInnerHTML={{
            __html: description.meta_title || "Default Meta Title",
          }}
        />
      </h1>
      <div
        className="text-justify mt-3" style={{ textAlign: "justify"}}
        dangerouslySetInnerHTML={{
          __html: description.description_full || "Default Full Description",
        }}
      />
       <div className="container mt-lg-4">
            <PDFTools />
          </div>
    </div>

    
  );
};

export default ImageToPDF;
