import { Link } from "react-router-dom";

function Nav() {
  return (
    <div className="flex justify-center p-5 border-b border-gray-200">
        <div>
            <Link to={'/'} className="font-bold text-lg">
                <div className="flex items-end">
                <h1 className="pop bg-clip-text text-transparent bg-gradient-to-tr from-amber-300 to-orange-400">
                    PROLEAK
                </h1>
                <p className="text-green-600 pop text-sm">
                    MI<span className="pop text-amber-900">NE</span>CRA<span className="pop text-zinc-600">FT</span>
                </p>
                </div>
                <h2 className="pop text-xs -mt-[8px] bg-clip-text text-transparent bg-gradient-to-tr from-blue-300 to-indigo-400">
                    JMM ENTERTAINMENT
                </h2>
            </Link>
        </div>
    </div>
  )
}

export default Nav