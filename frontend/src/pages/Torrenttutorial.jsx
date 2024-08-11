import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import GuestNavbar from "../components/GuestNavbar";
import Pagination from '../components/Pagination'; // Adjust the path as needed
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import axios from "/config/axiosConfig";


const Torrenttutorial = () => {
  const [torrent, setTorrentData] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuerys] = useState("");
  const pageSize = 20; // Adjust page size as needed

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (event) => {
    console.log("=====" + event.target.value);
    setSearchQuerys(event.target.value);
  };

  // Example SEO data; replace with dynamic data as needed
  const seoData = {
    title: `Torrent Tutorial`,
    description: `Explore courses and tutorials in the torrent tutorial on My Awesome Website.`,
    keywords: `Courses, tutorials, My Awesome Website`,
  };

  const fetchData = async () => {
    try {
      setLoading(true); // Set loading to true before fetching data
      const params = {
        page: currentPage,
        pageSize: pageSize,
        searchQuery: searchQuery,
      };

      const urlParams = new URLSearchParams(params).toString();
      const response = await axios.get(`/public/getTorrentTutorial?${urlParams}`
      ); // Pass slug as part of the URL
      setTorrentData(response.data.data);
      setTotalPages(response.data.pagination.last_page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
      </Helmet>

      <GuestNavbar />
      <div className="page_wrapper">
        {/* Back To Top - Start */}
        <div className="backtotop">
          <a href="#" className="scroll">
            <i className="far fa-arrow-up" />
            <i className="far fa-arrow-up" />
          </a>
        </div>

        <main className="page_content mb-0">
        <br/><br/><br/>
          <section className="course_section" style={{ marginBottom: '30px' }}>
            <div className="container">
              <div className="section_heading">
                <div className="row align-items-center">
                  <div className="col col-lg-8">
                    <h5 className="mb-0" style={{ fontSize: '26px;' }}>
                    We have collected 400 TB courses from online.
                    </h5>
                  </div>
                  <div className="col col-lg-4">
                    <form className="aq-form">
                      <div className="form_group">
                      <input type="text" className="form-control" placeholder="Search course..." onKeyUp={handleSearch}/>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="row">
                {loading ? (
                  <center>
                    <div className="spinner-border" />
                  </center>
                ) : (
                  torrent.map((qa, index) => (
                    <div className="col col-lg-3 col-md-6 col-sm-6" key={qa.id}>
                      <div className="course_item">
                        <div className="item_image">
                          <Link className="image_wrap" to={qa.download_link}>
                            <img
                              src="/public/assets/images/course/uTorrent-Pro-tutorial.png"
                              alt="Education, Online Course, LMS Creative Site Template"
                            />
                          </Link>
                        </div>
                        <div className="item_content">
                          <Link className="course_instructor btn_unfill" to={qa.download_link}>
                              {qa.site_name}
                          </Link>
                          <h3 className="item_title">
                            <Link to={qa.download_link}>
                            {qa.name}
                            </Link>
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <br />
            <Pagination 
        totalPages={totalPages} 
        currentPage={currentPage} 
        handlePageChange={handlePageChange} 
      />
          </section>
          <br />
          <br />
          <br />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Torrenttutorial;
