import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import food1 from "./assets/food1.png";
import food2 from "./assets/food2.png";
import food3 from "./assets/food3.png";

function HeroSlider() {
    return (
        <Swiper
            modules={[Pagination, Autoplay]}
            autoplay={{ delay: 3000 }}
            pagination={{ clickable: true }}
            loop={true}
            className=" w-full h-112.5"
        >
            <SwiperSlide>
                <img
                    src={food1}
                    alt="Food 1"
                    className="w-full h-64 md:h-112.5 object-cover"
                />
            </SwiperSlide>

            <SwiperSlide>
                <img
                    src={food2}
                    alt="Food 2"
                    className="w-full h-64 md:h-112.5 object-cover"
                />
            </SwiperSlide>

            <SwiperSlide>
                <img
                    src={food3}
                    alt="Food 3"
                    className="w-full h-64 md:h-112.5 object-cover"
                />
            </SwiperSlide>
        </Swiper>
    );
}

export default HeroSlider;