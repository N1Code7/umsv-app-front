import { BrowserRouter, Routes, Route } from "react-router-dom"
import Test from './routes/Test'
import About from './routes/About'
import Tournaments from "./routes/Tournaments"
import Registration from "./routes/Registration"
import Results from "./routes/Results"
import Homepage from "./routes/Homepage"
import Settings from "./routes/Settings"

export default function MyApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path='/test' element={<Test />} />
        <Route path='/about' element={<About />} /> */}
        <Route path="/" element={<Homepage />} />
        <Route path="/tournois" element={<Tournaments />} />
        <Route path='/inscription' element={<Registration />} />
        <Route path='/resultats' element={<Results />} />
        <Route path='/reglages' element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}
