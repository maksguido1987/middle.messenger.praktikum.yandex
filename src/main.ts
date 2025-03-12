import "./style.scss";
import { App } from "./App";

// Инициализация приложения
document.addEventListener("DOMContentLoaded", () => {
  const app = new App("#app");
  app.init();
});
