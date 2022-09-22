import React, { useState, useEffect, useRef } from "react";
import Mainlogo from "../../assets/logos/main.svg";
import Languague from "../../assets/icons/languague.svg";
import "./styles.scss";
import Button from "../Buttons";
import Logo from "../logo";
import ConnectWallet from "../Buttons/connectWallet/index";
import { useTranslation } from "react-i18next";
import DropDown from "../DropDown";

function NavBar() {
  const { i18n, t } = useTranslation();
  const [openDrop, setOpenDrop] = useState(false);
  const [mobileWidth, setMobileWidth] = useState(window.screen.width > 950);
  const openDropDown = () => {
    setOpenDrop(!openDrop);
  };

  const changeLanguageES = () => {
    i18n.changeLanguage("es");
    setOpenDrop(false);
  };
  const changeLanguageEN = () => {
    i18n.changeLanguage("en");
    setOpenDrop(false);
  };

  let menuRefDrop: any = useRef();

  useEffect(() => {
    let handler = (event: any) => {
      if (menuRefDrop.current && !menuRefDrop.current.contains(event?.target)) {
        setOpenDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    if (window.screen.width < 950) {
      setMobileWidth(true);
    } else {
      setMobileWidth(false);
    }
  };

  return (
    <div>
      {/* FOR HORIZONTAL RESOLUTIONS */}
      {window.screen.width > 950 ? (
        <div className="containerNavBar landpages">
          <div>
            <Logo />
          </div>
          <div className="containerItems">
            <div ref={menuRefDrop} className="containerSelecLanguage">
              <div>
                <div className="containerSelecLanguageImage">
                  <img src={Languague} onClick={openDropDown} />
                </div>
                {openDrop && (
                  <DropDown
                    changeLanguageES={changeLanguageES}
                    changeLanguageEN={changeLanguageEN}
                    setOpenDrop={setOpenDrop}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="containerNavBar phones">
          <Logo />
          <div ref={menuRefDrop}>
            <img id="ImgLangague" src={Languague} onClick={openDropDown} />

            {openDrop && (
              <DropDown
                changeLanguageES={changeLanguageES}
                changeLanguageEN={changeLanguageEN}
                setOpenDrop={setOpenDrop}
              />
            )}
          </div>
        </div>
      )}

      {/* FOR PHONES RESOLUTIONS */}
    </div>
  );
}

export default NavBar;
