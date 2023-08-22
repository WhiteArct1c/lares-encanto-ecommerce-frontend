import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import NavBar from "./shared/NavBar"
import Footer from "./shared/Footer"
import { Outlet } from "react-router-dom"
import { ShoppingCartProvider }from "./contexts/ShoppingCartContext"
import { OrderProvider } from "./contexts/OrderContext"
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Grid2 container>
        <ToastContainer
          position="top-right"
          hideProgressBar={true}
          autoClose={3000}
          theme="dark"
        />
        <ShoppingCartProvider>
          <OrderProvider>
            <Grid2 xs={12}>
              <NavBar isAdmin={false}/>
            </Grid2>
            <Grid2 xs={12}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent:"center",
                alignItems: "center"
              }}
            >
              <Outlet/>
            </Grid2>
          </OrderProvider>
        </ShoppingCartProvider>
          <Grid2 xs={12}>
            <Footer/>
          </Grid2>
      </Grid2>
    </>
  )
}

export default App
