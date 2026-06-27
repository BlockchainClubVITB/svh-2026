import { Lightbulb, Trophy, BrainCircuit, Globe } from 'lucide-react';

export default function Metrics() {
  const highlights = [
    {
      icon: <Lightbulb className="w-12 h-12 text-[#0f2942]" />,
      title: "Innovative Solutions",
      description: "Get innovative solutions to your problems in cost effective ways. Opportunity to be a part of Nation Building Opportunity."
    },
    {
      icon: <Trophy className="w-12 h-12 text-[#0f2942]" />,
      title: "Recognition And Visibility",
      description: "Nationally Recognition and visibility for your company across all premier institutions in India."
    },
    {
      icon: <BrainCircuit className="w-12 h-12 text-[#0f2942]" />,
      title: "Out-Of-The-Box Solutions",
      description: "Talented youngsters from all over the country offer out-of-the-box solutions to your problems."
    },
    {
      icon: <Globe className="w-12 h-12 text-[#0f2942]" />,
      title: "Innovation Movement Opportunity",
      description: "Be part of World's biggest Open Innovation Movement. Opportunity to work with some of the best talents in the country."
    }
  ];

  return (
    <section className="py-20 px-4 max-w-[1400px] mx-auto bg-[#fce4c0]/50 relative z-10 w-full rounded-2xl mb-12 shadow-sm border border-[#fce4c0]">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black font-inter text-[#ea580c] uppercase tracking-tight leading-tight">
          WHY SVH IS IMPORTANT FOR VIT BHOPAL<br/>AND INSTITUTIONAL GROWTH
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {highlights.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center group bg-white shadow-sm hover:shadow-md transition-shadow p-6 rounded-xl border border-gray-100">
            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300 bg-[#fce4c0] p-4 rounded-full">
              {item.icon}
            </div>
            <h3 className="text-xl font-bold font-inter text-[#0f2942] mb-4 tracking-tight px-2">{item.title}</h3>
            <p className="text-sm text-gray-800 font-roboto leading-relaxed mb-6 px-1 font-medium text-justify">{item.description}</p>
            <div className="w-2/3 h-1 bg-[#ea580c] mt-auto mx-auto rounded-full"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
