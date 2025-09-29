"use client"
import Conatiner from "@/components/custom-ui/conatiner";
import FooterPage from "@/components/custom-ui/footer";
import { Navbarpage } from "@/components/custom-ui/navbar-view";

import { useState } from "react";


export default function Home() {
  
  return (
    <Conatiner>
      <Navbarpage />
      <FooterPage />
    </Conatiner>
    
  );
}
