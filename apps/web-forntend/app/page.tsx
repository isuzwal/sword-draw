"use client"
import Conatiner from "@/components/custom-ui/conatiner";
import FooterPage from "@/components/custom-ui/footer";
import { Navbarpage } from "@/components/custom-ui/navbar-view";
import { ContentPage }from "@/components/custom-ui/content"



export default function Home() {
  
  return (
    <div className="">
    <Conatiner>
      <Navbarpage />
      <ContentPage />
      <FooterPage />
    </Conatiner>
    </div>
    
  );
}
