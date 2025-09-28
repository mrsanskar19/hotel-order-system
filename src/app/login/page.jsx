import LoginForm from "@/components/form/login"
import Image from "next/image"

export default function LoginPage() {
  return (
 <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <Image src="/login_background.jpg" alt="Login background" layout="fill" objectFit="cover" quality={100} className="z-0" />
 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-70 z-0"></div>
 <LoginForm className="z-20 bg-white p-8 rounded-lg shadow-lg" />
    </div>
  )
}
