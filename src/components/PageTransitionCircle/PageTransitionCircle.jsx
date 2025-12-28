// // PageTransitionCircle.jsx
// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// const transition = {
//   duration: 0.6,
//   ease: "easeInOut",
// };

// const maskVariants = {
//   initial: {
//     clipPath: "circle(0% at 50% 50%)",
//   },
//   expand: {
//     clipPath: "circle(150% at 50% 50%)",
//     transition,
//   },
//   collapse: {
//     clipPath: "circle(0% at 50% 50%)",
//     transition,
//   },
// };

// const PageTransitionCircle = () => {
//   const [animationPhase, setAnimationPhase] = useState("initial");
//   const [show, setShow] = useState(true);

//   useEffect(() => {
//     // Start expand
//     setAnimationPhase("expand");

//     // Collapse after a moment
//     const collapseTimer = setTimeout(() => {
//       setAnimationPhase("collapse");
//     }, 1200);

//     // Remove completely
//     const endTimer = setTimeout(() => {
//       setShow(false);
//     }, 2000);

//     return () => {
//       clearTimeout(collapseTimer);
//       clearTimeout(endTimer);
//     };
//   }, []);

//   return (
//     <AnimatePresence>
//       {show && (
//        <motion.div
//   className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FECC0B]" 
//   initial="initial"
//   animate={animationPhase}
//   exit="collapse"
//   variants={maskVariants}
//   style={{
//     WebkitClipPath: "circle(0% at 50% 50%)",
//   }}
// >
//   <motion.span
//     className="text-black text-[48px] font-bold"
//     initial={{ opacity: 0 }}
//     animate={{ opacity: 1 }}
//     exit={{ opacity: 0 }}
//     transition={{ duration: 0.8 }}
//   >
//     Let&apos;s Try
//   </motion.span>
// </motion.div>

//       )}
//     </AnimatePresence>
//   );
// };

// export default PageTransitionCircle;
