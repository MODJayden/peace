import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "sonner";
import { AppRouter } from "@/routes/AppRouter";
import { fetchCurrentUser } from "@/features/auth/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <AppRouter />
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}

export default App;
