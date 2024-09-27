import { Link } from "react-router-dom";

import { FaFacebookF } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";

function Footer() {
  return (
    <div className='flex justify-center px-5 py-5 border-t border-gray-200'>
        <div className='w-full max-w-screen-2xl'>
            <div className='flex justify-between'>

                <div>
                    <div>
                        <Link to={'/'} className="pop font-semibold">
                            PROLEAK
                        </Link>
                    </div>
                    <div>
                        <p className="text-xs">
                            ©2024 JMM ENTERTAINMENT สงวนลิขสิทธิ์ทั้งหมด
                        </p>
                    </div>
                    <div>
                        <Link to={'mailto:center@jmmentertainment.com'} className="text-xs hover:underline">
                            proleak@jmmentertainment.com
                        </Link>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-5">
                    <Link to={'/'}>
                        <FaFacebookF className="text-[20px]"/>
                    </Link>
                    <Link to={'/'}>
                        <FaDiscord className="text-[20px]"/>
                    </Link>
                </div>

            </div>
        </div>
    </div>
  )
}

export default Footer