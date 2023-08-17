import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import NavBar from "./shared/NavBar"
import Footer from "./shared/Footer"

function App() {
  return (
    <>
     <Grid2 container rowSpacing={5}>
        <Grid2 xs={12}>
          <NavBar isAdmin={false}/>
        </Grid2>
        <Grid2 xs={12}>
          CONTEUDO VAI FICAR AQUI
        </Grid2>
        <Grid2 xs={12}>
          <Footer/>
        </Grid2>
     </Grid2>
    </>
  )
}

export default App
