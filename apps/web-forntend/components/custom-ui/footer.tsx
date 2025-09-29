import React from "react";
import {  Github, Twitter } from "lucide-react";

export default function FooterPage() {
  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200">
      <div className="max-w-screen-lg mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between">
     
        <div className="text-sm font-medium">
          &copy; {new Date().getFullYear()} uzwal. All rights reserved.
        </div>

       
        <div className="mt-4 sm:mt-0 flex space-x-2 bg-slate-100 border-neutral-100 hover:bg-slate-100/60 cursor-pointer transition duration-300  text-shadow border px-3 py-1.5 rounded-md">
          
          <a
            href="https://twitter.com/isuzwal"
            aria-label="Twitter"
            target="_blank"
            className="text-gray-500 hover:text-blue-500 transition"
          >
            <Twitter size={24} className="text-blue-500 fill-blue-500" />
          </a>
          <a
            href="https://github.com/isuzwal"
            aria-label="GitHub"
            target="_blank"
            className="text-gray-500 hover:text-black transition"
          >
            <Github size={24} className="text-black fill-black"/>
          </a>
       
        </div>
      </div>
    </footer>
  );
}
