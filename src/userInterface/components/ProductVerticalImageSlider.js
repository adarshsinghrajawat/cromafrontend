import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { serverURL } from "../../services/FetchNodeServices";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { Checkbox, useMediaQuery } from "@mui/material";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { makeStyles } from "@mui/styles";
import { useState, useEffect } from "react";

const useStyles = makeStyles({
    carouselDots: {
        "& .slick-dots li.slick-active button:before": {
            color: "#fff",
            opacity: 1,
        },
        "& .slick-dots li button::before": {
            fontSize: "7px",
            color: "#fff",
            opacity: 0.4,
        },
        "& .slick-dots li": {
            margin: "2% -2px",
        },
    },
});

function ProductVerticalImageSlider({ product }) {
    const matches_md = useMediaQuery("(max-width:800px)");
    const matches_sm = useMediaQuery("(max-width:400px)");
    const classes = useStyles();
    const data = product?.picture.split(",") || [];
    const [image, setImage] = useState("");

    useEffect(() => {
        setImage(data[0] || ""); // Default to the first image
    }, [product]);

    const settings = {
        dots: matches_md, // Show dots only for medium or smaller screens
        infinite: true,
        speed: 500,
        slidesToShow: matches_sm ? 1 : matches_md ? 2 : 4, // Adjust slides to show based on screen size
        slidesToScroll: 1,
        arrows: !matches_sm, // Hide arrows for small screens
    };

    const handleImageChange = (item) => setImage(item);

    const showSlider = () =>
        data.map((item, index) => (
            <div
                key={index}
                onClick={() => handleImageChange(item)}
                style={{ width: "100%" }}
            >
                <img
                    src={`${serverURL}/images/${item}`}
                    alt={`product-${index}`}
                    style={{
                        borderRadius: "5px",
                        border: matches_md ? "" : "0.5px solid #9A9A9A",
                        transform: matches_md ? "" : "rotate(-90deg)",
                    }}
                    width="90%"
                    height="90%"
                />
            </div>
        ));

    return (
        <div
            style={{
                width: matches_sm ? "95%" : "100%",
                display: "flex",
                flexDirection: matches_md ? "column" : "row",
                position: matches_md ? "static" : "sticky",
                top: 65,
            }}
        >
            {/* Main Image Section */}
            <div
                style={{
                    width: matches_md ? "100%" : "60%",
                    transform: matches_md ? "rotate(0deg)" : "rotate(90deg)",
                    marginLeft: matches_md ? "unset" : "auto",
                    marginRight: matches_md ? "unset" : "5%",
                    marginTop: matches_md ? "unset" : "5%",
                }}
            >
                {/* Like and Share Icons for Small Screens */}
                {matches_md && (
                    <div style={{ width: "100%", display: "flex", marginTop: "3%" }}>
                        <Checkbox
                            style={{ color: "#fff" }}
                            icon={<FavoriteBorder />}
                            checkedIcon={<Favorite />}
                        />
                        <ShareOutlinedIcon
                            style={{
                                color: "#fff",
                                marginLeft: "10px",
                                marginTop: "10px",
                            }}
                        />
                    </div>
                )}

                {/* Main Image */}
                {!matches_md && (
                    <div
                        style={{
                            transform: matches_md ? "none" : "rotate(-90deg)",
                            width: "100%",
                            display: "flex",
                            justifyContent: "right",
                        }}
                    >
                        <img
                            src={`${serverURL}/images/${image}`}
                            alt="main-product"
                            width="80%"
                            height="80%"
                        />
                    </div>
                )}

                {/* Slider Section */}
                <div
                    style={{
                        width: "100%",
                        display: matches_md ? "flex" : "block",
                        justifyContent: matches_md ? "center" : "unset",
                    }}
                >
                    <Slider
                        {...settings}
                        className={classes.carouselDots}
                        style={{ width: matches_md ? "50%" : "unset" }}
                    >
                        {showSlider()}
                    </Slider>
                </div>
            </div>

            {/* Like and Share Icons for Large Screens */}
            {!matches_md && (
                <div
                    style={{
                        width: "15%",
                        display: "flex",
                        marginTop: "3%",
                    }}
                >
                    <Checkbox
                        style={{ color: "#fff" }}
                        icon={<FavoriteBorder style={{ fontSize: "2vw" }} />}
                        checkedIcon={<Favorite />}
                    />
                    <ShareOutlinedIcon
                        style={{
                            color: "#fff",
                            marginLeft: "10px",
                            marginTop: "10px",
                            fontSize: "2vw",
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default ProductVerticalImageSlider;
