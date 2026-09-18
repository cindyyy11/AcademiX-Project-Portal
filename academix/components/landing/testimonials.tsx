const testimonials = [
  {
    initials: 'PN',
    color: 'bg-purple-1',
    quote: "Having every milestone, deadline, and piece of feedback in one timeline meant I always knew exactly what was due next. It took a lot of the guesswork out of managing my final year project.",
    name: 'Priya N.',
    role: 'Final Year Student, Computer Science',
  },
  {
    initials: 'MW',
    color: 'bg-yellow-1',
    quote: "I supervise a dozen final year projects at once. Being able to see every student's progress and submissions from one dashboard, instead of chasing emails, has saved me hours every week.",
    name: 'Dr. Marcus W.',
    role: 'Project Supervisor',
  },
  {
    initials: 'JA',
    color: 'bg-pink-1',
    quote: "The task board kept our group honest about who was doing what. Combined with the built-in inbox, we barely needed to use anything outside AcademiX to coordinate the project.",
    name: 'Jordan A.',
    role: 'Final Year Student, Software Engineering',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-pink-2">
      <div className="max-w-6xl mx-auto px-4 land-sm:px-6">
        <div className="py-12 land-md:py-20 border-t border-n-1">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 land-md:pb-20">
            <div className="inline-flex text-sm font-semibold py-1 px-3 m-2 text-n-1 bg-green-1 rounded-full mb-4">Early feedback</div>
            <h2 className="h2 mb-4">Built with students and supervisors in mind</h2>
            <p className="text-xl text-n-3">Early feedback from the students and supervisors piloting AcademiX on their final year projects.</p>
          </div>

          {/* Testimonials */}
          <div className="max-w-sm mx-auto grid gap-8 land-lg:grid-cols-3 land-lg:gap-6 items-start land-lg:max-w-none">

            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="flex flex-col h-full p-6 bg-white border border-n-1 shadow-primary-4" data-aos="fade-up">
                <div className={`flex items-center justify-center w-12 h-12 mb-4 rounded-full ${testimonial.color} text-n-1 font-bold`}>
                  {testimonial.initials}
                </div>
                <blockquote className="text-lg text-n-3 grow">{testimonial.quote}</blockquote>
                <div className="text-n-3 font-medium mt-6 pt-5 border-t border-n-1">
                  <cite className="text-n-1 not-italic">{testimonial.name}</cite> - {testimonial.role}
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  )
}
