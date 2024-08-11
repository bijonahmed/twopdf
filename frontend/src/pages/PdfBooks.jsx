
import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import GuestNavbar from "../components/GuestNavbar";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import axios from "/config/axiosConfig";

const Category = () => {
  const { slug } = useParams();
  // Example SEO data; replace with dynamic data as needed
  const seoData = {
    title: `PDF`,
    description: `Explore courses and tutorials in the ${slug} category on My Awesome Website.`,
    keywords: `${slug}, courses, tutorials, My Awesome Website`
  };
  
  const [categorys, setChidCategory] = useState([]);
  const [catName, setCategoryName] = useState();
  const [othersCategorys, setOthersCategorys] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/public/getChildDataParentWise/${slug}`);
        setChidCategory(response.data.result);
        setCategoryName(response.data.name);
        setOthersCategorys(response.data.othersCategory);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    }, []);


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
       
        <main classname="page_content">
        <br/><br/><br/>
  <section className="course_section">
    <div className="container">
      <div className="section_heading">
        <div className="row align-items-center">
          <div className="col col-lg-10">
            <h4 className="heading_text mb-0">
            Most Popular Q&A PDF Study Book
            </h4>
          </div>
          <div className="col col-lg-2">
            search button
          </div>
        </div>
      </div>
      <div className="row">
            <div className="col col-lg-3 col-md-6 col-sm-6">
              <div className="course_item">
                <div className="item_image">
                  <a className="image_wrap" href="#">
                    <img src="assets/images/course/course_img_1.jpg" alt="Education, Online Course, LMS Creative Site Template" />
                  </a>
                </div>
                <div className="item_content">
                  <a className="course_instructor btn_unfill" href="#!">Udemy</a>
                  <h3 className="item_title">
                    <a href="#">
                      Why Learn Intermediate SQL for Marketers?
                    </a>
                  </h3>
                 
                </div>
              </div>
            </div>
            <div className="col col-lg-3 col-md-6 col-sm-6">
              <div className="course_item">
                <div className="item_image">
                 
                  <a className="image_wrap" href="#">
                    <img src="assets/images/course/course_img_2.jpg" alt="Education, Online Course, LMS Creative Site Template" />
                  </a>
                </div>
                <div className="item_content">
                  <a className="course_instructor btn_unfill" href="#!">Udemy</a>
                  <h3 className="item_title">
                    <a href="#">
                      Why Learn Intermediate SQL for Marketers?
                    </a>
                  </h3>
               
                </div>
              </div>
            </div>
            <div className="col col-lg-3 col-md-6 col-sm-6">
              <div className="course_item">
                <div className="item_image">
                
                  <a className="image_wrap" href="#">
                    <img src="assets/images/course/course_img_3.jpg" alt="Education, Online Course, LMS Creative Site Template" />
                  </a>
                </div>
                <div className="item_content">
                  <a className="course_instructor btn_unfill" href="#!">Udemy</a>
                  <h3 className="item_title">
                    <a href="#">
                      Why Learn Intermediate SQL for Marketers?
                    </a>
                  </h3>
                
                </div>
              </div>
            </div>
            <div className="col col-lg-3 col-md-6 col-sm-6">
              <div className="course_item">
                <div className="item_image">
                
                  <a className="image_wrap" href="#">
                    <img src="assets/images/course/course_img_4.jpg" alt="Education, Online Course, LMS Creative Site Template" />
                  </a>
                </div>
                <div className="item_content">
                  <a className="course_instructor btn_unfill" href="#!">Udemy</a>
                  <h3 className="item_title">
                    <a href="#">
                      Why Learn Intermediate SQL for Marketers?
                    </a>
                  </h3>
                 
                </div>
              </div>
            </div>
            <div className="col col-lg-3 col-md-6 col-sm-6">
              <div className="course_item">
                <div className="item_image">
                
                  <a className="image_wrap" href="#">
                    <img src="assets/images/course/course_img_5.jpg" alt="Education, Online Course, LMS Creative Site Template" />
                  </a>
                </div>
                <div className="item_content">
                  <a className="course_instructor btn_unfill" href="#!">Udemy</a>
                  <h3 className="item_title">
                    <a href="#">
                      Why Learn Intermediate SQL for Marketers?
                    </a>
                  </h3>
                 
                </div>
              </div>
            </div>
            <div className="col col-lg-3 col-md-6 col-sm-6">
              <div className="course_item">
                <div className="item_image">
                 
                  <a className="image_wrap" href="#">
                    <img src="assets/images/course/course_img_6.jpg" alt="Education, Online Course, LMS Creative Site Template" />
                  </a>
                </div>
                <div className="item_content">
                  <a className="course_instructor btn_unfill" href="#!">Udemy</a>
                  <h3 className="item_title">
                    <a href="#">
                      Why Learn Intermediate SQL for Marketers?
                    </a>
                  </h3>
                  
                </div>
              </div>
            </div>
            <div className="col col-lg-3 col-md-6 col-sm-6">
              <div className="course_item">
                <div className="item_image">
                
                  <a className="image_wrap" href="#">
                    <img src="assets/images/course/course_img_7.jpg" alt="Education, Online Course, LMS Creative Site Template" />
                  </a>
                </div>
                <div className="item_content">
                  <a className="course_instructor btn_unfill" href="#!">Udemy</a>
                  <h3 className="item_title">
                    <a href="#">
                      Why Learn Intermediate SQL for Marketers?
                    </a>
                  </h3>
                 
                </div>
              </div>
            </div>
            <div className="col col-lg-3 col-md-6 col-sm-6">
              <div className="course_item">
                <div className="item_image">
                 
                  <a className="image_wrap" href="#">
                    <img src="assets/images/course/course_img_8.jpg" alt="Education, Online Course, LMS Creative Site Template" />
                  </a>
                </div>
                <div className="item_content">
                  <a className="course_instructor btn_unfill" href="#!">Udemy</a>
                  <h3 className="item_title">
                    <a href="#">
                      Why Learn Intermediate SQL for Marketers?
                    </a>
                  </h3>
                 
                </div>
              </div>
            </div>
           
          </div>
    </div>
  </section>
  <br/><br/><br/>
</main>


        <Footer />
      </div>
    </>
  );
};

export default Category;
