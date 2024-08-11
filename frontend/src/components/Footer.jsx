// src/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
  <footer className="footer" id="footer">
  <div className="footer-inner">
     
    {/* footer bottom content  */}
    <div className="footer-bottom">
      <div className="footer-bottom__box">
        {/* <div class="footer-bottom__box-logo">
                  <a href="/">
                      <img src="images/logo.png" alt="" class="footer-logo img-fluid">
                  </a>
              </div> */}
        <div className="footer-bottom__box-copyright">
          <center><p>Copyright © 2024 by twopdfcom. All rights reserved.</p></center>
        </div>
      </div>
      {/* socila icons  and links */}
      <div className="footer-bottom__socials"><a className="footer-bottom__socials-item footer-bottom__socials-item-facebook" href="#" target="_blank" rel="noopener noreferrer"><svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 12.067C0 18.033 4.333 22.994 10 24V15.333H7V12H10V9.333C10 6.333 11.933 4.667 14.667 4.667C15.533 4.667 16.467 4.8 17.333 4.933V8H15.8C14.333 8 14 8.733 14 9.667V12H17.2L16.667 15.333H14V24C19.667 22.994 24 18.034 24 12.067C24 5.43 18.6 0 12 0C5.4 0 0 5.43 0 12.067Z" fill="#7D7A85" />
          </svg></a>
        <a className="footer-bottom__socials-item footer-bottom__socials-item-twitter" href="#twitter" target="_blank" rel="noopener noreferrer"><svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 2H22.5057L14.8486 10.4714L23.8571 22H16.8029L11.2786 15.0086L4.95714 22H1.45L9.64143 12.9386L1 2H8.23143L13.2257 8.39143L19 2ZM17.77 19.9686H19.7129L7.17571 3.92429H5.09286L17.77 19.9686Z" fill="#7D7A85" />
          </svg>
        </a>
        <a className="footer-bottom__socials-item footer-bottom__socials-item-youtube" href="#youtube" target="_blank" rel="noopener noreferrer">
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_5666_11482)">
              <path d="M23.5001 6.50708C23.3642 6.02231 23.0995 5.58342 22.7341 5.23708C22.3584 4.88008 21.8979 4.62471 21.3961 4.49508C19.5181 4.00008 11.9941 4.00008 11.9941 4.00008C8.85746 3.96439 5.72156 4.12135 2.60413 4.47008C2.10232 4.60929 1.64269 4.87036 1.26613 5.23008C0.896129 5.58608 0.628129 6.02508 0.488129 6.50608C0.151822 8.31782 -0.0115791 10.1574 0.000128902 12.0001C-0.0118711 13.8411 0.151129 15.6801 0.488129 17.4941C0.625129 17.9731 0.892129 18.4101 1.26313 18.7631C1.63413 19.1161 2.09613 19.3711 2.60413 19.5061C4.50713 20.0001 11.9941 20.0001 11.9941 20.0001C15.1348 20.0358 18.2747 19.8789 21.3961 19.5301C21.8979 19.4004 22.3584 19.1451 22.7341 18.7881C23.0994 18.4418 23.3638 18.0029 23.4991 17.5181C23.8442 15.707 24.012 13.8667 24.0001 12.0231C24.0261 10.1717 23.8585 8.32264 23.5001 6.50608V6.50708ZM9.60213 15.4241V8.57708L15.8621 12.0011L9.60213 15.4241Z" fill="#7D7A85" />
            </g>
            <defs>
              <clipPath id="clip0_5666_11482">
                <rect width={24} height={24} fill="white" />
              </clipPath>
            </defs>
          </svg>
        </a>
        <a className="footer-bottom__socials-item footer-bottom__socials-item-telegram" href="#telegram" target="_blank" rel="noopener noreferrer">
          <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 12C24 18.627 18.627 24 12 24C5.373 24 0 18.627 0 12C0 5.373 5.373 0 12 0C18.627 0 24 5.373 24 12ZM12.43 8.859C11.263 9.344 8.93 10.349 5.432 11.873C4.864 12.099 4.566 12.32 4.539 12.536C4.493 12.902 4.951 13.046 5.573 13.241C5.658 13.268 5.746 13.295 5.836 13.325C6.449 13.524 7.273 13.757 7.701 13.766C8.09 13.774 8.524 13.614 9.003 13.286C12.271 11.079 13.958 9.964 14.064 9.94C14.139 9.923 14.243 9.901 14.313 9.964C14.383 10.026 14.376 10.144 14.369 10.176C14.323 10.369 12.529 12.038 11.599 12.902C11.309 13.171 11.104 13.362 11.062 13.406C10.968 13.503 10.872 13.596 10.78 13.685C10.21 14.233 9.784 14.645 10.804 15.317C11.294 15.64 11.686 15.907 12.077 16.173C12.504 16.464 12.93 16.754 13.482 17.116C13.622 17.208 13.756 17.303 13.887 17.396C14.384 17.751 14.831 18.069 15.383 18.019C15.703 17.989 16.035 17.688 16.203 16.789C16.6 14.663 17.382 10.059 17.563 8.161C17.574 8.00341 17.5673 7.84509 17.543 7.689C17.5285 7.56293 17.4671 7.44693 17.371 7.364C17.228 7.247 17.006 7.222 16.906 7.224C16.455 7.232 15.763 7.473 12.43 8.859Z" fill="#7D7A85" />
          </svg>
        </a>
      </div>
    </div>
  </div></footer>

    </>
  );
};

export default Footer;
