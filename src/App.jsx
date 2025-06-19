import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import ServicesList from './pages/ServicesList';
import ServiceForm from './pages/ServiceForm';
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
            <Route path="/servico/novo" element={<ServiceForm />} />
            <Route path="/servico/:id" element={<ServiceForm />} />
            <Route path="/clientes" element={<ClientsList />} />
            <Route path="/cliente/novo" element={<ClientForm />} />
            <Route path="/cliente/:id" element={<ClientForm />} />
            <Route path="/funcionarios" element={<EmployeesList />} />
            <Route path="/funcionario/novo" element={<EmployeeForm />} />
            <Route path="/funcionario/:id" element={<EmployeeForm />} />
            <Route path="/aeronaves" element={<AircraftsList />} />
            <Route path="/aeronave/nova" element={<AircraftForm />} />
            <Route path="/aeronave/:id" element={<AircraftForm />} />
            <Route path="/culturas" element={<CulturesList />} />
            <Route path="/cultura/nova" element={<CultureForm />} />
            <Route path="/cultura/:id" element={<CultureForm />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/configuracoes" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;

