import { formatearFecha } from "../helpers/formatearFecha";
import useProyectos from "../hooks/useProyectos";
import useAuth from "../hooks/useAuth";

const Tarea = ({tarea}) => {

    const { nombre, descripcion, fechaEntrega, prioridad, _id, estado } = tarea;

    const { handleModalEditarTarea, handleModalEliminarTarea, proyecto, cambiarEstadoTarea } = useProyectos();

    const { auth } = useAuth();

    const isAdmin = proyecto.creador === auth._id

  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div className="flex flex-col items-start">

            <p className="mb-1 text-xl">{nombre}</p>
            <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
            <p className="mb-1 text-sm text-sky-500">Entrega: {formatearFecha(fechaEntrega)}.-</p>
            <p className="mb-1 text-sm text-gray-600">Prioridad: {prioridad}</p>
            { estado && <p className="bg-green-600 rounded-lg text-xs p-1 text-white font-bold">Completada por: <span className="uppercase">{tarea.completado.nombre}</span></p>}
        </div>

        <div className="flex gap-2 flex-col lg:flex-row">


                <button
                className={`${estado ? 'bg-sky-600' : 'bg-gray-600' } rounded-lg text-white font-bold px-4 py-2 shadow hover:bg-sky-700 cursor-pointer transition-colors`}
                onClick={() => cambiarEstadoTarea(_id)}
                >
                { estado ? 'Completa' : 'Incompleta'}
                </button>



    {isAdmin && (
        <>
            <button
                className="bg-indigo-500 rounded-lg text-white font-bold px-4 py-2 shadow hover:bg-indigo-600 cursor-pointer transition-colors"
                onClick={() => handleModalEditarTarea(tarea)}
            >
                Editar
            </button>

            <button
               className="bg-red-500 rounded-lg text-white font-bold px-4 py-2 shadow hover:bg-red-700 cursor-pointer transition-colors"
               onClick={() => handleModalEliminarTarea(tarea)}
            >
                Eliminar
            </button>
        </>
    )}
        </div>
    </div>
  )
}

export default Tarea