import React from 'react';

const HaveANiceDay = () => {
    const phrase = "Have a nice day";
    const characters = phrase.split("");

    return (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center ">
            <div className="absolute inset-0 bg-gray-500/40 backdrop-blur-lg animate-expand-center origin-center shrink-0"></div>

            <h1 className="absolute z-10 flex text-6xl font-extrabold text-purple-800 tracking-wide drop-shadow-lg">
                {characters.map((char, index) => (
                    <span
                        key={index}
                        className="inline-block animate-bounce"
                        style={{ animationDelay: `${index * 0.15}s` }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </h1>
        </div>
       


    );
};

export default HaveANiceDay;