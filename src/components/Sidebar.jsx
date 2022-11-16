import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {

    const { auth } = useAuth();

    const { nombre } = auth;

  return (
    <aside className="md:w-1/3 lg:w-1/5 xl:w-1/5 px-5 py-10 bg-gray-600">
        <p className="text-xl font-bold text-white mb-10">Hola {nombre}</p>
        <Link
            to="crear-proyecto"
            className="bg-sky-600 w-full p-3 hover:p-10 hover:bg-gray-700 hover:text-xl text-white uppercase font-bold block mt-5 text-center rounded-lg transition-all duration-500"
        >Nuevo Proyecto</Link>

        <Link
            to="/proyectos"
            className="bg-sky-600 w-full p-3 hover:p-10 hover:bg-gray-700 hover:text-xl text-white uppercase font-bold block mt-5 text-center rounded-lg transition-all duration-500"
        >Mis Proyectos</Link>

    </aside>
  )
}

export default Sidebar
