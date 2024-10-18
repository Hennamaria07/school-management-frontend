import React, { useEffect, useRef } from 'react';
import { Users, BookOpen, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Particles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();

        particle.x += particle.dx;
        particle.y += particle.dy;

        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;
      });
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animate);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}

const LoginButton = ({ icon, label, color, path }) => {
    const navigate = useNavigate();
  
    const handleClick = () => {
      navigate(path);
    };
  
    return (
      <button
        onClick={handleClick}
        className={`${color} text-white rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden group`}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <div className="flex items-center justify-center mb-2">
            {React.cloneElement(icon, { className: "w-8 h-8" })}
          </div>
          <span className="font-semibold text-sm sm:text-base text-center">{label}</span>
        </div>
        <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      </button>
    );
  }

const LandingPage = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Particles />
      <div className="bg-black bg-opacity-50 rounded-xl shadow-2xl p-6 sm:p-8 max-w-4xl w-full relative z-10 backdrop-filter backdrop-blur-sm">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-8 text-white animate-pulse">
          School Management System
        </h1>
        <p className="text-base sm:text-lg text-center mb-6 sm:mb-8 text-gray-300">
          Select your role to access the system
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <LoginButton
            icon={<UserCog />}
            label="Admin"
            color="bg-purple-600 hover:bg-purple-700"
            path="/admin/login"
          />
          <LoginButton
            icon={<Users />}
            label="Office Staff"
            color="bg-green-600 hover:bg-green-700"
            path="/staff/login"
          />
          <LoginButton
            icon={<BookOpen />}
            label="Librarian"
            color="bg-pink-600 hover:bg-pink-700"
            path="/librarian/login"
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;