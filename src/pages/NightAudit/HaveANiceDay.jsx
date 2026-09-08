const HaveANiceDay = () => {
    const phrase = "Have a nice day";
    const characters = phrase.split("");
    const textClass = `
        text-xl
        sm:text-2xl
        md:text-3xl
        lg:text-4xl
        xl:text-5xl
        2xl:text-6xl
    `;

    return (
        <div className="fixed inset-0 z-[9999] relative w-full h-full flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-xl animate-expand-center" />

            <h1 className={`relative z-10 flex font-extrabold text-purple-700 ${textClass}`}>
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

export default HaveANiceDay