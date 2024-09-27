import { Link, useNavigate } from 'react-router-dom';
import { Button } from "./ui/button";

function Nav() {

    const navigate = useNavigate();
    
    const handleLogout = () => {
        document.cookie = "proleak_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate('/');
    };

  return (
    <div className="flex justify-center p-5 border-b border-gray-200">
        <div className="w-full max-w-screen-2xl">
            <div className="flex justify-between items-center">

                <div>
                    <Link to={'/home'} className="font-bold text-lg">
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

                <div className="flex items-center space-x-2">
                    <Link to={'mailto:proleak@jmmentertainment.com'}>
                        <Button variant={'outline'}>ติดต่อเรา</Button>
                    </Link>
                    <Button variant={'outline'} onClick={handleLogout}>ออกจากระบบ</Button>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Nav