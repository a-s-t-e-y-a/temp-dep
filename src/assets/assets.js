import logo from "./logo.png";
import parcel from "./parcel.png";
import cart from "./cart.png";
import profile from "./profile.png";
import snack1 from "./PRODUCTS/snack1.png";
import snack2 from "./PRODUCTS/snack2.png";
import snack3 from "./PRODUCTS/snack3.png";
import snack4 from "./PRODUCTS/snack4.png";
import snack5 from "./PRODUCTS/snack5.png";
import drop from "./drop.png";
import crunch from "./crunch.png";
import wheat from "./wheat.png";
import Group481 from "./Group481.png";
import Group482 from "./Group482.png";
import Group483 from "./Group483.png";
import Group486 from "./Group486.png";
import Group522 from "./Group522.png";
import Group523 from "./Group523.png";
import adBannerImg4 from "./AdBanner4.png";
import facebook from "./facebook.png";
import instagram from "./instagram.png";
import Front from "./Front.jpg";
import arrow from "./arrow.png";
import namkeen from "./namkeen.png";
import cookies from "./cookies.png";
import munchies from "./munchies.png";
import search from "./search.png";
import logout from "./logout.png";
import logout2 from "./logout2.png";
import notification from "./notification.png";
import booking from "./booking.png";
import user from "./user.png";
import coupon from "./coupon.png";
import marketing from "./marketing.png";
import offer from "./offer.png";
import truck from "./truck.png";
import navigation from "./navigation.png";
import home from "./home.png";
import office from "./office.png";
import flat from "./flat.png";
import target from "./target.png";
import info from "./info.png";
import noConnection from "./noConnection.png";
import bag from "./bag.png";
import edit from "./edit.png";
import Service from "./Service.png";
import delivered from "./delivered.png";
import intransit from "./intransit.png";
import cancelled from "./cancelled.png";
import accept from "./accept.png";
import location from "./location.png";
import marker from "./marker.png";
import upi from "./upi.png";
import sharkTank2 from "./banners/sharkTank2.png";
import sharkTank1 from "./banners/sharkTank1.png";
import emptycart from "./emptycart.png";
import sharkTank1mobile from "./banners-mobile/sharkTank1mobile.png";
import sharkTank2mobile from "./banners-mobile/sharkTank2mobile.png";
import winter from "./banners/winter.gif";
import wintermobile from "./banners-mobile/winter-mobile.gif";

export const assets = {
  banners: [
     {
      id: 0,
      imageUrl: "https://d11a0m43ek7ap8.cloudfront.net/republic day.gif",
      tag2: "",
      active: true,
      actionType: "link",
    },
    // {
    //   id: 1,
    //   imageUrl: "https://d11a0m43ek7ap8.cloudfront.net/lohri website.gif",
    //   link: "https://letstryfoods.com/category/Indian%20Sweets",
    //   tag2: "",
    //   active: true,
    //   actionType: "link",
    // },
    {
      id: 2,
      imageUrl: "https://d11a0m43ek7ap8.cloudfront.net/Web%20Banner.webp",
      link: "https://www.letstryfoods.com/food/694f9a7570879776ef77b313",
      tag2: "",
      active: true,
      actionType: "link",
    },

    { id: 3, imageUrl: winter, tag2: "", active: true, actionType: "" },
    // { id: 4, imageUrl: sharkTank1, tag2: "", active: true, actionType: "" },
    { id: 5, imageUrl: sharkTank2, tag2: "", active: true, actionType: "" },
  ],
  mobileBanners: [
     {
      id: 0,
       imageUrl: "https://d11a0m43ek7ap8.cloudfront.net/republic day mobile.gif",
      tag2: "",
      active: true,
      actionType: "link",
    },
    //   {
    //   id: 0,
    //    imageUrl: "https://d11a0m43ek7ap8.cloudfront.net/lohri responsive.gif",
    //   link: "https://letstryfoods.com/category/Indian%20Sweets",
    //   tag2: "",
    //   active: true,
    //   actionType: "link",
    // },
    {
      id: 1,
      imageUrl: "https://d11a0m43ek7ap8.cloudfront.net/Web%20Banner.webp",
      link: "https://www.letstryfoods.com/food/694f9a7570879776ef77b313",
      tag2: "",
      active: true,
      actionType: "link",
    },

    { id: 2, imageUrl: wintermobile, tag2: "", active: true, actionType: "" },
    {
      id: 3,
      imageUrl: sharkTank1mobile,
      tag2: "",
      active: true,
      actionType: "",
    },
    // {
    //   id: 4,
    //   imageUrl: sharkTank2mobile,
    //   tag2: "",
    //   active: true,
    //   actionType: "",
    // },
  ],

  AdBanner: adBannerImg4,
  logo,
  upi,
  marker,
  info,
  location,
  accept,
  edit,
  delivered,
  intransit,
  cancelled,
  offer,
  office,
  target,
  flat,
  Service,
  home,
  noConnection,
  bag,
  navigation,
  offer,
  office,
  flat,
  home,
  navigation,
  parcel,
  marketing,
  truck,
  marketing,
  truck,
  cart,
  profile,
  snack1,
  logout2,
  notification,
  booking,
  user,
  snack2,
  snack3,
  snack4,
  snack5,
  search,
  drop,
  wheat,
  crunch,
  Group481,
  Group482,
  Group483,
  Group486,
  Group522,
  Group523,
  facebook,
  Front,
  arrow,
  namkeen,
  cookies,
  munchies,
  logout,
  coupon,
  logout,
  coupon,
  instagram,
  emptycart,
};

export const categories = [
  {
    category: "Purani Delhi",
    icon: new URL("./purani delhi.png", import.meta.url).href,
  },
  {
    category: "Munchies",
    icon: new URL("./masalaboondi front.jpg", import.meta.url).href,
  },
  {
    category: "South Range",
    icon: new URL("./Front chocolate.jpg", import.meta.url).href,
  },
  {
    category: "Bhujia & Mixtures",
    icon: new URL("./methi front.jpg", import.meta.url).href,
  },
  {
    category: "Cookies & Rusk",
    icon: new URL("./Copy of Atta jeera front.jpg", import.meta.url).href,
  },
  {
    category: "Chips & Crips",
    icon: new URL("./dal biji usp front-01.jpg", import.meta.url).href,
  },
  {
    category: "Indian Sweets",
    icon: new URL("./masalaboondi front.jpg", import.meta.url).href,
  },
  {
    category: "Dry Fruits & Makhana",
    icon: new URL("./Front chocolate.jpg", import.meta.url).href,
  },
];
