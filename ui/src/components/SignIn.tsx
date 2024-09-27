import { Link } from 'react-router-dom';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginResponse {
    message: string;
    proleak_token: string;
    token: string;
}

function SignIn() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'username') {
          setUsername(value);
        } else if (name === 'password') {
          setPassword(value);
        }
    };

    const setCookie = (name: string, value: string, days: number) => {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    };

    const stringToBinary = (str: string) => {
        return str.split('').map((char) => {
            return char.charCodeAt(0).toString(2).padStart(16, '0');
        }).join(' ');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const binaryUsername = stringToBinary(username);
        const binaryPassword = stringToBinary(password);
        
        try {
          const response = await axios.post<LoginResponse>('http://localhost:3000/auth/login',
            {
                username: binaryUsername, 
                password: binaryPassword 
            }
          );
          
          const { proleak_token, token } = response.data;
          setCookie('proleak_token', proleak_token, 1);
          setCookie('token', token, 1);
          
          setError('');
          navigate("/home");
        } catch (error: any) {
          setError(error.response?.data?.message || 'เกิดข้อผิดพลาด');
        } finally {
          setLoading(false);
        }
    };

  return (
    <div className="flex justify-center py-[200px] px-5">
        <div className="max-w-xl w-full">
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <h1 className="th text-center text-lg">เข้าสู่ระบบ</h1>
                        <CardDescription className="text-center">
                            จัดการเซิฟเวอร์มายคราฟ <span className="pop text-sm font-light">PROLEAK by JMM ENTERTAINMENT</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="space-y-1">
                            <Label htmlFor="username">ชื่อผู้ใช้</Label>
                            <Input 
                            id="username" 
                            name="username"
                            placeholder="ชื่อผู้ใช้"
                            value={username}
                            onChange={handleChange} 
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">รหัสผ่าน</Label>
                            <Input 
                                type="password" 
                                name="password"
                                id="password" 
                                placeholder="รหัสผ่าน" 
                                value={password}
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                            <Button 
                                type="submit" 
                                variant={'outline'} 
                                className='flex items-center gap-2'
                                disabled={loading}
                            >
                            {loading ? 'กำลังดำเนินการ...' : <>เข้าสู่ระบบ</>}
                        </Button>
                    </CardFooter>
                </form>
                <div className='pb-4'>
                    <p className='text-sm text-zinc-500 text-center'>
                        ติดต่อข้อมูลเพิ่มเติม <Link to={'/'} className='pop underline text-blue-400'>JMM ENTERTAINMENT</Link>
                    </p>
                </div>
            </Card>
        </div>
    </div>
  )
}

export default SignIn