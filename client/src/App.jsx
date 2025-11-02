import { Route, Routes, useLocation } from "react-router-dom";
import { Login } from "./pages/Login";
import { Feed } from "./pages/Feed";
import { ChatBox } from "./pages/ChatBox";
import { Connections } from "./pages/Connections";
import { Messages } from "./pages/Message";
import { Discover } from "./pages/Discover";
import { Profile } from "./pages/Profile";
import { CreatePost } from "./pages/CreatePost";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Layout } from "./pages/Layout";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice";
import { fetchConnections } from "./features/connections/connectionSlice";
import { addMessages } from "./features/messages/messageSlice";
import { Notification } from "./components/Notification";

export const App = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  const { getToken } = useAuth();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoaded && isSignedIn) {
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      } else if (isLoaded && !isSignedIn) {
        console.log("No user signed in.");
      }
    };

    fetchData();
  }, [isLoaded,   isSignedIn, user]);


  useEffect(() => {
    pathnameRef.current = pathname;
  }, []);

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(
        import.meta.env.VITE_BASEURL + "/api/message/" + user.id
      );

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (pathnameRef.current === "/messages/" + message.from_user_id._id) {
          dispatch(addMessages(message));
        } else {
          toast.custom((t) => <Notification t={t} message={message} />, {
            position: "bottom-right",
          });
        }
      };
      return () => {
        eventSource.close();
      };
    }
  }, [user, dispatch]);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};
