
//server  component
 import CanvaPage from "@/app/auth-comp/room-view";

export default  async function Page({params}:{
     params:Promise<{
        id:string
     }>
}){
    
  const {id}= await params
  return <CanvaPage roomId={id} />

}