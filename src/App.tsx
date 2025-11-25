import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Results from './pages/Results';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <nav className="bg-white border-b border-rose-100">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
            <NavLink to="/" className="text-lg font-semibold text-rose-600">
              Porto Yalda Party
            </NavLink>
            <div className="flex items-center gap-3 text-sm font-medium">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-1 rounded-md ${
                    isActive ? 'bg-rose-500 text-white' : 'text-rose-500 hover:bg-rose-100'
                  }`
                }
                end
              >
                Form
              </NavLink>
              <NavLink
                to="/results"
                className={({ isActive }) =>
                  `px-3 py-1 rounded-md ${
                    isActive ? 'bg-rose-500 text-white' : 'text-rose-500 hover:bg-rose-100'
                  }`
                }
              >
                Results
              </NavLink>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
