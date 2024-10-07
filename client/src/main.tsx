import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/Home.tsx'
import './index.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import Station from './pages/Station.tsx'
import NewStationForm from './pages/NewStationForm.tsx'
import Account from './pages/Account.tsx'
import ConfigStationForm from './pages/ConfigStationForm.tsx'
import NewAccountForm from './pages/NewAccountForm.tsx'
import ConfigAccountForm from './pages/ConfigAccountForm.tsx'
import ApiTest from './pages/ApiTest.tsx'
import Umbrella from './pages/Umbrella.tsx'
import NewUmbrellaForm from './pages/NewUmbrellaForm.tsx'
import ConfigUmbrellaForm from './pages/ConfigUmbrellaForm.tsx'
import Payment from './pages/payment.tsx'
import NewPaymentForm from './pages/NewPaymentForm.tsx'
import Maintainer from './pages/Maintainer.tsx'
import ConfigMaintainerForm from './pages/ConfigMaintainerForm.tsx'
import NewMaintainerForm from './pages/NewMaintainerForm.tsx'
import MaintenanceHistory from './pages/MaintenanceHistory.tsx'
import NewMaintenanceHistoryForm from './pages/NewMaintenanceHistoryForm.tsx'
import ConfigMaintenanceHistoryForm from './pages/ConfigMaintenanceHistoryForm.tsx'
import RentalHistory from './pages/RentalHistory.tsx'
import NewRentalHistoryForm from './pages/NewRentalHistoryForm.tsx'
import ConfigRentalHistoryForm from './pages/ConfigRentalHistoryForm.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" />
  },
  {
    path: '/api/test',
    element: <ApiTest />
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/station/create',
    element: <NewStationForm />
  },
  {
    path: '/station',
    element: <Station />
  },
  {
    path: '/station/config/:stationId',
    element: <ConfigStationForm />
  },
  {
    path: '/umbrella',
    element: <Umbrella />
  },
  {
    path: '/umbrella/create',
    element: <NewUmbrellaForm />
  },
  {
    path: '/umbrella/config/:umbrellaId',
    element: <ConfigUmbrellaForm />
  },
  {
    path: '/account',
    element: <Account />
  },
  {
    path: '/account/create',
    element: <NewAccountForm />
  },
  {
    path: '/account/config/:accountId',
    element: <ConfigAccountForm />
  },
  {
    path: '/payment',
    element: <Payment />
  },
  {
    path: '/payment/create',
    element: <NewPaymentForm />
  },
  {
    path: '/maintainer',
    element: <Maintainer />
  },
  {
    path: '/maintainer/create',
    element: <NewMaintainerForm />
  },
  {
    path: '/maintainer/config/:maintainerId',
    element: <ConfigMaintainerForm />
  },
  {
    path: '/history',
    element: <MaintenanceHistory />
  },
  {
    path: '/history/create',
    element: <NewMaintenanceHistoryForm />
  },
  {
    path: '/history/config/:historyId',
    element: <ConfigMaintenanceHistoryForm />
  },
  {
    path: '/rental',
    element: <RentalHistory />
  },
  {
    path: '/rental/create',
    element: <NewRentalHistoryForm />
  },
  {
    path: '/rental/config/:rentalId',
    element: <ConfigRentalHistoryForm />
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
