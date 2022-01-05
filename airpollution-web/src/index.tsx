import React from "react";
import ReactDOM from "react-dom";
// Styles
import "aos/dist/aos.css";
import "animate.css";
import "./assets/css/tailwind.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "./assets/css/styles.css";
// App
const App = React.lazy(() => import("./App"));

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<div>Yükleniyor</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById("root")
);
