import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { io, Socket } from "socket.io-client";

let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({children}) => {

    const [ proyectos, setProyectos ] = useState([]);
    const [ alerta, setAlerta ] = useState({});
    const [ proyecto, setProyecto ] = useState({});
    const [ cargando, setCargando ] = useState(false);
    const [ modalFormularioTarea, setModalFormularioTarea ] = useState(false);
    const [ modalEliminarTarea, setModalEliminarTarea ] = useState(false);
    const [ modalEliminarColaborador, setModalEliminarColaborador ] = useState(false);
    const [ tarea, setTarea ] = useState({});
    const [ colaborador, setColaborador ] = useState({});
    const [ buscador, setBuscador ] = useState(false);


    const navigate = useNavigate();

    const { auth } = useAuth();

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token ) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios('/proyectos', config)

                setProyectos(data)

                } catch (error) {
                    console.log(error)
                }
        }

        obtenerProyectos();
    }, [auth]); //al pasarle el auth, los proyectos se cargar de inmediato, y no muestra que "no hay proyectos"

    //useEffect que se conecta a socket.io
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta({})
        }, 4000);
    }



    const submitProyecto = async proyecto => {

        if ( proyecto.id ) {
            await editarProyecto(proyecto);
        } else {
            await nuevoProyecto(proyecto);
        }
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)

            //sincronizar el state para que aparezca actualizado en la vista proyectos
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)

            //mostrar la alerta que se edito correctamente
            setAlerta({
                msg: 'El proyecto fue editado exitosamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);
            //redireccionar a la proyectos
        } catch (error) {
            console.log(error)
        }
    }

    const nuevoProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token');
            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos', proyecto, config)
            //lo siguiente sirve para que cuando agrego un nuevo proyecto, al redirigir a la pagina proyectos, aparezca el proyecto nuevo
            setProyectos([...proyectos, data]);

            setAlerta({
                msg: 'El proyecto fue creado exitosamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);


        } catch (error) {
            console.log(error)
        }
    }

    const obtenerProyecto = async id => {

        setCargando(true)
        try {
            const token = localStorage.getItem('token');
            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios(`/proyectos/${id}`, config)

            setProyecto(data)
            setAlerta({})

        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } finally {
            setCargando(false)
        }
    }

    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token');
            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)

            //sincronizar el state para que aparezca actualizado y en la vista de proyectos ya no este el proyecto que se elimino
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)

            setAlerta({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000);

        } catch (error) {
            console.log(error)
        }
    }

    //funcion que cambia el estado del modal de agregar tareas a un proyecto

    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    //funcion que captura los datos del modal de agregar tareas
    const submitTarea = async tarea => {

        if (tarea?.id) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }
    }

    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token');

            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea, config);

            setModalFormularioTarea(false)
            setAlerta({
                msg: 'Tarea agregada correctamente',
                error: false
            })
            setTimeout(() => {
                setAlerta({})
            }, 3000);

            //SOCKET IO
            socket.emit('nueva tarea', data)


        } catch (error) {
            console.log(error)
        }
    }

    const editarTarea = async tarea => {

        try {
            const token = localStorage.getItem('token');

            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config);

            setModalFormularioTarea(false)
            setAlerta({
                msg: 'Tarea actualizada correctamente',
                error: false
            })

            setTimeout(() => {
                setAlerta({})
            }, 3000);

            //SICKET io
            socket.emit('actualizar tarea', data)

        } catch (error) {
            console.log(error)
        }
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config);

            setAlerta({
                msg: data.msg,
                error: false
            })

            setModalEliminarTarea(false)

            setTarea({})

            setTimeout(() => {
                setAlerta({})
            }, 3000);

             //SOCKET IO
             socket.emit('eliminar tarea', tarea)

        } catch (error) {
            console.log(error)
        }
    }

    const submitColaborador = async email => {
        setAlerta({})
        setCargando(true)

        try {
            const token = localStorage.getItem('token');

            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)

           setColaborador(data)

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })

            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } finally {
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {


        try {
            const token = localStorage.getItem('token');

            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)

            setAlerta({
                msg: data.msg,
                error: false
               })

            setColaborador({})

            setTimeout(() => {
               setAlerta({})
            }, 3000);

        } catch (error) {
           setAlerta({
            msg: error.response.data.msg,
            error: true
           })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
      setModalEliminarColaborador(!modalEliminarColaborador)
      setColaborador(colaborador)

    }

    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id : colaborador._id}, config)

            //actualizar el DOM luego de click en "eliminar colaborador"
            const proyectoActualizado = { ...proyecto }
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter( colaboradorState => colaboradorState._id !== colaborador._id )
            setProyecto(proyectoActualizado)

            setAlerta({
                msg: data.msg,
                error:false
            })

            setColaborador({})
            setModalEliminarColaborador(false)

            setTimeout(() => {
                setAlerta({})
             }, 3000);


        } catch (error) {
            console.log(error.response)
        }
    }

    const cambiarEstadoTarea = async idTarea => {
        try {
            const token = localStorage.getItem('token');

            if (!token ) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${idTarea}`, {}, config)


            setTarea({})
            setAlerta({})

            //SOCKET IO
            socket.emit('cambiar estado', data)
        } catch (error) {
            console.log(error.response)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)

    }

    //socket io
    const submitTareasProyecto = (tarea) => {
        //Agregar la tarea al State
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [ ... proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = tarea => {
        //actualizar el DOM luego de click en "eliminar"
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter( tareaState => tareaState._id !== tarea._id)

        setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = tarea => {
        //actualizar el DOM luego de click en "guardar cambios"
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState )
        setProyecto(proyectoActualizado)
    }

    const nuevoEstadoTarea = tarea => {
        //actualizar el DOM luego de click en "comple/incompleta"
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState  )
        setProyecto(proyectoActualizado)
    }

    //funcion cerrar sesion
    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                handleModalEliminarColaborador,
                modalEliminarColaborador,
                eliminarColaborador,
                cambiarEstadoTarea,
                handleBuscador,
                buscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                nuevoEstadoTarea,
                cerrarSesionProyectos
            }}

        >{children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext;