import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import HackSprint from '/hackSprint.webp'
import './Navbar.css'

const Navbar = () => {

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [{ name: 'Home', pageLink: '/' }, { name: 'About', pageLink: '/about' }, { name: 'Quest', pageLink: '/quest' }, { name: 'Account', pageLink: '/login' }]

  return (
    <nav className="bg-gray-900 top-0 fixed text-gray-300 border-b-[1px] border-green-900 w-full z-50 shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img className='h-10 cursor-pointer mr-2' src={HackSprint} />
              <span className="text-2xl mt-1 font-bold text-white font-mono">
                HackSprint
              </span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.name} className="relative group">
                  <button 
                  onClick={() => {navigate(`${item.pageLink}`)}} 
                  className="cursor-pointer flex items-center space-x-1 hover:text-green-400 transition duration-300">
                    <span>{item.name}</span>
                  </button>
              </div>
            ))}
          </div>

          {/*mobile*/}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-green-400 transition duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4">
            {navItems.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="font-medium px-2 py-1">{item.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;