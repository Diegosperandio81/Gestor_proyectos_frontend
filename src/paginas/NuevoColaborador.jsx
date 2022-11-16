import { useEffect } from "react"
import useProyectos from "../hooks/useProyectos"
import { useParams } from "react-router-dom"
import FormularioColaborador from "../components/FormularioColaborador"
import Alerta from "../components/Alerta"


const NuevoColaborador = () => {

    const { obtenerProyecto, proyecto, cargando, colaborador, agregarColaborador, alerta } = useProyectos();

    const params = useParams();

    useEffect(() => {
        obtenerProyecto(params.id)
    }, [])

    if (!proyecto?._id) return <Alerta alerta={alerta}/>

  return (
    <>
     <h1 className="text-4xl font-black ">Añadir colaborador/a al proyecto: <label className="text-sky-600 ml-2">{proyecto.nombre}</label></h1>

     <div className="mt-20 flex justify-center">
        <FormularioColaborador />
     </div>

     {cargando ?
      <p className="text-center font-bold mt-10">Buscando colaborador...</p> :
     colaborador?._id && (
      <div className="flex justify-center mt-10">
        <div className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">

          <h2 className="text-center mb-10 text-2xl font-bold">Resultado: </h2>

          <div className="flex justify-between items-center">

            <p>{colaborador.nombre}</p>

            <button
              type="button"
              className="bg-gray-500 text-white rounded p-2 uppercase font-bold text-sm hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => agregarColaborador({
                email: colaborador.email
              })}
            >
            Agregar al proyecto
            </button>

          </div>
        </div>
      </div>
     )}
    </>
  )
}

export default NuevoColaborador
