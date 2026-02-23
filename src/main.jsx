import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./app/store.jsx";
import QueryProvider from "./app/QueryProvider.jsx";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <QueryProvider>
      <App />
    </QueryProvider>
  </Provider>,
);
