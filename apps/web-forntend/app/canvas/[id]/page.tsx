
//server  component
 import CanvaPage from "@/app/components/room-view";

export default  async function Page({params}:{
     params:Promise<{
        id:string
     }>
}){
    
  const {id}= await params
  console.log("RoomId ---->",id);
  return <CanvaPage roomId={id} />

}