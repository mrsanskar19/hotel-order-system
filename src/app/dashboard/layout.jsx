import { AppHeader, Footer } from "@/components/layout";

export default function layout({children}){
  return(
    <main>
    <AppHeader/>
      {children}
      <Footer/>
    </main>
  )
}
