import { AnimatePresence, motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Portal from "./Portal";
import useDisableScroll from "@/hooks/useDisableScroll";
import useKeyPress from "@/hooks/useKeyPress";

const Modal = (props) => {
  const {
    show,
    onClose,
    children,
    className,
    centered = false, // Default is false — modal is scrollable
  } = props;

  // Disable page scroll when modal open
  useDisableScroll(show);
  useKeyPress("Escape", { onPress: () => onClose() });

  return (
    <Portal selector="#modal">
      <AnimatePresence>
        {show && (
          <div>
            {/* backdrop */}
            <motion.div
              className="fixed z-[21] inset-0 bg-[rgba(79,79,79,0.44)] bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { delay: 0.1 } }}
              transition={{ type: "tween", ease: "easeIn" }}
            />
            {/* backdrop */}

            {/* modal wrapper */}
            <motion.div
              onClick={() => onClose && onClose()}
              className={`fixed z-[21] inset-0 max-h-[100vh] w-full flex justify-center overflow-y-auto ${centered ? "items-center" : ""}`}
            >
              {/* modal content */}
              {/* modal width will based on children width, see ContactForm.js for example */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                transition={{ type: "tween", ease: "easeOut" }}
                className={`relative h-fit bg-white rounded-lg my-24 w-fit ${className}`}
              >
                <motion.button
                  type="button"
                  className="absolute right-5 top-5"
                  onClick={() => onClose && onClose()}
                >
                  <IoClose size={24} color="#333" />
                </motion.button>
                {children}
              </motion.div>
              {/* modal content */}
            </motion.div>
            {/* modal */}
          </div>
        )}
      </AnimatePresence>
    </Portal>
  );
};

export default Modal;
