import React from "react"
const Home = () => {
  return (
    <>
    <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
    <div className="carousel-inner">
    <div className="carousel-item active" data-bs-interval="10000">
      <img src="https://media.istockphoto.com/id/1305169776/photo/q-and-a-concept-yellow-question-mark-glowing-amid-black-question-marks-on-black-background.jpg?s=170667a&w=0&k=20&c=H9umX7spVFPJCBcPrq3OTdfrQJ26DvW1tWZu0XD5lYM=" className="vh-100 vw-100" alt="..."/>
    </div>
    <div className="carousel-item" data-bs-interval="2000">
      <img src="https://t4.ftcdn.net/jpg/02/16/48/05/360_F_216480538_LUzIwmM3f19j40UjY8Hw2f3G7i8HwuV8.jpg" className="vh-100 vw-100" alt="..."/>
    </div>
    <div className="carousel-item">
      <img src="https://t4.ftcdn.net/jpg/02/48/85/01/360_F_248850183_88oqCzTeQKhAGwOeksEHLYRw6HH32gz1.jpg" className="vh-100 vw-100" alt="..."/>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div>
    </>
  )
};

export default Home;
