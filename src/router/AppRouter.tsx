import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { ProtectedRoute } from './ProtectedRoute'
import AppShell from '@/components/layout/AppShell/AppShell'

import LandingPage from '@/pages/LandingPage'
import MapSearchPage from '@/pages/Map/MapSearchPage'
import RouteListPage from '@/pages/Map/RouteListPage'
import RouteDetailPage from '@/pages/Map/RouteDetailPage'
import TransferDetailPage from '@/pages/Map/TransferDetailPage'
import BuyTicketsPage from '@/pages/Tickets/BuyTicketsPage'
import TicketQuantityPage from '@/pages/Tickets/TicketQuantityPage'
import PayPage from '@/pages/Tickets/PayPage'
import MyTicketsPage from '@/pages/Tickets/MyTicketsPage'
import PurchaseHistoryPage from '@/pages/Tickets/PurchaseHistoryPage'
import ActiveTicketPage from '@/pages/Tickets/ActiveTicketPage'
import QRScanPage from '@/pages/Tickets/QRScanPage'
import PaymentMethodsPage from '@/pages/Tickets/PaymentMethodsPage'
import AddLeoCardPage from '@/pages/Tickets/AddLeoCardPage'
import AddBankCardPage from '@/pages/Tickets/AddBankCardPage'
import FeedbackPage from '@/pages/Feedback/FeedbackPage'
import RatingPage from '@/pages/Feedback/RatingPage'
import ComplaintsPage from '@/pages/Feedback/ComplaintsPage'
import OccupancyPage from '@/pages/Feedback/OccupancyPage'
import ProfilePage from '@/pages/Profile/ProfilePage'
import EditProfilePage from '@/pages/Profile/EditProfilePage'
import AccessibilityPage from '@/pages/Profile/AccessibilityPage'
import SettingsPage from '@/pages/Profile/SettingsPage'
import LoginPage from '@/pages/Auth/LoginPage'
import RegisterPage from '@/pages/Auth/RegisterPage'

export const AppRouter = () => (
  <BrowserRouter>
    <AppShell>
      <Routes>
        {/* Public */}
        <Route path={ROUTES.SPLASH} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.MAP} element={<MapSearchPage />} />
        <Route path={ROUTES.ROUTE_LIST} element={<RouteListPage />} />
        <Route path={ROUTES.TRANSFER_DETAIL} element={<TransferDetailPage />} />
        <Route path={ROUTES.ROUTE_DETAIL} element={<RouteDetailPage />} />
        <Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} />
        <Route path={ROUTES.RATING} element={<RatingPage />} />
        <Route path={ROUTES.COMPLAINTS} element={<ComplaintsPage />} />
        <Route path={ROUTES.OCCUPANCY} element={<OccupancyPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path={ROUTES.BUY_TICKETS} element={<BuyTicketsPage />} />
          <Route path={ROUTES.TICKET_QUANTITY} element={<TicketQuantityPage />} />
          <Route path={ROUTES.PAY} element={<PayPage />} />
          <Route path={ROUTES.MY_TICKETS} element={<MyTicketsPage />} />
          <Route path={ROUTES.PURCHASE_HISTORY} element={<PurchaseHistoryPage />} />
          <Route path={ROUTES.ACTIVE_TICKET} element={<ActiveTicketPage />} />
          <Route path={ROUTES.QR_SCAN} element={<QRScanPage />} />
          <Route path={ROUTES.PAYMENT_METHODS} element={<PaymentMethodsPage />} />
          <Route path={ROUTES.ADD_LEOCARD} element={<AddLeoCardPage />} />
          <Route path={ROUTES.ADD_BANK_CARD} element={<AddBankCardPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.EDIT_PROFILE} element={<EditProfilePage />} />
          <Route path={ROUTES.ACCESSIBILITY} element={<AccessibilityPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.MAP} replace />} />
      </Routes>
    </AppShell>
  </BrowserRouter>
)
