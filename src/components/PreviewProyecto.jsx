import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PreviewProyecto = ({proyecto}) => {

  const { auth } = useAuth();

  const { nombre, _id, cliente, creador } = proyecto;


  return (
    <div className="border-b p-5 flex flex-col md:flex-row justify-between">
      <div className="flex items-center gap-2">
          <p className="flex-1">
            {nombre}

            <span className="text-sm text-gray-500 uppercase">
              {''} {cliente}
            </span>

          </p>

        { auth._id !== creador && (
          <p className="p-1 font-bold text-white bg-green-500 rounded-lg uppercase text-xs">Colaborador/a</p>
        )}

      </div>
      <Link
        to={`${_id}`}
        className="text-white rounded p-2 font-semibold hover:text-sky-600 hover:bg-white uppercase bg-sky-600 hover:text-xl transition-all  duration-500 cursor-pointer"
      >Ver proyecto</Link>

    </div>
  )
}

export default PreviewProyecto