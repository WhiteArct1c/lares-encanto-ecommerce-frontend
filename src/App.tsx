import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import NavBar from "./shared/NavBar"
import Footer from "./shared/Footer"
import { Outlet } from "react-router-dom"

function App() {
  return (
    <>
     <Grid2 container>
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
        <Grid2 xs={12}>
          <Footer/>
        </Grid2>
     </Grid2>
    </>
  )
}

export default App
