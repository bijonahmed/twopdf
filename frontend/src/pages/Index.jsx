import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "/config/axiosConfig";
import GuestNavbar from "../components/GuestNavbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import "../components/css/Index.css";

const Index = () => {
  const [title, setTitle] = useState(""); // ✅ Hooks moved inside component
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const slug = "home_message";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/public/checkSeoContent", {
          params: { slug },
        });

        console.log("===" + response.data);

        if (response.data && response.data.seo) {
          setTitle(response.data.seo.meta_title || "Default Title");
          setDescription(response.data.seo.description_full || "Default Full Description");
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [slug]);

  const pdfTools = [
    { title: "Merge PDF", path: "/pdf/margepdf", img: "/images/merge_pdf.png", description: "Combine PDFs in the order you want with the easiest PDF merger available." },
    { title: "Split PDF", path: "/pdf/splitpdf", img: "/images/spilt_pdf.webp", description: "Separate one page or a whole set for easy conversion into independent PDF files." },
    { title: "ZIP PDF", path: "/pdf/pdfzip", img: "/images/zip_pdf.png", description: "Reduce file size while optimizing for maximal PDF quality." },
    { title: "PDF to Text", path: "/pdf/pdftotxt", img: "/images/pdf-to-txt.png", description: "Easily convert your PDF files into easy to edit txt. The document is almost 100% accurate." },
    { title: "PDF to PPT", path: "/pdf/pdftoppt", img: "/images/pdf_to_ppt.png", description: "Turn your PDF files into easy-to-edit PPT and PPTX slideshows." },
    { title: "Image to PDF", path: "/pdf/imgtopdf", img: "/images/image_to_pdf.png", description: "Pull data straight from images to PDF making within seconds." },
    { title: "Protect PDF", path: "/pdf/protectpdf", img: "/images/proted_pdf.png", description: "Protect PDF files with a password to prevent unauthorized access." },
    { title: "Watermark", path: "/pdf/watermarkpdf", img: "/images/watermark_pdf.png", description: "Stamp an image or text over your PDF in seconds." },
    { title: "Word to PDF", path: "/pdf/word-to-pdf", img: "/images/word-to-pdf.png", description: "Convert DOC and DOCX files to PDF for easier reading." },
    { title: "PPT to PDF", path: "/pdf/ppt-to-pdf", img: "/images/PPT_to_PDF.png", description: "Convert PPT and PPTX slideshows into PDF format for easy viewing." },
    { title: "Excel to PDF", path: "/pdf/excel-to-pdf", img: "/images/excel-to-pdf.png", description: "Make Excel spreadsheets easy to read by converting them to PDF." },
    { title: "PDF to JPG", path: "/pdf/pdf-to-jpg", img: "/images/pdf_to_jpg.png", description: "Convert each PDF page into a JPG or extract all images in a PDF." },
    { title: "Rotate PDF", path: "/pdf/rotate-pdf", img: "/images/rotate_pdf.png", description: "Rotate your PDFs the way you need them. Even rotate multiple PDFs at once!" },
    { title: "HTML to PDF", path: "/pdf/html-to-pdf", img: "/images/html_to_pdf.svg", description: "Convert webpages in HTML to PDF. Copy and paste the URL of the page." },
    { title: "Compress PDF", path: "/pdf/compress-pdf", img: "/images/compress_pdf.webp", description: "Compress PDF" },
    { title: "PDF Viewer", path: "/pdf/pdf-viewer", img: "/images/pdf-converter-pro-banner.png", description: "Compress Viewer for reading" }
  ];

  return (
    <div>
      <GuestNavbar />
      <div className="tools container-1060">
        <div className="tools-top">
          <div className="container">
            <div className="row justify-content-center">
              <div className="tools-top__headlines">
                <h2 className="title">{"All-in-one AI-powered PDF tools, 100% FREE and easy to use!"}</h2>
                <p className="subtitle">
                  Discover a complete suite of PDF tools right at your fingertips! Our services are 100% FREE and
                  incredibly easy to use. Seamlessly merge, split, compress, convert, rotate, unlock, and watermark PDFs with just a few clicks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container">
          <div className="row" style={{ marginTop: "-50px" }}>
            <div className="col-md-12">
              <div className="content_container">
                {pdfTools.map((tool, index) => (
                  <div className="content_box" key={index}>
                    <Link to={tool.path}>
                      <div className="box_top">
                        <div className="top_icon mt-3">
                          <img src={tool.img} alt={tool.title} style={{ width: "120px" }} />
                        </div>
                        <h3>{tool.title}</h3>
                        <p>{tool.description}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>



          <h1>
          <center><div
            className="text-justify"
            dangerouslySetInnerHTML={{
              __html: title || "Default Meta Title",
            }}
          /></center>
        </h1>

          <div
        className="text-justify mt-3 p-2"
        style={{ textAlign: "justify" }}
        dangerouslySetInnerHTML={{
          __html: description || "Default Full Description",
        }}
      />
        </div>
      </section>

     

      <Footer />
    </div>
  );
};

export default Index;
