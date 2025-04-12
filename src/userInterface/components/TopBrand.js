import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { serverURL } from "../../services/FetchNodeServices";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";

export default function TopBrand({ data }) {
    const isSmallScreen = useMediaQuery('(max-width:600px)'); // For very small screens
    const isMediumScreen = useMediaQuery('(max-width:800px)'); // For medium screens
    const [zoom, setZoom] = useState(null);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: isSmallScreen ? 3.5 : isMediumScreen ? 4.5 : 8, // Adjust slides based on screen size
        slidesToScroll: isSmallScreen ? 3 : 6,
        focusOnSelect: true,
        arrows: !isSmallScreen, // Hide arrows for very small screens
        rows: isSmallScreen ? 2 : isMediumScreen ? 2 : 1, // 2 rows for small and medium screens
    };

    function showSlider() {
        return data.map((item, index) => (
            <div key={index} style={{ width: "100%" }}>
                <div
                    style={{
                        width: "100%",
                        height: "150px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        onMouseEnter={() => setZoom(index)}
                        onMouseLeave={() => setZoom(null)}
                        src={`${serverURL}/images/${item.logo}`}
                        alt={`brand-${index}`}
                        style={{
                            borderRadius: "50%",
                            width: zoom === index ? "90%" : "80%",
                            cursor: "pointer",
                            height: zoom === index ? "130px" : "110px",
                            transition: "all 0.3s ease-in-out", // Smooth transition
                        }}
                    />
                </div>
            </div>
        ));
    }

    return (
        <div style={{ width: isSmallScreen ? "95%" : "80%" }}>
            <div
                style={{
                    fontWeight: "bolder",
                    fontSize: 26,
                    color: "#fff",
                    margin: "10px 0px 10px 0px",
                }}
            >
                Top Brands
            </div>
            <Slider {...settings}>{showSlider()}</Slider>
        </div>
    );
}
