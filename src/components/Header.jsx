import { Link } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
import useAuth from "../hooks/useAuth";
import ModalBuscador from "../components/ModalBuscador";

const Header = () => {

    const { handleBuscador, cerrarSesionProyectos } = useProyectos();
    const { cerrarSesionAuth } = useAuth();

    const handleCerrarSesion = () => {
        cerrarSesionAuth()
        cerrarSesionProyectos()
        localStorage.removeItem('token')
    }

  return (
    <header className="px-11 py-5 bg-white border-b shadow-lg">
        <div className="md:flex md:justify-between">
            <h2 className="text-5xl text-sky-600 font-black ml-12 text-center mb-5 md:mb-0">
               {/*  <span className="text-white bg-sky-600 rounded uppercase pl-1 pr-1">Pro</span><span className="">{' '}jectify</span> */}
                <span className="text-black">pro</span><span>jectify</span>
            </h2>

            <div className="flex items-center gap-6 flex-col md:flex-row">

                <button
                    type="button"
                    className="text-gray-500 font-bold uppercase cursor-pointer hover:text-black hover:underline hover:text-xl transition-all duration-500"
                    onClick={handleBuscador}
                >

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>

                </button>

                <button
                    type="button"
                    className="text-white text-sm bg-sky-600 rounded-md p-3 uppercase font-bold"
                    onClick={handleCerrarSesion}
                >Cerrar Sesión</button>
            </div>

            <ModalBuscador />

        </div>

    </header>
  )
}

export default Header