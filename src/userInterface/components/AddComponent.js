import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { serverURL } from "../../services/FetchNodeServices";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function AddComponent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Mobile devices
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // Tablet devices

    // Adjust slidesToShow based on screen size
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: isMobile ? 1 : isTablet ? 2 : 2, // 1 slide for mobile, 2 for tablet, 3 for desktop
        slidesToScroll: 1,
        arrows: !isMobile, // Show arrows only for non-mobile devices
    };

    const data = [
        "banner1.webp",
        "banner2.webp",
        "banner1.webp",
        "banner2.webp",
        "banner1.webp",
        "banner2.webp",
    ];

    const AddSlider = () => {
        return data.map((item, index) => (
            <div key={index} style={{ width: "100%" }}>
                <img
                    src={`${serverURL}/images/${item}`}
                    alt={`Slide ${index}`}
                    style={{ width: "98%", margin: "5px" }}
                />
            </div>
        ));
    };

    return (
        <div style={{ width: "80%" }}>
            <Slider {...settings}>{AddSlider()}</Slider>
        </div>
    );
}
