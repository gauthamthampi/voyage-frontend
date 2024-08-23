import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from 'next/link';


const BannerFront = () => {
  return (
    <section className="bg-gradient-to-r from-slate-950 to-cyan-400 shadow-lg">
     <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
  <div className="mr-auto place-self-center lg:col-span-7 flex flex-col ">
    <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-white">
      Celebrate your <br /> vacation with us.
    </h1>
    <p className="max-w-2xl mb-6 font-light text-gray-300 lg:mb-8 md:text-lg lg:text-xl ">
      Enjoy seamless scheduling, automated reminders, and real-time availability from any device. Simplify your room reservations today!
    </p>

<Link href="/explore">
  <button className="relative flex h-[50px] w-40 items-center justify-center overflow-hidden bg-blue-600 font-medium text-white shadow-2xl transition-all duration-300 before:absolute before:inset-0 before:border-0 before:border-white before:duration-100 before:ease-linear rounded-full hover:bg-white hover:text-blue-600 hover:shadow-blue-600 hover:before:border-[25px]">
    <span className="relative z-10">{`Explore Now >>`}</span>
  </button>
</Link>

  </div>
  <div className="hidden lg:mt-0 lg:col-span-5 lg:flex justify-center items-center">
    <div className="loader2">
      {[...Array(20)].map((_, i) => (
        <span key={i} style={{ '--i': i + 1 }}></span>
      ))}
      <div className="plane">
        <i className="fas fa-plane"></i>
      </div>
    </div>
  </div>
</div>

      
      <style jsx>{`

      *{
  margin: 0
  padding: 0
  box-sizing: border-box
      }
body {
  display: flex
  justify-content: center
  align-items: center
  min-height: 100vh
  background: ##ffffff
      }
  .loader {
    margin-left: 75px
    padding: 30px 0
    width: 150px
    height: 150px
    border: 1px solid rgba(125, 125, 125, 0.15)
    border-radius: 100%
      }
  .hide{
    display: none
      }    
    .loader2 {
          position: relative;
          width: 120px;
          height: 120px;
          animation: rotating 2s linear infinite;
        }

         span{
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      transform: rotate(calc(18deg * var(--i)))
      }

      &:before {
        content: ""
        position: absolute
        top: 0
        left: 0
        width: 15px
        height: 15px
        background: #f0ad4e
        border-radius: 50%
        transform: scale(0)
        animation: animate 2s linear infinite
        animation-delay: calc(0.1s * var(--i))
      }
        .loader2 .plane {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(0deg);
          z-index: 10;
        }

        .loader2 .plane i {
          color: #ffffff;
          font-size: 60px;
          transform: rotate(180deg);
        }

        .loader2 span {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          transform-origin: 0 0;
          transform: rotate(calc(18deg * var(--i))) translate(-50%, -50%);
          z-index: 1;
        }

        .loader2 span:before {
          content: "";
          position: absolute;
          width: 15px;
          height: 15px;
          background: #ffffff;
          border-radius: 50%;
          animation: animate 2s linear infinite;
          animation-delay: calc(0.1s * var(--i));
        }

        @keyframes animate {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          80%,
          100% {
            transform: scale(0);
          }
        }

        @keyframes rotating {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default BannerFront;
