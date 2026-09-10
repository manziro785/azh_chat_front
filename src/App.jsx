import "./App.css";
import { RouterProvider } from "react-router-dom";
import { routers } from "./route/route";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { SocketProvider } from "./contexts/socketContext";
import ToastViewport from "./components/ui/toastViewport";

// ChannelProvider used to sit here as well as inside the dashboard route,
// which mounted it twice. It now lives only where it is used — route.jsx.
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <RouterProvider router={routers} />
        <ToastViewport />
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
