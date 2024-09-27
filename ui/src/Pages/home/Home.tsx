import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';

import Nav from '@/components/NavHome';
import Setting from '@/components/Setting';
import Footer from '@/components/Footer';

import BlurFade from "@/components/magicui/blur-fade";

interface VerifyResponse {
  valid: boolean;
}

function Home() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [message, setMessage] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<string | null>(null);

  const getCookie = (name: string): string | null => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  useEffect(() => {
      const token = getCookie('token');

      if (!token) {
          setIsLoggedIn(false);
          setMessage('กรุณาเข้าสู่ระบบก่อนทำรายการ');
          setTimeout(() => {
              navigate("/");
          }, 1000);
      } else {
          axios.post<VerifyResponse>('http://localhost:3000/verify', { token })
          .then((response) => {
              const data = response.data;
              if (!data.valid) {
                  setIsLoggedIn(false);
                  setMessage('');
                  setTimeout(() => {
                      navigate("/");
                  });
              }
          })
          .catch(error => {
              console.log(error);
              setIsLoggedIn(false);
              setMessage('');
              setTimeout(() => {
                  navigate("/");
              });
          });
      }
      
      axios.get('http://localhost:3000/server/status')
      .then((response) => {
          if (response.data.status === 'running') {
              setServerStatus('starting');
          } else {
              setServerStatus('stopped');
          }
      })
      .catch(error => {
          console.error('Error checking server status:', error);
          setServerStatus('stopped');
      });

  }, [navigate]);

  const startServer = () => {
    const token = getCookie('token');
    if (!token) {
        setMessage('กรุณาเข้าสู่ระบบก่อนทำรายการ');
        return;
    }

    axios.get('http://localhost:3000/server/start')
        .then(response => {
            setMessage(response.data.message);
            setServerStatus('starting');
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาดในการเริ่มต้นเซิร์ฟเวอร์:', error);
            setMessage('เกิดข้อผิดพลาดในการเริ่มต้นเซิร์ฟเวอร์');
        });
};

  const stopServer = () => {
    const token = getCookie('token');
    if (!token) {
        setMessage('กรุณาเข้าสู่ระบบก่อนทำรายการ');
        return;
    }

    axios.get('http://localhost:3000/server/stop')
        .then(response => {
            setMessage(response.data.message);
            setServerStatus('stopped');
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาดในการหยุดเซิร์ฟเวอร์:', error);
            setMessage('เกิดข้อผิดพลาดในการหยุดเซิร์ฟเวอร์');
        });
  };

  return (
    <>
      { !isLoggedIn && message && (
          <>
              <div className='my-[200px]'>
                <p className='text-center text-[20px]'>{message}</p>
                <div className='flex justify-center items-center mt-5'>
                    <ClipLoader size={30} color="#123abc" />
                </div>
              </div>
          </>
      )}
      { isLoggedIn && ( 
        <>
          <Nav />
          <div className='py-[200px]'>
            <div>

              <BlurFade delay={0.3} inView>
                <div className='text-center'>
                  <h2 className='pop font-semibold'>
                    PROLEAK SERVER 1.02
                  </h2>
                  <h1 className='text-[40px] th'>
                    จัดการเซิฟเวอร์ Minecraft ส่วนตัว <span className='bg-clip-text text-transparent bg-gradient-to-tr from-blue-300 to-indigo-400 th'>PROLEAK</span>
                  </h1>
                  <h3 className='pop font-semibold'>
                    1.21.303
                  </h3>
                </div>
                <div className='flex justify-center mt-5'>
                  {serverStatus === 'stopped' && (
                    <button 
                      onClick={startServer}
                      className='bg-gradient-to-tr from-blue-300 to-indigo-400 rounded-[15px] px-8 py-2 text-white hover:shadow transition duration-300 hover:scale-105'
                    >
                      เริ่มต้นเซิฟเวอร์
                    </button>
                  )}
                  {serverStatus === 'starting' && (
                    <button   
                      onClick={stopServer}
                      className='bg-gradient-to-tr from-red-400 to-orange-500 rounded-[15px] px-8 py-2 text-white hover:shadow transition duration-300 hover:scale-105 ml-2'
                    >
                      หยุดเซิฟเวอร์
                    </button>
                  )}
                </div>
              </BlurFade>

            </div>
          </div>
          <Setting />
          <Footer />
        </>
      )}
    </>
  )
}

export default Home;