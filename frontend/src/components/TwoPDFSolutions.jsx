import React, { useState, useEffect } from "react";
import axios from "/config/axiosConfig";

const ContentSection = () => {
  const slug = "home_message";
  
  // Initialize states for SEO data and loading state
  const [seoData, setSeoData] = useState({
    title: "Image To PDF",
    description: "Default description",
    keywords: "default, seo, keywords",
    meta_title: "default, seo, keywords",
    description_full: "description_full",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/public/checkSeoContent", {
          params: { slug },
        });
        // Assuming API response contains SEO meta data
        if (response.data.seo) {
          setSeoData({
            title: response.data.seo.meta_title || "Image To PDF",
            description:
              response.data.seo.meta_description || "Default description",
            keywords: response.data.seo.keywords || "default, seo, keywords",
            meta_title:
              response.data.seo.meta_title || "default, seo, keywords",
            description_full:
              response.data.seo.description_full || "description_full",
          });
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [slug]);

  // Check if loading is true, show loading spinner or message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Main Content Section */}
      <section style={styles.section}>
        <h2 style={styles.heading}>
          <center>
            <div
              className="text-justify"
              dangerouslySetInnerHTML={{
                __html: seoData.meta_title || "Default Meta Title",
              }}
            />
          </center>
        </h2>

        <div
          className="text-justify mt-3" style={{ textAlign: "justify"}}
          dangerouslySetInnerHTML={{
            __html: seoData.description_full || "",
          }}
        />
      
      </section>

     
    </div>
  );
};

// Combined Styles for the component
const styles = {
  container: {
    padding: "0px",
    maxWidth: "1200px",
    margin: "0 auto",
    borderRadius: "0px",
  },
  section: {
    padding: "20px",
  },
  heading: {
    fontSize: "28px",
    color: "#333",
    fontWeight: "600",
    marginBottom: "20px",
    textAlign: "center",
  },
  paragraph: {
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#555",
    marginBottom: "20px",
    textAlign: "justify",
  },
  // Premium section styles
  premiumBlock: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
    padding: "40px 0",
  },
  sectionContainer: {
    maxWidth: "960px",
    margin: "0 auto",
  },
  row: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionItem: {
    textAlign: "center",
  },
  premiumTitle: {
    fontSize: "30px",
    marginBottom: "15px",
  },
  premiumSubtitle: {
    fontSize: "18px",
    marginBottom: "20px",
  },
  premiumButton: {
    padding: "12px 25px",
    backgroundColor: "#ff8c00",
    color: "#fff",
    fontWeight: "bold",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "18px",
  },
  // Trust section styles
  trustBlock: {
    backgroundColor: "#rgb(229, 229, 229)",
    padding: "40px 0",
  },
  containerBlock: {
    maxWidth: "960px",
    margin: "0 auto",
  },
  blockHeader: {
    marginBottom: "30px",
  },
  trustTitle: {
    fontSize: "30px",
    color: "#333",
    textAlign: "center",
    marginBottom: "10px",
  },
  trustSubtitle: {
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
    marginBottom: "20px",
  },
  trustLogos: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  trustIcon: {
    backgroundColor: "#4CAF50",
    padding: "10px 20px",
    borderRadius: "25px",
    color: "#fff",
    fontSize: "14px",
    textAlign: "center",
    cursor: "pointer",
  },
  iconText: {
    fontSize: "16px",
  },
};

export default ContentSection;
