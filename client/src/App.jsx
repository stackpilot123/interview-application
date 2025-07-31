import { Admin, Auth, Candidate, Layout } from "./components";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Home from "./components/candidate/Home";
import Profile from "./components/candidate/Profile";
import JobBoard from "./components/candidate/JobBoard";
import JobApplication from "./components/candidate/JobApplication";
import MyApplications from "./components/candidate/MyApplications";
import SwipeCandidates from "./components/admin/SwipeCandidates";
import HomeAdmin from "./components/admin/Home";
import JobPosting from "./components/admin/AdminPanel";
import ViewAllJobs from "./components/admin/ViewAllJobs";
import SavedCandidates from "./components/admin/SavedCandidates";
import ShortlistedCandidates from "./components/admin/ShortlistedCandidates";
import Chat from "./components/admin/chat";
import CandidateChat from "./components/candidate/CandidateChat";
import { SocketProvider } from "./contexts/SocketContext";

const AuthRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? (
    userInfo.role === "candidate" ? (
      <Navigate to="/candidate" />
    ) : (
      <Navigate to="/admin" />
    )
  ) : (
    children
  );
};

const PrivateRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Navigate to="/auth" />} />

      <Route
        path="auth"
        element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        }
      />

      <Route
        path="admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      >
        <Route path="" element={<HomeAdmin />} />
        <Route path="swipe-applicants" element={<SwipeCandidates />} />
        <Route path="job-posting" element={<JobPosting />} />
        <Route path="view-all-jobs" element={<ViewAllJobs />} />
        <Route path="saved-candidates" element={<SavedCandidates />} />
        <Route
          path="shortlisted-candidates"
          element={<ShortlistedCandidates />}
        />
        <Route path="chat" element={<Chat />} />
      </Route>

      <Route
        path="candidate"
        element={
          <PrivateRoute>
            <Candidate />
          </PrivateRoute>
        }
      >
        <Route path="" element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="job-board" element={<JobBoard />} />
        <Route
          path="job-board/apply/:jobId"
          element={<JobApplication />}
        ></Route>
        <Route path="my-applications" element={<MyApplications />} />
        <Route path="chat" element={<CandidateChat />} />
      </Route>
      <Route path="*" element={<Navigate to="/auth" />} />
    </Route>
  )
);

function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </Provider>
  );
}

export default App;
