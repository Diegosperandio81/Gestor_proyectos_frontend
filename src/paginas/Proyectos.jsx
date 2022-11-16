import { useEffect } from "react";
import useProyectos from "../hooks/useProyectos"
import PreviewProyecto from "../components/PreviewProyecto";
import Alerta from "../components/Alerta";
import io from 'socket.io-client';

let socket;

const Proyectos = () => {

    const { proyectos, alerta } = useProyectos();

      // el useEffect va sin dependencias para que este escuchando todo el tiempo
    useEffect(() => {
      socket = io(import.meta.env.VITE_BACKEND_URL)
      socket.emit('prueba', proyectos)

      socket.on('respuesta', (persona) => {
        console.log('desde el frontend', persona)
      })
    })

    const { msg } = alerta;

  return (
    <>
        <h1 className="text-4xl font-black">Proyectos</h1>
        { msg && <Alerta alerta={alerta} />}
        <div className="bg-white shadow rounded-md mt-10 ">
            { proyectos.length ?
            proyectos.map( proyecto => (
              <PreviewProyecto
                key={proyecto._id}
                proyecto={proyecto}
              />
            ))
            : <p className="uppercase mt-5 bg-white text-center font-bold rounded-md p-5 shadow">No hay proyectos aún</p>}
        </div>
    </>
  )
}

export default Proyectos