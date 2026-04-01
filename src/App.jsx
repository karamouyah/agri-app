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
import TransporterDashboard from './mvc/views/transporter/TransporterDashboard'
import LandingPage from './mvc/views/LandingPage'
import { getDashboardPath } from './utils/roleRoutes'
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
import AdminProducts from './mvc/views/admin/AdminProducts'
import AdminReports from './mvc/views/admin/AdminReports'

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
            <Navigate to={getDashboardPath(user.role)} replace />
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
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['buyer']} />}>
        <Route path="/buyer" element={<Layout role="buyer" />}>
          <Route path="dashboard" element={<BuyerDashboard />} />
          <Route path="search" element={<BuyerSearch />} />
          <Route path="product/:id" element={<BuyerProductDetails />} />
          <Route path="cart" element={<BuyerCart />} />
          <Route path="checkout" element={<BuyerCheckout />} />
          <Route path="orders" element={<BuyerOrders />} />
          <Route path="invoices" element={<BuyerInvoices />} />
          <Route path="confirmation/:id" element={<BuyerOrderConfirmation />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['transporter']} />}>
        <Route path="/transporter" element={<Layout role="transporter" />}>
          <Route path="dashboard" element={<TransporterDashboard />} />
          <Route path="delivery/:id" element={<TransporterDeliveryDetails />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route element={<PrivateRoute allowedRoles={['ministry']} />}>
        <Route path="/admin" element={<Layout role="ministry" />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="reports" element={<AdminReports />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
      </Route>

      <Route path="/ministry/*" element={<Navigate to="/admin/dashboard" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
