import AttendeeLandingPage from "../pages/attendee-landing-page.tsx";
import { createBrowserRouter } from "react-router";
import OrganizersLandingPage from "../pages/organizers-landing-page.tsx";
import DashboardManageEventPage from "../pages/dashboard-manage-event-page.tsx";
import LoginPage from "../pages/login-page.tsx";
import ProtectedRoute from "../components/protected-route.tsx";
import CallbackPage from "../pages/callback-page.tsx";
import DashboardListEventsPage from "../pages/dashboard-list-events-page.tsx";
import DashboardListEventsPageOLD from "../pages/dashboard-list-events-page-OLD.tsx";
import PublishedEventsPage from "../pages/published-events-page.tsx";
import PurchaseTicketPage from "../pages/purchase-ticket-page.tsx";
import DashboardListTickets from "../pages/dashboard-list-tickets.tsx";
import DashboardPage from "../pages/dashboard-page.tsx";
import DashboardViewTicketPage from "../pages/dashboard-view-ticket-page.tsx";
import DashboardValidateQrPage from "../pages/dashboard-validate-qr-page.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        Component: AttendeeLandingPage,
    },
    {
        path: "/callback",
        Component: CallbackPage,
    },
    {
        path: "/login",
        Component: LoginPage,
    },
    {
        path: "/events/:id",
        Component: PublishedEventsPage,
    },
    {
        path: "/events/:eventId/purchase/:ticketTypeId",
        element: (
            <ProtectedRoute>
            <PurchaseTicketPage/>
            </ProtectedRoute>
        ),
    },
    {
        path: "/organizers",
        Component: OrganizersLandingPage,
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
            <DashboardPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/events",
        element: (
            <ProtectedRoute>
                <DashboardListEventsPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/events-old",
        element: (
            <ProtectedRoute>
                <DashboardListEventsPageOLD />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/tickets",
        element: (
            <ProtectedRoute>
            <DashboardListTickets />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/tickets/:id",
        element: (
            <ProtectedRoute>
            <DashboardViewTicketPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/validate-qr",
        element: (
            <ProtectedRoute>
            <DashboardValidateQrPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/events/create",
        element: (
            <ProtectedRoute>
            <DashboardManageEventPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard/events/update/:id",
        element: (
            <ProtectedRoute>
            <DashboardManageEventPage />
            </ProtectedRoute>
        ),
    },
]);

export default router;