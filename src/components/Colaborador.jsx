import useProyectos from "../hooks/useProyectos"

const Colaborador = ({colaborador, isAdmin}) => {

    const { handleModalEliminarColaborador } = useProyectos();

    const { nombre, email } = colaborador
  return (
    <div className="border-b p-5 flex justify-between items-center">
        <div>

            <p className="mb-1 text-xl">{nombre}</p>
            <p className="mb-1 text-sm text-gray-500 uppercase">{email}</p>

        </div>
    { isAdmin && (
        <div className="flex gap-2">

            <button
               type="button"
               className="bg-red-500 rounded-lg text-white font-bold px-4 py-2 shadow hover:bg-red-700 cursor-pointer transition-colors"
               onClick={() => handleModalEliminarColaborador(colaborador)}

            >
                Eliminar
            </button>

        </div>
    )}
    </div>
  )
}

export default Colaborador
