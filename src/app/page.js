import React from 'react';
import Image from 'next/image'
// Inline SVG Icons for features
const IconLightningBolt = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bolt">
    <path d="M21 15a4 4 0 0 0-4-4H4v8a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-8a4 4 0 0 0-4-4H4V2z" />
  </svg>
);

const IconDatabase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-database">
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
    <path d="M3 12A9 3 0 0 0 21 12"></path>
  </svg>
);

const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield">
    <path d="M12 21.4c-4.9-.7-9-3.9-9-7.4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9c0 3.5-4.1 6.7-9 7.4z"></path>
  </svg>
);

const IconCode = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const features = [
  {
    icon: <IconLightningBolt />,
    title: 'Real-time Analytics',
    description: 'Monitor user behavior and app performance with actionable, real-time data to make informed decisions.',
  },
  {
    icon: <IconDatabase />,
    title: 'Integrated Database',
    description: 'Store and sync data across all your users and devices with a powerful, flexible, and scalable database.',
  },
  {
    icon: <IconShield />,
    title: 'Secure Authentication',
    description: 'Effortlessly manage user authentication with built-in security features for various sign-in methods.',
  },
  {
    icon: <IconCode />,
    title: 'Effortless Deployment',
    description: 'Deploy your web applications with a single command and scale without managing any infrastructure.',
  },
];

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white bg-opacity-90 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.5 15.5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5zm.75-5.25a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 1.5 0z" />
            </svg>
            <span className="text-xl font-bold">Firebase Studio</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-orange-500 transition-colors">Features</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Pricing</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Docs</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Blog</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Support</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Sign In
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-full shadow-lg hover:bg-orange-600 transition-colors duration-200">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-100 to-red-100 py-20 md:py-32 text-center rounded-b-3xl shadow-inner">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              Build and Scale Your Apps with <br className="hidden md:inline" />AI and Firebase
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              A comprehensive platform for building and launching modern applications, with powerful AI integrations and a seamless developer experience.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 bg-orange-500 text-white font-bold rounded-full shadow-xl hover:bg-orange-600 transition-colors duration-200">
                Start for Free
              </button>
              <button className="px-8 py-3 text-orange-500 font-bold bg-white border border-orange-500 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              All the tools you need
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 text-orange-500 rounded-full mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mockup Section */}
        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See the Studio in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              A clean, intuitive interface that brings all your projects and data together.
            </p>
            <div className="max-w-6xl mx-auto">
              <Image
                src="https://placehold.co/1200x600/6B7280/ffffff?text=Firebase+Studio+Dashboard+Mockup"
                alt="Firebase Studio Dashboard Mockup"
                className="w-full rounded-2xl shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to build your next app?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of developers using Firebase Studio to bring their ideas to life.
            </p>
            <button className="px-8 py-4 text-lg font-bold text-white bg-orange-500 rounded-full shadow-xl hover:bg-orange-600 transition-colors duration-200">
              Get Started Now
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Logo and Social */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-2">
              <svg
                className="w-8 h-8 text-orange-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.5 15.5a1.5 1.5 0 1 1 1.5-1.5 1.5 1.5 0 0 1-1.5 1.5zm.75-5.25a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 1.5 0z" />
              </svg>
              <span className="text-xl font-bold">Firebase Studio</span>
            </div>
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Firebase Studio.
            </p>
          </div>
          {/* Links 1 */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
            </ul>
          </div>
          {/* Links 2 */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          {/* Links 3 */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
