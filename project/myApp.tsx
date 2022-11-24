import { BrowserRouter, Routes, Route } from "react-router-dom"
import Tournaments from "./routes/Tournaments"
import Registration from "./routes/Registration"
import Results from "./routes/Results"
import Homepage from "./routes/Homepage"
import Settings from "./routes/Settings"

export default function MyApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={< />} /> */}
        <Route path="/home" element={<Homepage />} />
        <Route path="/tournois" element={<Tournaments />} />
        <Route path='/inscription' element={<Registration />} />
        <Route path='/resultats' element={<Results />} />
        <Route path='/reglages' element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}
