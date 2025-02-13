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
     
    </>
  );
};

export default Torrenttutorial;
