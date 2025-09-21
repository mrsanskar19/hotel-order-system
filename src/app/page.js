import * as UI from "@/components/ui"

export default function Home(){
  return(
    <main>
      <UI.Input label="Username"/>
      <UI.Input label="Password"/>
      <UI.Button variant="primary">Login</UI.Button>
    </main>
  )
}
