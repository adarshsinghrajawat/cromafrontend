import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { serverURL } from "../../services/FetchNodeServices";
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function MainSlider({ banners }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Mobile devices
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // Tablet devices

    const settings = {
        dots: true, // Enable dots for better navigation on smaller screens
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: !isMobile, // Show arrows only for larger devices
    };

    const showSlider = () => {
        return banners.map((item, index) => (
            <div key={index}>
                <img
                    src={`${serverURL}/images/${item}`}
                    alt={`Banner ${index}`}
                    style={{ width: '100%', height: isMobile ? "30vh" : isTablet ? "40vh" : "50vh" }}
                />
            </div>
        ));
    };

    return (
        <div style={{ width: '95%', margin: 'auto' }}>
            <Slider {...settings}>
                {showSlider()}
            </Slider>
        </div>
    );
}
