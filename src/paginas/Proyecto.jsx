import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useProyectos from "../hooks/useProyectos";
/* import useAdmin from "../hooks/useAdmin"; */
import useAuth from "../hooks/useAuth";
import Tarea from "../components/Tarea";
import Colaborador from "../components/Colaborador";
import ModalFormularioTarea from "../components/ModalFormularioTarea.jsx";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import Alerta from "../components/Alerta";
import { io } from "socket.io-client";

let socket;

const Proyecto = () => {

    const params =  useParams();

    const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, nuevoEstadoTarea  } = useProyectos();

    /* const { admin } = useAdmin(); */
    const { auth } = useAuth();

    const isAdmin = proyecto.creador === auth._id

    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('abrir proyecto', params.id)
    }, [])

    useEffect(() => {
        socket.on('tarea agregada', tareaNueva => {
            //con el if revisamos cual es la tarea que se quiere revisar
            if (tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva)
            }
        })

        socket.on('tarea eliminada', tareaEliminada => {
            if (tareaEliminada.proyecto === proyecto._id) {
                    eliminarTareaProyecto(tareaEliminada)
            }
        })

        socket.on('tarea actualizada', tareaActualizada => {
            if(tareaActualizada.proyecto._id === proyecto._id) {
                actualizarTareaProyecto(tareaActualizada)
            }
        })

        socket.on('nuevo estado', estadoTarea => {
            if(estadoTarea.proyecto._id === proyecto._id) {
                nuevoEstadoTarea(estadoTarea)
            }
        })

    })


    const { nombre } = proyecto;

    if ( cargando ) return 'Cargando...'

    const { msg } = alerta;

  return (

            <>
                <div className="flex justify-between">

                    <h1 className="font-black text-4xl">{nombre}</h1>
                {/* se muestra si es creador del proyecto */}
                { isAdmin && (

                        <div className="flex items-center gap-5 text-gray-500 hover:text-black cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0
                            01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>

                        <Link
                            to={`/proyectos/editar/${params.id}`}
                            className="font-bold uppercase"
                        >Editar</Link>
                        </div>
                )}

                </div>
                { isAdmin && (

                    <button
                        onClick={handleModalTarea}
                        type="button"
                        className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 hover:bg-sky-600 transition-colors text-white text-center mt-2 flex gap-2 items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25
                            0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                        </svg>

                    Nueva tarea

                    </button>

                )}

                <p className="font-bold text-xl mt-10 uppercase">Tareas del proyecto</p>

                {/* <div className="flex justify-center">
                    <div className="md:w-1/4 lg:w-1/3">
                        { msg && <Alerta alerta={alerta}/>}
                    </div>
                </div> */}

                <div
                    className="bg-white shadow mt-10 rounded-lg"
                >
                { proyecto.tareas?.length ?
                    proyecto.tareas?.map( tarea => (
                        <Tarea
                            key={tarea._id}
                            tarea={tarea}
                        />

                    )) :
                <p className=" bg-gray-500 rounded-lg text-center text-white font-bold my-10 p-10">No hay tareas asignadas al proyecto</p>

                }
                </div>



              <>
                <div className="flex justify-between mt-10 ">
                    <p className="font-bold text-xl uppercase">Colaboradores</p>
            { isAdmin && (
                    <div className="flex items-center gap-5 text-gray-500 hover:text-black cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                    </svg>

                    <Link
                        to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
                        className="font-bold uppercase"
                    >Añadir</Link>
                    </div>
            )}
                </div>

                <div
                    className="bg-white shadow mt-10 rounded-lg"
                >
                { proyecto.colaboradores?.length ?
                    proyecto.colaboradores?.map( colaborador => (

                        <Colaborador
                            key={colaborador._id}
                            colaborador={colaborador}
                            isAdmin={isAdmin}
                        />

                    )) :
                <p className=" bg-gray-500 rounded-lg text-center text-white font-bold my-10 p-10">No hay colaboradores asignados al proyecto</p>

                }
                </div>
              </>

                <ModalFormularioTarea />
                <ModalEliminarTarea />
                <ModalEliminarColaborador />
            </>
        )
}

export default Proyecto
