import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import ServicesList from './pages/ServicesList';
import ServiceForm from './pages/ServiceForm';
import ServicesMapPage from './pages/ServicesMapPage';
import ClientsList from './pages/ClientsList';
import ClientForm from './pages/ClientForm';
import EmployeesList from './pages/EmployeesList';
import EmployeeForm from './pages/EmployeeForm';
import AircraftsList from './pages/AircraftsList';
import AircraftForm from './pages/AircraftForm';
import CulturesList from './pages/CulturesList';
import CultureForm from './pages/CultureForm';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/servicos" element={<ServicesList />} />
            <Route path="/servicos/novo" element={<ServiceForm />} />
            <Route path="/servicos/editar/:id" element={<ServiceForm />} />
            <Route path="/servicos/mapa" element={<ServicesMapPage />} />
            <Route path="/clientes" element={<ClientsList />} />
            <Route path="/clientes/novo" element={<ClientForm />} />
            <Route path="/clientes/editar/:id" element={<ClientForm />} />
            <Route path="/auxiliares" element={<EmployeesList />} />
            <Route path="/auxiliares/novo" element={<EmployeeForm />} />
            <Route path="/auxiliares/editar/:id" element={<EmployeeForm />} />
            <Route path="/aeronaves" element={<AircraftsList />} />
            <Route path="/aeronaves/novo" element={<AircraftForm />} />
            <Route path="/aeronaves/editar/:id" element={<AircraftForm />} />
            <Route path="/culturas" element={<CulturesList />} />
            <Route path="/culturas/novo" element={<CultureForm />} />
            <Route path="/culturas/editar/:id" element={<CultureForm />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;

