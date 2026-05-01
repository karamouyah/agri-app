// File responsibility: Defines the frontend route tree and connects public pages, role-protected layouts, and dashboard screens.
// Used by the React frontend or build tooling as part of the full-stack agriculture app.

// Imports: bring in React, routing, UI components, services, and helpers used below.
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import { useAuth } from './context/AuthContext'
import FarmerDashboard from './mvc/views/farmer/FarmerDashboard'
import FarmerOrders from './mvc/views/farmer/FarmerOrders'
import FarmerProducts from './mvc/views/farmer/FarmerProducts'
import FarmerProfile from './mvc/views/farmer/FarmerProfile'
import FarmerRevenues from './mvc/views/farmer/FarmerRevenues'
import LoginPage from './mvc/views/LoginPage'
import RegisterPage from './mvc/views/RegisterPage'
import BuyerDashboard from './mvc/views/role/BuyerDashboard'
import BuyerProfile from './mvc/views/buyer/BuyerProfile'
import TransporterDashboard from './mvc/views/transporter/TransporterDashboard'
import TransporterProfile from './mvc/views/transporter/TransporterProfile'
import LandingPage from './mvc/views/LandingPage'
import { getEntryPath } from './utils/roleRoutes'
import BuyerSearch from './mvc/views/buyer/BuyerSearch'
import BuyerProductDetails from './mvc/views/buyer/BuyerProductDetails'
import BuyerCart from './mvc/views/buyer/BuyerCart'
import BuyerCheckout from './mvc/views/buyer/BuyerCheckout'
import BuyerOrders from './mvc/views/buyer/BuyerOrders'
import BuyerInvoices from './mvc/views/buyer/BuyerInvoices'
import BuyerOrderConfirmation from './mvc/views/buyer/BuyerOrderConfirmation'
import TransporterDeliveryDetails from './mvc/views/transporter/TransporterDeliveryDetails'
import AdminDashboard from './mvc/views/admin/AdminDashboard'
import AdminUsers from './mvc/views/admin/AdminUsers'
import AdminOrders from './mvc/views/admin/AdminOrders'
import AdminProducts from './mvc/views/admin/AdminProducts'
import AdminReports from './mvc/views/admin/AdminReports'
import AdminReportManagement from './mvc/views/admin/AdminReportManagement'
import AdminDocumentsManagement from './mvc/views/admin/AdminDocumentsManagement'
import MyReports from './mvc/views/reports/MyReports'
import MyDocuments from './mvc/views/documents/MyDocuments'

// App handles this module workflow, using its parameters and returning JSX, data, or a service result.
function App() {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/workspace"
        element={
          isAuthenticated && user ? (
            <Navigate to={getEntryPath(user)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route element={<PrivateRoute allowedRoles={['farmer']} />}>
        <Route path="/farmer" element={<Layout role="farmer" />}>
          <Route path="dashboard" element={<FarmerDashboard />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="products" element={<FarmerProducts />} />
          <Route path="orders" element={<FarmerOrders />} />
          <Route path="revenues" element={<FarmerRevenues />} />
          <Route path="reports" element={<MyReports />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['buyer']} />}>
        <Route path="/buyer" element={<Layout role="buyer" />}>
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="profile" element={<BuyerProfile />} />
          <Route path="search" element={<BuyerSearch />} />
          <Route path="product/:id" element={<BuyerProductDetails />} />
          <Route path="cart" element={<BuyerCart />} />
          <Route path="checkout" element={<BuyerCheckout />} />
          <Route path="orders" element={<BuyerOrders />} />
          <Route path="invoices" element={<BuyerInvoices />} />
          <Route path="reports" element={<MyReports />} />
          <Route path="documents" element={<MyDocuments />} />
          <Route path="confirmation/:id" element={<BuyerOrderConfirmation />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['transporter']} />}>
        <Route path="/transporter" element={<Layout role="transporter" />}>
          <Route path="dashboard" element={<TransporterDashboard />} />
          <Route path="profile" element={<TransporterProfile />} />
          <Route path="delivery/:id" element={<TransporterDeliveryDetails />} />
          <Route path="reports" element={<MyReports />} />
          <Route path="documents" element={<MyDocuments />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['ministry']} />}>
        <Route path="/admin" element={<Layout role="ministry" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="signalements" element={<AdminReportManagement />} />
          <Route path="documents" element={<AdminDocumentsManagement />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route path="/ministry/*" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
