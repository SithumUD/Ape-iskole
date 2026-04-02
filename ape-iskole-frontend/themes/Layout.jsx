import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboardIcon,
  UsersIcon,
  GraduationCapIcon,
  BookOpenIcon,
  ClipboardListIcon,
  FileTextIcon,
  CalendarIcon,
  CheckSquareIcon,
  TrophyIcon,
  PackageIcon,
  ShoppingCartIcon,
  ShieldIcon,
  MenuIcon,
  XIcon,
  BellIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  DollarSignIcon,
  ChevronLeftIcon,
  HomeIcon,
  SchoolIcon,
  BookOpenCheckIcon,
} from "lucide-react";
import { SettingsModal } from "./SettingsModal";
import { ProfileDropdown } from "./ProfileDropdown";
import { ProfileModal } from "./ProfileModal";
import { useAuth } from "../../context/AuthContext";
import { ToastContainer } from "../Toast/ToastContainer";
import Topbar from "./topbar";

// Enhanced navigation with categories
const navigation = [
  {
    category: "Dashboard",
    items: [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboardIcon,
        description: "Overview and analytics",
        // Dashboard is always visible, no permission check needed
      },
    ],
  },
  {
    category: "Academic Management",
    items: [
      {
        name: "Students",
        href: "/students",
        icon: GraduationCapIcon,
        description: "Manage student records",
        featureCode: "student-mgmt",
      },
      {
        name: "Teachers",
        href: "/teachers",
        icon: UsersIcon,
        description: "Manage teaching staff",
        featureCode: "teacher-mgmt",
      },
      {
        name: "Classes",
        href: "/classes",
        icon: BookOpenIcon,
        description: "Class organization",
        featureCode: "class-mgmt",
      },
      {
        name: "Subjects",
        href: "/subjects",
        icon: ClipboardListIcon,
        description: "Curriculum subjects",
        featureCode: "subject-mgmt",
      },
      {
        name: "Complaints",
        href: "/complaints",
        icon: FileTextIcon,
        description: "Manage complaints",
        featureCode: "complaint-mgmt",
      },
    ],
  },
  {
    category: "Academic Operations",
    items: [
      {
        name: "Assignments",
        href: "/assignments",
        icon: FileTextIcon,
        description: "Assignments & submissions",
        featureCode: "assignment-mgmt",
      },
      {
        name: "Exams",
        href: "/exams",
        icon: CalendarIcon,
        description: "Exams & schedules",
        featureCode: "exam-mgmt",
      },
      {
        name: "Attendance",
        href: "/attendance",
        icon: CheckSquareIcon,
        description: "Attendance tracking",
        featureCode: "attendance-mgmt",
      },
      {
        name: "Performace",
        href: "/performance",
        icon: CheckSquareIcon,
        description: "Student performance analize",
        featureCode: "attendance-mgmt",
      },
    ],
  },
  {
    category: "Administration",
    items: [
      {
        name: "Role Management",
        href: "/roles",
        icon: ShieldIcon,
        description: "User roles & permissions",
        featureCode: "role-mgmt",
      },
      {
        name: "Users",
        href: "/users",
        icon: UsersIcon,
        description: "System users",
        featureCode: "user-mgmt",
      },
      {
        name: "Payments",
        href: "/payments",
        icon: DollarSignIcon,
        featureCode: "payment-mgmt",
        description: "Fee management",
      },
      {
        name: "Payment Approvals",
        href: "/payment-approvals",
        icon: CheckSquareIcon,
        featureCode: "payment-approval-mgmt",
        description: "Approve pending payments",
      },
      {
        name: "Employee Management",
        href: "/employee-management",
        icon: UsersIcon,
        featureCode: "employee-mgmt",
        description: "Manage employee records",
      },
      {
        name: "Payroll Management",
        href: "/payroll-management",
        icon: CheckSquareIcon,
        featureCode: "payroll-mgmt",
        description: "Manage payroll processes",
      },
      {
        name: "Finance Analytics",
        href: "/finance-analytics",
        icon: DollarSignIcon,
        featureCode: "finance-mgmt",
        description: "Financial insights and reports",
      },
    ],
  },
  {
    category: "Resources",
    items: [
      {
        name: "Suppliers",
        href: "/suppliers",
        icon: PackageIcon,
        description: "Vendor management",
        featureCode: "supplier-mgmt",
      },
      {
        name: "Procurement",
        href: "/procurement",
        icon: ShoppingCartIcon,
        description: "Purchases & inventory",
        featureCode: "procurement-mgmt",
      },
    ],
  },
  {
    category: "System",
    items: [
      {
        name: "System Logs",
        href: "/system-logs",
        icon: FileTextIcon,
        description: "View and manage system logs",
        featureCode: "system-logs-mgmt",
      },
    ],
  },
];

export function Layout({ children }) {
  const location = useLocation();
  const { currentUser, hasPermission } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");

  // Filter navigation based on permissions and dataScope
  const filteredNavigation = React.useMemo(() => {
    if (!currentUser) return [];

    const dataScope = currentUser?.role?.dataScope;

    // Student users: Show StudentWide pages with categories, no permission checks (fixed permissions)
    if (dataScope === "student") {
      const studentAllowedHrefs = new Set([
        "/",
        "/dashboard",
        "/attendance",
        "/exams",
        "/assignments",
        "/payments",
        "/subjects",
        "/complaints",
      ]);
      // Keep categories for students
      return navigation
        .map((category) => ({
          ...category,
          items: category.items.filter((item) =>
            studentAllowedHrefs.has(item.href)
          ),
        }))
        .filter((category) => category.items.length > 0);
    }

    // For teachers and admins: Remove categories, show flat menu items with dynamic permission checks
    // Collect all items from all categories and filter by permissions
    const allItems = navigation.flatMap((category) => category.items);

    const filteredItems = allItems.filter((item) => {
      // Dashboard is always visible (no featureCode)
      if (!item.featureCode) return true;
      // Check permission for the feature dynamically
      return hasPermission(item.featureCode, "view");
    });

    // Return as a single category for non-student users (no categories)
    return filteredItems.length > 0
      ? [
          {
            category: "Menu",
            items: filteredItems,
          },
        ]
      : [];
  }, [currentUser, hasPermission]);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  // Find active category based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    for (const category of filteredNavigation) {
      const activeItem = category.items.find(
        (item) => item.href === currentPath
      );
      if (activeItem) {
        setActiveCategory(category.category);
        break;
      }
    }
  }, [location.pathname, filteredNavigation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-40 lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white/95 backdrop-blur-xl border-r border-gray-200/80 z-50 transform transition-all duration-500 ease-out shadow-2xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${
          sidebarCollapsed ? "lg:w-20" : "lg:w-80"
        } overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section - Enhanced */}
          <div className="p-6 border-b border-gray-200/60 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-white rounded-full"></div>
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                <SchoolIcon className="w-7 h-7 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="overflow-hidden">
                  <h1 className="text-2xl font-bold text-white tracking-tight truncate bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                    EduTrack Pro
                  </h1>
                  <p className="text-xs text-blue-100 font-medium truncate mt-1">
                    Smart Education Management
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation - Enhanced with custom scrollbar */}
          <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
            <div className="space-y-6 px-4">
              {filteredNavigation.map((category, categoryIndex) => {
                const isStudent = currentUser?.role?.dataScope === "student";
                return (
                  <div key={category.category} className="space-y-2">
                    {/* Category Header - Only show for students when not collapsed */}
                    {!sidebarCollapsed && isStudent && (
                      <div className="px-3 py-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          {category.category}
                        </p>
                      </div>
                    )}

                    {/* Navigation Items */}
                    <div className="space-y-1">
                      {category.items.map((item) => {
                        const isActive = location.pathname === item.href;
                        const isCategoryActive =
                          activeCategory === category.category;

                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={`group flex items-center ${
                              sidebarCollapsed
                                ? "justify-center px-3"
                                : "justify-between px-4"
                            } py-3 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                              isActive
                                ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-2xl shadow-indigo-200/50 border border-indigo-200/30"
                                : isCategoryActive
                                ? "bg-blue-50 text-blue-700 border border-blue-200/50 shadow-sm"
                                : "text-gray-600 hover:bg-white hover:shadow-lg hover:border hover:border-gray-200/50"
                            }`}
                            title={
                              sidebarCollapsed
                                ? `${item.name} - ${item.description}`
                                : ""
                            }
                            onMouseEnter={() =>
                              !sidebarCollapsed &&
                              setActiveCategory(category.category)
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`relative ${
                                  isActive
                                    ? "text-white"
                                    : isCategoryActive
                                    ? "text-blue-600"
                                    : "text-gray-400 group-hover:text-indigo-600"
                                } transition-colors duration-300`}
                              >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                              </div>
                              {!sidebarCollapsed && (
                                <div className="flex-1 min-w-0">
                                  <span
                                    className={`font-medium text-sm block ${
                                      isActive ? "text-white" : "text-gray-900"
                                    }`}
                                  >
                                    {item.name}
                                  </span>
                                  <span
                                    className={`text-xs block mt-0.5 ${
                                      isActive
                                        ? "text-blue-100"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {item.description}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Active indicator and chevron */}
                            {!sidebarCollapsed && (
                              <div className="flex items-center gap-2">
                                {isActive && (
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                )}
                                <ChevronRightIcon
                                  className={`w-4 h-4 transition-transform duration-300 ${
                                    isActive
                                      ? "text-white transform rotate-90"
                                      : "text-gray-400 group-hover:text-indigo-600"
                                  }`}
                                />
                              </div>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Footer Section - Enhanced */}
          <div
            className={`border-t border-gray-200/60 bg-gradient-to-t from-gray-50 to-white p-4 ${
              sidebarCollapsed ? "text-center" : ""
            }`}
          >
            {!sidebarCollapsed ? (
              <div className="space-y-3">
                {/* Version Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">
                      EduTrack Pro
                    </p>
                    <p className="text-[10px] text-gray-500">v1.0</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center mx-auto">
                  <span className="text-white text-[10px] font-bold">✓</span>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={`transition-all duration-500 ease-out ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-80"
        }`}
      >
        {/* Enhanced Topbar */}
        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          setSettingsOpen={setSettingsOpen}
          profileDropdownOpen={profileDropdownOpen}
          setProfileDropdownOpen={setProfileDropdownOpen}
          setProfileModalOpen={setProfileModalOpen}
          activeCategory={activeCategory}
        />

        {/* Page content with enhanced styling */}
        <main className="min-h-screen p-6 lg:p-8 bg-transparent">
          <div className="max-w-7xl mx-auto">
            {/* Animated background elements for main content */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-20 animate-float"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-3xl opacity-20 animate-float-delayed"></div>
            </div>

            {/* Content container */}
            <div className="relative">{children}</div>
          </div>
        </main>
      </div>

      {/* Toast Container */}
      <ToastContainer />

      {/* Enhanced Modals */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* Custom CSS for scrollbar */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(20px) rotate(-180deg);
          }
        }
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Enhanced Topbar component to match the new design
export function EnhancedTopbar({
  sidebarOpen,
  setSidebarOpen,
  sidebarCollapsed,
  setSidebarCollapsed,
  setSettingsOpen,
  profileDropdownOpen,
  setProfileDropdownOpen,
  setProfileModalOpen,
  activeCategory,
}) {
  const { currentUser } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-30 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg"
            >
              {sidebarOpen ? (
                <XIcon className="w-6 h-6 text-gray-700" />
              ) : (
                <MenuIcon className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Desktop collapse button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 transition-all duration-300 group hover:shadow-lg"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRightIcon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              )}
            </button>

            {/* Breadcrumb/Active Category */}
            {activeCategory && (
              <div className="hidden md:flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">
                  {activeCategory}
                </span>
              </div>
            )}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 group hover:shadow-lg">
              <BellIcon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            </button>

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 group hover:shadow-lg"
            >
              <SettingsIcon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
            </button>

            {/* User Profile */}
            <div className="relative pl-3 ml-3 border-l border-gray-200">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {currentUser?.name?.charAt(0)}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {currentUser?.name}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
                <ChevronDownIcon
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <ProfileDropdown
                isOpen={profileDropdownOpen}
                onClose={() => setProfileDropdownOpen(false)}
                onOpenProfile={() => setProfileModalOpen(true)}
                onLogout={() => console.log("Logout")}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Layout;
