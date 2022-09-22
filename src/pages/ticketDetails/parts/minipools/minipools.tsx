import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ItemTicket from "../../../../components/tickets/item";

function MiniPools(props: any) {
  const [swiper, setSwiper] = useState(null);

  const backSlider = () => {
    if (swiper) {
      const controller: any = swiper;
      controller.slidePrev();
    }
  };
  const nextSlider = () => {
    if (swiper) {
      const controller: any = swiper;
      controller.slideNext();
    }
  };

  return (
    <div className="minipoolScreen">
      <h2>Other minipools</h2>
      <div className="rowTitle">
        <h4>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium
        </h4>
        <div className="containerbuttonSlider">
          <div className="buttonSlider" onClick={backSlider}>
            &lt;
          </div>
          <div className="buttonSlider" onClick={nextSlider}>
            &gt;
          </div>
        </div>
      </div>
      <div className="sliderContainer">
        <Swiper
          onSwiper={(s: any) => {
            setSwiper(s);
          }}
          className="mySwiper"
          slidesPerView={window.screen.width > 500 ? 4.5 : 2}
        >
          <SwiperSlide>
            <ItemTicket {...props} />
          </SwiperSlide>
          <SwiperSlide>
            <ItemTicket {...props} />
          </SwiperSlide>
          <SwiperSlide>
            <ItemTicket {...props} />
          </SwiperSlide>
          <SwiperSlide>
            <ItemTicket {...props} />
          </SwiperSlide>
          <SwiperSlide>
            <ItemTicket {...props} />
          </SwiperSlide>
          <SwiperSlide>
            <ItemTicket {...props} />
          </SwiperSlide>
          <SwiperSlide>
            <ItemTicket {...props} />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default MiniPools;
