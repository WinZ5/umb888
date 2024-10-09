import { NavLink } from "react-router-dom"
import { Home, LucideIcon, User, Fuel, Umbrella, CreditCard, Wrench, ClipboardCheck, Clock } from "lucide-react"

interface TooltipNavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

const TooltipNavLink = ({ to, icon: Icon, label }: TooltipNavLinkProps) => {
  return (
    <div className="relative group mb-6">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center justify-center ${isActive ? 'text-blue-500' : 'text-gray-600'}`
        }
      >
        <Icon className="w-6 h-6" />
        <span className="sr-only">{label}</span>
      </NavLink>
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
        {label}
      </div>
    </div>
  )
}

const sidebarItems = [
  { to: '/home', icon: Home, label: 'Dashboard' },
  { to: '/station', icon: Fuel, label: 'Station' },
  { to: '/umbrella', icon: Umbrella, label: 'Umbrella' },
  { to: '/account', icon: User, label: 'Account' },
  { to: '/payment', icon: CreditCard, label: 'Payment Method'},
  { to: '/rental', icon: Clock, label: 'Rental History' },
  { to: '/maintainer', icon: Wrench, label: 'Maintainer' },
  { to: '/history', icon: ClipboardCheck, label: 'Maintainance History' }
];

const Sidebar = () => {
  return (
    <div className="w-20 bg-gray-100 flex flex-col items-center py-5">
      {/* <div className="flex items-center justify-center h-16 mb-4"> */}
      <div className="flex items-center justify-center mb-14">
        {/* <p className="w-10 h-10">Logo</p> */}
        <h1>UMB888</h1>
      </div>

      {sidebarItems.map((item) => (
        <TooltipNavLink
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
        />
      ))}
    </div>
  )
}

export default Sidebar