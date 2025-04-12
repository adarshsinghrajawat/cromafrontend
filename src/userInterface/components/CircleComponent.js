import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { serverURL } from "../../services/FetchNodeServices";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

export default function CircleComponent({ categories }) {
  const theme = useTheme();
  const matches_md = useMediaQuery(theme.breakpoints.down("md")); // Medium devices (e.g., tablets)
  const matches_sm = useMediaQuery(theme.breakpoints.down("sm")); // Small devices (e.g., phones)
  const [zoom, setZoom] = useState(null);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: matches_sm ? 4 : matches_md ? 5 : 8, // 4 for small, 5 for medium, 8 for large screens
    slidesToScroll: 1,
    arrows: !(matches_md || matches_sm), // Arrows visible only on large screens
  };

  const AddSlider = () => {
    return categories.map((item, index) => (
      <div key={index} style={{ width: "100%" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "200px",
              height: "200px",
              borderRadius: "40%",
            }}
          >
            <img
              onMouseEnter={() => setZoom(index)}
              onMouseLeave={() => setZoom(null)}
              src={`${serverURL}/images/${item.image}`}
              alt={`Category ${index}`}
              style={{
                width: zoom === index ? "70%" : "55%", // Adjust zoom effect
                transition: "width 0.3s ease-in-out", // Smooth transition for zoom
              }}
            />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div style={{ width: "80%" }}>
      <Slider {...settings}>{AddSlider()}</Slider>
    </div>
  );
}
