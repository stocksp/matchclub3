import toast from "react-hot-toast"

const notify = (message: string, duration: number) =>
  toast(message, {
    duration,
    position: "top-center",
    // Styling
    style: {},
    className: "",
    // Custom Icon
    icon: "👏",
    // Change colors of success/error/loading icon
    iconTheme: {
      primary: "#000",
      secondary: "#fff",
    },
    // Aria
    ariaProps: {
      role: "status",
      "aria-live": "polite",
    },
  })
  export default notify
