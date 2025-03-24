import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import TopBar from "./components/Topbar/Topbar";
import Dashboard from "./components/pages/dasboard/dashboard";
import Leads from "./components/pages/dasboard/leads/Leads";
import Reports from "./components/pages/reports/report";
import Settings from "./components/pages/settings/settings";
import "./App.css";
import AgentLeadsList from "./components/pages/Agentlead/AgentLeadsList";
import Showlead from "./components/pages/Showlead/Showlead";
import FormSelector from "./components/pages/dasboard/leads/FormSelector";
import FormBuilder from "./components/pages/dasboard/leads/FormBuilder";
import AgentLeadForm from "./components/pages/AgentForm/AgentLeadForm";
import '@fortawesome/fontawesome-free/css/all.min.css';
import PreviewForm from "../src/components/pages/dasboard/leads/PreviewForm";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Sidebar />
        <div className="main-content">
          <TopBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/Showlead" element={<Showlead/>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/AgentLead" element={<AgentLeadsList/>}/>
            <Route path="/Agentform" element={<AgentLeadForm/>}/>
            <Route path="/form-selector" element={<FormSelector />} />
            
        <Route path="/form-builder" element={<FormBuilder />} />
        <Route path="/preview-form" element={<PreviewForm/>} />
        
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
