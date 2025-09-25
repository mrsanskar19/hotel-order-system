import { DashboardHeader, Footer } from "@/components/layout";

export default function layout({children}){
  return(
    <main>
    <DashboardHeader/>
      {children}
      <Footer/>
    </main>
  )
}
