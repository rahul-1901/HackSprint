import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200">
            {/* Header - assuming this will be part of a layout component, but including for completeness if it were standalone */}
            {/* If you have a separate Header component, you would place it outside or pass it in */}
            <header className="flex justify-between items-center px-8 py-4 border-b border-gray-700">
                <div className="flex items-center">
                    {/* Assuming the logo is an image or SVG */}
                    {/* <img src="/path/to/hackSprintLogo.png" alt="HackSprint Logo" className="h-8 mr-2" /> */}
                    <span className="text-white text-xl font-bold">HackSprint</span>
                </div>
                <nav>
                    <ul className="flex space-x-6">
                        <li><a href="/" className="text-gray-300 hover:text-white transition duration-300">Home</a></li>
                        <li><a href="/about" className="text-white font-semibold">About</a></li>
                        <li><a href="/quest" className="text-gray-300 hover:text-white transition duration-300">Quest</a></li>
                        <li><a href="/account" className="text-gray-300 hover:text-white transition duration-300">Account</a></li>
                    </ul>
                </nav>
            </header>

            <main className="container mx-auto px-8 py-16">
                <section className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-white mb-6 animate-fadeInUp">
                        About HackSprint
                    </h1>
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed animate-fadeInUp delay-200">
                        At HackSprint, we believe in the power of innovation, collaboration, and continuous learning. We are a dynamic platform dedicated to fostering a community of developers, problem-solvers, and tech enthusiasts.
                    </p>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                    {/* Our Mission */}
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn delay-400">
                        <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                        <p className="text-gray-400 leading-relaxed">
                            To empower individuals to push the boundaries of technology through engaging challenges, collaborative projects, and a supportive learning environment. We aim to make cutting-edge skills accessible to everyone.
                        </p>
                    </div>

                    {/* Our Vision */}
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn delay-600">
                        <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
                        <p className="text-gray-400 leading-relaxed">
                            To be the leading global platform for technological innovation and skill development, inspiring the next generation of creators and problem-solvers to build a better future.
                        </p>
                    </div>

                    {/* What We Do */}
                    <div className="bg-gray-800 p-8 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn delay-800">
                        <h2 className="text-3xl font-bold text-white mb-4">What We Do</h2>
                        <ul className="list-disc list-inside text-gray-400 space-y-2">
                            <li>Organize challenging hackathons and coding contests.</li>
                            <li>Provide resources and mentorship for aspiring developers.</li>
                            <li>Foster a vibrant community for networking and collaboration.</li>
                            <li>Highlight groundbreaking projects and innovative solutions.</li>
                        </ul>
                    </div>
                </section>

                <section className="text-center py-12 bg-gray-800 rounded-lg shadow-lg animate-fadeIn delay-1000">
                    <h2 className="text-4xl font-bold text-white mb-6">Join Our Journey</h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
                        Whether you're a seasoned developer, a curious beginner, or simply passionate about technology, there's a place for you at HackSprint.
                    </p>
                    <a
                        href="/register" 
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        Get Started Today
                    </a>
                </section>
            </main>

            {/* Optional: Footer */}
            <footer className="text-center py-8 text-gray-500 border-t border-gray-700 mt-16">
                <p>&copy; {new Date().getFullYear()} HackSprint. All rights reserved.</p>
            </footer>

            {/* Basic CSS for animations (can be in a separate CSS file or utility classes if your Tailwind config supports it) */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                .delay-200 { animation-delay: 0.2s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-600 { animation-delay: 0.6s; }
                .delay-800 { animation-delay: 0.8s; }
                .delay-1000 { animation-delay: 1s; }
            `}</style>
        </div>
    );
};

export default About;