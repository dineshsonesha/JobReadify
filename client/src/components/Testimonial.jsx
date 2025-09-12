import star_icon from '../assets/star_icon.svg';
import star_dull_icon from '../assets/star_dull_icon.svg';

const Testimonial = () => {
  const testimonials = [
    {
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "Amit Sharma",
      title: "Software Engineer, Infosys",
      content: "The AI Resume Builder gave me a professional-looking resume in minutes. I got interview calls much faster!",
      rating: 5,
    },
    {
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Priya Patel",
      title: "Marketing Specialist, Wipro",
      content: "It highlighted skill gaps I never noticed. Thanks to this tool, I prepared better and landed my dream job.",
      rating: 4,
    },
    {
      image: "https://randomuser.me/api/portraits/men/76.jpg",
      name: "Rahul Verma",
      title: "Data Analyst, TCS",
      content: "Super easy to use! The AI suggestions made my resume stand out from the competition.",
      rating: 5,
    },
  ];

  return (
    <div className="px-4 sm:px-20 xl:px-32 py-24 bg-gray-50">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-gray-800 text-4xl font-bold">Loved by Creators</h2>
        <p className="text-gray-500 max-w-xl mx-auto mt-3">
          Don't just take our word for it. Here's what our users are saying.
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className="relative p-8 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg hover:-translate-y-2 transition-transform duration-300"
          >
            {/* Rating Stars */}
            <div className="flex gap-1 mb-4">
              {Array(5)
                .fill(0)
                .map((_, starIdx) => (
                  <img
                    key={starIdx}
                    src={starIdx < t.rating ? star_icon : star_dull_icon}
                    alt="star"
                    className="w-5 h-5"
                  />
                ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">"{t.content}"</p>

            {/* Divider */}
            <div className="border-b border-gray-200 mb-6"></div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <img
                src={t.image}
                alt={t.name}
                className="w-14 h-14 object-cover rounded-full border-2 border-indigo-500"
              />
              <div className="text-gray-700">
                <h3 className="font-semibold">{t.name}</h3>
                <p className="text-xs text-gray-400">{t.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
