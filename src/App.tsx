import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./assets/scss/index.scss";
import "./assets/scss/variables.scss";
import AppContext from "./context/AppContext";
import useInitialState from "./context/useInitalState";
import ContextContent from "./context/ContextContent";
import ComingSoonScreen from "./pages/coming-soon";
import { useState, createContext, useEffect } from "react";
import TicketDetailsScreen from "./pages/ticketDetails";
import HomeScreen from "./pages/home";
import ComingSoon from "./pages/newComing-soon";

function App() {
  const changeContext = (newState: object) => {
    setContext({ ...context, ...newState });
  };

  const [context, setContext] = useState({ changeContext });

  return (
    <AppContext.Provider value={context}>
      <ContextContent>
        <Router>
          <Routes>
            <Route path="/" element={<ComingSoon />} />
            {/* <Route path="/" element={<HomeScreen />} />
            <Route path="/coming-soon" element={<ComingSoonScreen />} />
            <Route
              path="/TicketDetailsScreen"
              element={<TicketDetailsScreen />}
            /> */}
          </Routes>
        </Router>
      </ContextContent>
    </AppContext.Provider>
  );
}

export default App;
