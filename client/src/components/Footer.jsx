import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function Footer() {
    const navigate = useNavigate();

    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 mt-20 bg-gray-50">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
                {/* Branding */}
                <div className="md:max-w-96">
                    <h1
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-2xl sm:text-3xl font-bold text-primary select-none cursor-pointer"
                    >
                        <Sparkles className="w-8 h-8 text-primary" />
                        JobReadify
                    </h1>
                    <p className="mt-6 text-sm leading-relaxed">
                        Build smarter resumes with <span className="font-semibold text-primary">AI-powered insights</span>.  
                        Optimize your applications, identify skill gaps, and receive personalized career growth suggestions — all in one platform.
                    </p>
                </div>

                {/* Links & Newsletter */}
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Quick Links</h2>
                        <ul className="text-sm space-y-2">
                            <li><Link to={"/"}>Home</Link></li>
                            <li><Link to={"/about"}>About Us</Link></li>
                            <li><Link to={"/features"}>Features</Link></li>
                            <li><Link to={"/privacy"}>Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-800 mb-5">Stay Updated</h2>
                        <div className="text-sm space-y-2">
                            <p>Get resume tips, job market insights, and AI career tools delivered weekly.</p>
                            <div className="flex items-center gap-2 pt-4">
                                <input 
                                    className="border border-gray-500/30 placeholder-gray-500 focus:ring-2 ring-indigo-600 outline-none w-full max-w-64 h-9 rounded px-2" 
                                    type="email" 
                                    placeholder="Enter your email" 
                                />
                                <button className="bg-primary w-24 h-9 text-white rounded cursor-pointer hover:bg-primary/90 transition">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <p className="pt-4 text-center text-xs md:text-sm pb-5">
                Copyright 2024 © <Link to={"/"} className="font-medium text-primary">ResumeGenix</Link>.  
                All Rights Reserved.
            </p>
        </footer>
    )
}
