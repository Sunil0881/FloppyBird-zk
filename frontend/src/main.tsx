import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from 'react-redux'
import { store } from './Redux/store'
import "./index.css";
import { Web3ModalProvider } from "./web3.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Web3ModalProvider>
    <Provider store={store}>
      <App />
  </Provider>
    </Web3ModalProvider>
  </React.StrictMode>
);
